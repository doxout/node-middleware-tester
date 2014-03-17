var http = require('http');

var Promise = require('bluebird');
var duplexer = require('duplexer2');
var through = require('through2');

var Tester = (function () {
    function Tester(ts, extras) {
    }
    Tester.prototype.request = function (opt) {
        var adr = this.ts.getServerInfo();
        opt.headers["x-mwtest-extras"] = JSON.stringify(this.extras);
        var req = http.request({
            method: opt.method,
            path: opt.url,
            host: adr.address,
            port: adr.port,
            headers: opt.headers
        });
        var resp = through();
        var ret = duplexer(req, resp);
    };
    return Tester;
})();
exports.Tester = Tester;

var TestableServer = (function () {
    function TestableServer(mw) {
        var _this = this;
        this.server = http.createServer(function (req, res) {
            var extra = JSON.parse(req.headers["x-mwtest-extras"]);
            Object.keys(extra).forEach(function (key) {
                req[key] = extra[key];
            });
            mw(req, res, function (err) {
                if (err)
                    throw err;
            });
        });
        this._ready = new Promise(function (resolve, reject) {
            _this.server.listen(0, function (_) {
                resolve(undefined);
            });
        });
    }
    TestableServer.prototype.getServerInfo = function () {
        return this.server.address();
    };
    TestableServer.prototype.ready = function () {
        return this._ready;
    };
    TestableServer.prototype.createTester = function (extras) {
        return new Tester(this, extras);
    };
    return TestableServer;
})();
exports.TestableServer = TestableServer;

function create(mw) {
    var ts = new TestableServer(mw);
    return ts.ready().thenReturn(ts);
}
exports.create = create;
