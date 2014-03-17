var mwtest = require('../lib/index');
var t = require('blue-tape');
var router = require('flask-router-plus')();
var through = require('through2');
var connect = require('connect');

router.get('/get', function(req, res) {
    var q = require('url').parse(req.url);
    var query = require('querystring').parse(q.query);
    console.log("GET /get", query);
    res.answer(200, query);
});

router.get('/param/x', function(req, res) {
    res.answer(200, {ok: true});
});

router.post('/post', connect.bodyParser(), function(req, res) {
    console.log("POST, /post");
    console.log("body", req.body);
    res.answer(200, {a: 1, b: 2});
});

router.get('/extras', function(req, res) {
    console.log('extras', req.extras);
    res.answer(200, JSON.stringify({extras: req.extras}));
});

var server, tester, testerExtras;


function fakeFile(opt) {
    opt = opt || {};
    opt.content = opt.content || 'Hello world\n';
    var s = through();
    s.length = new Buffer(opt.content).length;
    setTimeout(function() {
        s.push(opt.content);
        s.push(null);
    }, 1);
    return s;
}



t.test("prepare", function(t) {
    return mwtest(router.route).then(function(server_) {
        server = server_;
        tester = server.tester();
        testerExtras = server.tester({extras: {hasThem: true}});
    });
});


t.test('get', function(t) {
    return tester.getJSON('/get', {a: 1, b:2}).then(function(res) {
        t.equals(res.body.a, '1');
        t.equals(res.body.b, '2');
    });
});


t.test('params', function(t) {
    return tester.getJSON('/param/:p', {p: 'x'}).then(function(res) {
        t.ok(true, "param was transfered");
    });
});


t.test('post', function(t) {
    return tester.postJSON('/post', {a: 1, b:2}).then(function(res) {
        t.equals(res.body.a, 1);
        t.equals(res.body.b, 2);
    });
});

t.test('post-pipe', function(t) {
    return fakeFile({content: JSON.stringify({a: 1, b: 2})})
        .pipe(tester.postJSON('/post')).then(function(res) {
            t.equals(res.body.a, 1);
            t.equals(res.body.b, 2);
        });
});


t.test('extras', function(t) {
    return testerExtras.getJSON('/extras').then(function(res) {
        t.ok(res.body.extras.hasThem, 'has extras');
    });
});

t.test("close", function(t) {
    return server.close();
});

