# middleware tester

Test your middleware with fake requests.

# example

Example using tap and flask-router-plus:


```js
var mwtest = require('middleware-tester');
var t = require('blue-tape');
var router = require('flask-router-plus')();

router.get('/get', function(req, res) {
    res.answer(200, req.query);
});

router.post('/post', function(req, res) {
    res.answer(200, req.body);
});

var tester = mwtest(router.route);

t.test('get', function(t) {
    return tester.getJSON('/get', {a: 1, b:2}).then(res) {
        t.equals(res.body.a, 1);
        t.equals(res.body.b, 2);
    });
});


t.test('post', function(t) {
    return tester.postJSON('/post', {a: 1, b:2}).then(function(res) {
        t.equals(res.body.a, 1);
        t.equals(res.body.b, 2);
    });
});
```

# api

TODO



