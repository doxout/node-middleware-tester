var mwtest = require('../index');
var t = require('tap');
var router = require('flask-router-plus')();

router.get('/get', function(req, res) {
    res.answer(200, req.query);
});

router.post('/post', function(req, res) {
    res.answer(200, req.body);
});

var tester = mwtest(router.route);

t.test('get', function(t) {
    tester.getJSON('/get', {a: 1, b:2}, function(err, res) {
        t.equals(res.body.a, 1);
        t.equals(res.body.b, 2);
        t.end();
    });   
});


t.test('post', function(t) {
    tester.postJSON('/post', {a: 1, b:2}, function(err, res) {
        t.equals(res.body.a, 1);
        t.equals(res.body.b, 2);
        t.end();
    });   
});

t.test('promise', function(t) {
    tester.postJSONAsync('/post', {a: 1, b: 2}).then(function(res) {
        t.equals(res.body.a, 1);
        t.end();
    });
});



