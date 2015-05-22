var http = require('http');
var Promise = require('bluebird');
var duplexer = require('duplexer2');
var through = require('through2');
var bl = require('bl');
var qs = require('querystring');
function mwtest(mw) {
    var ts = new mwtest.TestableServer(mw);
    return ts.ready().thenReturn(ts);
}
var mwtest;
(function (mwtest) {
    var TestableServer = (function () {
        function TestableServer(mw) {
            var _this = this;
            this.server = http.createServer(function (req, res) {
                // For compatibility with express
                req["originalUrl"] = req.url;
                try {
                    var extra = JSON.parse(req.headers["x-mwtest-extras"]);
                    Object.keys(extra).forEach(function (key) {
                        req[key] = extra[key];
                    });
                }
                catch (e) {
                }
                mw(req, res, function (err) {
                    if (err)
                        throw err;
                });
            });
            this._ready = new Promise(function (resolve, reject) {
                _this.server.listen(0, function (_) { return resolve(_this._isReady = true); });
            });
        }
        TestableServer.prototype.port = function () {
            // node.d.ts has abroken definition for this.server
            return this.server.address().port;
        };
        TestableServer.prototype.ready = function () {
            return this._ready;
        };
        TestableServer.prototype.tester = function (extras) {
            if (!this._isReady)
                throw new Error("The testable server is not listening");
            return new Tester(this, extras);
        };
        TestableServer.prototype.close = function () {
            var _this = this;
            return new Promise(function (resolve, reject) { return _this.server.close(resolve); });
        };
        TestableServer.prototype.address = function () {
            var a = this.server.address();
            var ip = a.address === '0.0.0.0' ? 'localhost' : a.address;
            return 'http://' + ip + ':' + a.port;
        };
        return TestableServer;
    })();
    mwtest.TestableServer = TestableServer;
    function replaceAll(str, context) {
        var reg = /:([^\/]+)/;
        var match;
        var names = {};
        while ((match = str.match(reg))) {
            var name = match[1], inner = match[0];
            str = str.substr(0, match.index) + context[name] + str.substr(match.index + inner.length);
            names[name] = true;
        }
        return str;
    }
    var Tester = (function () {
        function Tester(ts, extras) {
            this.ts = ts;
            this.extras = extras || {};
        }
        Tester.prototype.request = function (opt) {
            var p = Promise.defer();
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
                reqOptions.headers['Content-Type'] = 'application/json';
                reqOptions.headers['Content-Length'] = postData.length;
            }
            if (opt.query != null)
                reqOptions.path += '?' + qs.stringify(opt.query);
            var inp = through(), out = through();
            var req = http.request(reqOptions, function (res) {
                res.on('error', p.reject.bind(p));
                res.pipe(bl(function (err, buf) {
                    if (err)
                        return p.reject(err);
                    var unparsed = res.body = buf.toString();
                    if (opt.json)
                        try {
                            res.body = JSON.parse(res.body);
                        }
                        catch (e) {
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
            req.on('error', p.reject.bind(p));
            if (opt.body != null || opt.method == 'GET' || opt.method == 'DELETE')
                req.end(postData);
            else
                inp.pipe(req);
            var ret = duplexer(inp, out);
            ret.then = function (succ, err) {
                return p.promise.then(succ, err);
            };
            ret.expect = function (code) {
                expectedCode = code;
                return ret;
            };
            ret.promise = function () {
                return p.promise;
            };
            return ret;
        };
        Tester.prototype.get = function (url, query, opt) {
            query = query || {};
            opt = opt || {};
            opt.url = url;
            opt.method = 'GET';
            opt.query = query || {};
            return this.request(opt);
        };
        Tester.prototype.post = function (url, body, opt) {
            opt = opt || {};
            opt.url = url;
            opt.method = 'POST';
            opt.body = body;
            return this.request(opt);
        };
        Tester.prototype.delete = function (url, query, opt) {
            query = query || {};
            opt = opt || {};
            opt.url = url;
            opt.method = 'DELETE';
            opt.query = query || {};
            return this.request(opt);
        };
        Tester.prototype.getJSON = function (url, query, opt) {
            query = query || {};
            opt = opt || {};
            opt.json = true;
            return this.get(url, query, opt);
        };
        Tester.prototype.postJSON = function (url, body, opt) {
            opt = opt || {};
            opt.json = true;
            return this.post(url, body, opt);
        };
        Tester.prototype.deleteJSON = function (url, query, opt) {
            query = query || {};
            opt = opt || {};
            opt.json = true;
            return this.delete(url, query, opt);
        };
        Tester.prototype.getJSONAsync = function (url, query, opt) {
            return this.getJSON(url, query, opt);
        };
        Tester.prototype.postJSONAsync = function (url, body, opt) {
            return this.postJSON(url, body, opt);
        };
        Tester.prototype.deleteJSONAsync = function (url, query, opt) {
            return this.deleteJSON(url, query, opt);
        };
        return Tester;
    })();
    mwtest.Tester = Tester;
})(mwtest || (mwtest = {}));
module.exports = mwtest;
