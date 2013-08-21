# Middleware tester

_Source: [index.js](/index.js)_

<a name="tableofcontents"></a>

- <a name="toc_moduleexportsmiddleware"></a><a name="toc_module"></a>[module.exports](#moduleexportsmiddleware)
- <a name="toc_testerrequestopt-opturl-optmethod-optquery-optbody-optheaders-optjson-done"></a><a name="toc_tester"></a>[tester.request](#testerrequestopt-opturl-optmethod-optquery-optbody-optheaders-optjson-done)
- <a name="toc_testergeturl-query-optmethod-optbody-optheaders-optjson-done"></a>[tester.get](#testergeturl-query-optmethod-optbody-optheaders-optjson-done)
- <a name="toc_testerposturl-body-optmethod-optbody-optheaders-optjson-done"></a>[tester.post](#testerposturl-body-optmethod-optbody-optheaders-optjson-done)
- <a name="toc_selfgetjsonurl-query-optmethod-optbody-optheaders-optjson-done"></a><a name="toc_self"></a>[self.getJSON](#selfgetjsonurl-query-optmethod-optbody-optheaders-optjson-done)
- <a name="toc_testerpostjsonurl-body-optmethod-optbody-optheaders-optjson-done"></a>[tester.postJSON](#testerpostjsonurl-body-optmethod-optbody-optheaders-optjson-done)

<a name="module"></a>

# module.exports(middleware)

> Construct a middleware tester

**Parameters:**

- `{Function} middleware` - the middleware function

**Return:**

`{Tester}` tester - the middleware tester

<sub>Go: [TOC](#tableofcontents) | [module](#toc_module)</sub>

<a name="tester"></a>

# tester.request(opt, opt.url, opt.method, opt.query, opt.body, opt.headers, opt.json, done)

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

<sub>Go: [TOC](#tableofcontents) | [tester](#toc_tester)</sub>

# tester.get(url, query, opt.method, opt.body, opt.headers, opt.json, done)

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

<sub>Go: [TOC](#tableofcontents) | [tester](#toc_tester)</sub>

# tester.post(url, body, opt.method, opt.body, opt.headers, opt.json, done)

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

<sub>Go: [TOC](#tableofcontents) | [tester](#toc_tester)</sub>

<a name="self"></a>

# self.getJSON(url, query, opt.method, opt.body, opt.headers, opt.json, done)

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

<sub>Go: [TOC](#tableofcontents) | [self](#toc_self)</sub>

# tester.postJSON(url, body, opt.method, opt.body, opt.headers, opt.json, done)

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

<sub>Go: [TOC](#tableofcontents) | [tester](#toc_tester)</sub>

_&mdash;generated by [apidox](https://github.com/codeactual/apidox)&mdash;_
