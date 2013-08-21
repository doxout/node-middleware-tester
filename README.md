# middleware tester

Test your middleware with fake requests without instantiating a server.

# example

Example using tap and flask-router-plus:


```js
var mwtest = require('middleware-tester');
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
```

# api


# module.exports(middleware)

> Construct a middleware tester

**Parameters:**

- `{Function} middleware` - the middleware function

**Return:**

`{Tester}` tester - the middleware tester


<a name="tester"></a>

# tester.request(opt, done)

> Send a request to the middleware

**Example:**

```js
mwtest.request({method: 'get', url:'/a'}, function(err, res) { 
    assert(res.body == 'Hello world');
});
```

**Parameters:**

- `{Object} opt` - Options
- `{String} opt.url` - Request path
- `{String} opt.method` - GET/POST/PUT etc.
- `{Object} opt.query` - Query parameters in URL
- `{Object} opt.body` - Post body (form data, JSON only)
- `{Object} opt.headers` - Headers
- `{Boolean} opt.json` - Interpret response as JSON
- `{Function} done` - callback(err, response)

**Return:**

`{Stream}` - duplex stream. Writes to request, reads from response.


# tester.get(url, query, opt, done)

> Send a GET request to the middleware

**Example:**

```js
mwtest.get('/a', {param: 'val'}, function(err, res) { 
    assert(res.body == 'Hello world');
});
```

**Parameters:**

- `{String} url` - Request path
- `{Object} query` - Query parameters in URL
- `{String} opt.method` - GET/POST/PUT etc.
- `{Object} opt.body` - Post body (form data, JSON only)
- `{Object} opt.headers` - Headers
- `{Boolean} opt.json` - Interpret response as JSON
- `{Function} done` - callback(err, response)

**Return:**

`{Stream}` - Response stream.


# tester.post(url, body, opt, done)

> Send a POST request to the middleware

**Example:**

```js
mwtest.post('/a', {param: 'val'}, function(err, res) { 
    assert(res.body == 'Hello world');
});
```

**Parameters:**

- `{String} url` - Request path
- `{Object} body` - Optional form data 
- `{String} opt.method` - GET/POST/PUT etc.
- `{Object} opt.body` - Post body (form data, JSON only)
- `{Object} opt.headers` - Headers
- `{Boolean} opt.json` - Interpret response as JSON
- `{Function} done` - callback(err, response)

**Return:**

`{Stream}` - duplex stream. Writes to request, reads from response.


<a name="self"></a>

# self.getJSON(url, query, opt, done)

> Send a GET request to the middleware expecting JSON response.

**Example:**

```js
mwtest.get('/a', {param: 'val'}, function(err, res) { 
    assert.deepEquals(res.body, {hello: 'world'});
});
```

**Parameters:**

- `{String} url` - Request path
- `{Object} query` - Query parameters in URL
- `{String} opt.method` - GET/POST/PUT etc.
- `{Object} opt.body` - Post body (form data, JSON only)
- `{Object} opt.headers` - Headers
- `{Boolean} opt.json` - Interpret response as JSON
- `{Function} done` - callback(err, response)

**Return:**

`{Stream}` - Response stream.


# tester.postJSON(url, body, opt, done)

> Send a POST request to the middleware expecting JSON response.

**Example:**

```js
mwtest.post('/a', {param: 'val'}, function(err, res) { 
    assert.deepEquals(res.body, {hello: 'world'});
});
```

**Parameters:**

- `{String} url` - Request path
- `{Object} body` - Optional form data
- `{String} opt.method` - GET/POST/PUT etc.
- `{Object} opt.body` - Post body (form data, JSON only)
- `{Object} opt.headers` - Headers
- `{Boolean} opt.json` - Interpret response as JSON
- `{Function} done` - callback(err, response)

**Return:**

`{Stream}` - Response stream.




