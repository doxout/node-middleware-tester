import http     = require('http');
import net      = require('net');
import stream   = require('stream');
import Promise  = require('bluebird');
import duplexer = require('duplexer2');
import through  = require('through2');
import bl       = require('bl');
import qs       = require('querystring')

function mwtest(mw:mwtest.IMiddleware): Promise<mwtest.TestableServer> {
    var ts = new mwtest.TestableServer(mw);
    return ts.ready().thenReturn(ts);
}

module mwtest {

    export interface IMiddleware {
        (req: http.ServerRequest,
         res: http.ServerResponse,
         handler: (e: Error) => void):void;
    }

    export interface BodyResponse
    extends http.ServerResponse {
        body: string;
    }

    export interface PromiStream
    extends Promise.IPromise<BodyResponse>, ReadWriteStream {
        expect: (code: number) => PromiStream;
        promise: () => Promise.IPromise<BodyResponse>
    }

    export interface RequestOptions {
        url: string;
        method: string;
        query: any;
        body: any;
        headers: any;
        json: boolean;
    }

    export class TestableServer {
        private server:http.Server;
        private _ready: Promise<boolean>;
        private _isReady: boolean;
        constructor(mw:IMiddleware) {
            this.server = http.createServer((req, res) => {
                // For compatibility with express
                req["originalUrl"] = req.url;
                var extra = JSON.parse(req.headers["x-mwtest-extras"]);
                Object.keys(extra).forEach(function(key) {
                    req[key] = extra[key];
                });
                mw(req, res, err => { if (err) throw err; });
            });
            this._ready = new Promise<boolean>((resolve, reject) => {
                this.server.listen(0, _ => resolve(this._isReady = true));
            })
        }
        public port() {
            // node.d.ts has abroken definition for this.server
            return (<net.Server><any>this.server).address().port;
        }
        public ready() { return this._ready; }
        public tester(extras: any) {
            if (!this._isReady)
                throw new Error("The testable server is not listening");
            return new Tester(this, extras);
        }
        public close() {
            return new Promise(
                (resolve, reject) => this.server.close(resolve));
        }

        public address() {
            var a = (<net.Server><any>this.server).address();
            var ip = a.address === '0.0.0.0'?'localhost': a.address;
            return 'http://' + ip + ':' + a.port;
        }

    }

    function replaceAll(str:string, context:any) {
        var reg = /:([^\/]+)/;
        var match;
        var names = {};
        while ((match = str.match(reg))) {
            var name = match[1], inner = match[0];
            str = str.substr(0, match.index) + context[name]
                + str.substr(match.index + inner.length);
            names[name] = true;
        }
        return str;
    }

    export class Tester {

        private ts: TestableServer;
        private extras: any;
        constructor(ts:TestableServer, extras: any) {
            this.ts     = ts;
            this.extras = extras || {};
        }

        public request(opt: RequestOptions): PromiStream {
            var p            = Promise.defer();
            var expectedCode = 200;

            var reqOptions = {
                hostname: 'localhost',
                method: opt.method,
                path: replaceAll(opt.url, opt.query),
                port: this.ts.port(),
                headers: opt.headers || {}
            };
            reqOptions.headers["x-mwtest-extras"] = JSON.stringify(this.extras);
            var postData;
            if (opt.body != null) {
                postData = new Buffer(JSON.stringify(opt.body));
                reqOptions.headers['Content-Type'] =
                    'application/json';
                reqOptions.headers['Content-Length'] = postData.length
            }
            if (opt.query != null)
                reqOptions.path += '?' + qs.stringify(opt.query);

            var inp = through(), out = through();
            var req = http.request(reqOptions, (res) => {
                res.on('error', p.reject.bind(p));
                res.pipe(bl(function(err, buf) {
                    if (err) return p.reject(err);
                    var unparsed = res.body = buf.toString();
                    if (opt.json) try {
                        res.body = JSON.parse(res.body);
                    } catch (e) {
                        res.body = e;
                    }
                    if (res.statusCode != expectedCode) {
                        var msg = res.body.stack || unparsed;
                        err = new Error("HTTP code " + res.code + ' ' + msg);
                    }
                    p.callback(err, res);
                }));
                res.pipe(out);
            });
            req.on('error', p.reject.bind(p))

            if (opt.body != null || opt.method == 'GET')
                req.end(postData);
            else
                inp.pipe(req);
            var ret:any = duplexer(inp, out);
            ret.then = function(succ, err) {
                return p.promise.then(succ, err);
            }
            ret.expect = function(code) {
                expectedCode = code;
                return ret;
            }
            ret.promise = function() { return p.promise; }
            return <PromiStream>ret;
        }
        public get(url:string, query:any, opt:any) {
            query = query || {}
            opt = opt || {};
            opt.url = url;
            opt.method = 'GET';
            opt.query = query || {};
            return this.request(opt);
        }
        public post(url:string, body:any, opt) {
            opt = opt || {};
            opt.url = url;
            opt.method = 'POST';
            opt.body = body;
            return this.request(opt);
        }
        public getJSON(url, query, opt) {
            console.log(url, query, opt);
            query = query || {};
            opt = opt || {}
            opt.json = true;
            return this.get(url, query, opt)
        }
        public postJSON(url, body, opt) {
            opt = opt || {};
            opt.json = true;
            return this.post(url, body, opt);
        }
        public getJSONAsync(url, query, opt) {
            return this.getJSON(url, query, opt);
        }
        public postJSONAsync(url, body, opt) {
            return this.postJSON(url, body, opt);
        }
    }

}


export = mwtest;
