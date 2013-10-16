/**
 * # api
 */

var through = require('through');
var duplexer = require('duplexer');
var P = require('bluebird');
P.longStackTraces();
var _ = require('lodash');

function lowerify(obj) {
    var res = {};
    for (var key in obj) 
        res[key.toLowerCase()] = obj[key];
    return res;
}

function urlify(obj) {
    var vals = [];
    for (var key in obj) {
        vals.push(encodeURIComponent(key)
                  +'='
                  +encodeURIComponent(obj[key]));
    }
    return vals.join('&');
}

function response() {
    var self = through();
    self.writeHead = function(code, reason, headers) {
        if (!headers) { 
            headers = reason;
            reason = '';
        }
        self.code = code;
        self.headers = headers;
        self.reason = reason;
    }
    self.body = [];
    return self;
}

function request(opt, extra) {
    var self = through();
    self.httpVersion = '1.1';


    var querystr = urlify(opt.query || {});
    if (querystr.length) querystr = '?' + querystr;
    
    self.originalUrl = replaceAll(opt.url, opt.query);

    self.url = opt.url + querystr;
    self.query = opt.query;
    self.method = opt.method;
    self.body = opt.body;
    self.headers = lowerify(opt.headers || {});

    self.header = function(h) {
        return self.heades[h.toLowerCase()]
    }
    if (extra) _.merge(self, extra);
    return self;
}

function replaceAll(str, context, opt) {
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



/**
 * Construct a middleware tester
 *
 * @param {Function} middleware - the middleware function
 * @param {Object} topopts - extra request options
 * @return {Tester} the middleware tester
 */
module.exports = function create(middleware, extra) {
    var tester = {};
    /**
     * Send a request to the middleware
     *
     * Example:
     *
     *     mwtest.request({method: 'get', url:'/a'}, function(err, res) { 
     *         assert(res.body == 'Hello world');
     *     });
     *
     * @param {Object} opt - Options
     * @param {String} opt.url - Request path
     * @param {String} opt.method - GET/POST/PUT etc.
     * @param {Object} opt.query - Query parameters in URL
     * @param {Object} opt.body - Post body (form data, JSON only)
     * @param {Object} opt.headers - Headers
     * @param {Boolean} opt.json - Interpret response as JSON
     * @param {Function} done - callback(err, response)
     * @return {Stream} - duplex stream. Writes to request, reads from response.
     */
    tester.request = function(opt, done) {
        var req = request(opt, extra),
            res = response();

        res.on('data', function resData(d) {
            res.body.push(d.toString())
        });
        res.on('end', function resDone() {
            res.body = res.body.join('');
            if (opt.json) res.body = JSON.parse(res.body);
            if (done) done(null, res);
        });

        middleware(req, res, function(err) {
            if (done) done(err, res);
        }); 

        if (req.body) 
            req.end(urlify(req.body));

        return duplexer(req, res);       
    };

    /**
     * Send a GET request to the middleware
     *
     * Example:
     *
     *     mwtest.get('/a', {param: 'val'}, function(err, res) { 
     *         assert(res.body == 'Hello world');
     *     });
     *
     * @param {String} url - Request path
     * @param {Object} query - Query parameters in URL
     * @param {String} opt.method - GET/POST/PUT etc.
     * @param {Object} opt.body - Post body (form data, JSON only)
     * @param {Object} opt.headers - Headers
     * @param {Boolean} opt.json - Interpret response as JSON
     * @param {Function} done - callback(err, response)
     * @return {Stream} - Response stream. 
     */
    tester.get = function(url, query, opt, done) {
        if (!done) { 
            done = opt; 
            opt = {}; 
        } 
        if (!done) {
            done = query;
            query = {};
        }
        opt.url = url;
        opt.method = 'GET';
        opt.query = query;
        return tester.request(opt, done);
    };

    /**
     * Send a POST request to the middleware
     *
     * Example:
     *
     *     mwtest.post('/a', {param: 'val'}, function(err, res) { 
     *         assert(res.body == 'Hello world');
     *     });
     *
     * @param {String} url - Request path
     * @param {Object} body - Optional form data 
     * @param {String} opt.method - GET/POST/PUT etc.
     * @param {Object} opt.body - Post body (form data, JSON only)
     * @param {Object} opt.headers - Headers
     * @param {Boolean} opt.json - Interpret response as JSON
     * @param {Function} done - callback(err, response)
     * @return {Stream} - duplex stream. Writes to request, reads from response.
     */
    tester.post = function(url, body, opt, done) {
        if (!done) { 
            done = opt; 
            opt = {}; 
        }
        opt.url = url;
        opt.method = 'POST';
        opt.body = body;
        return tester.request(opt, done);
    };

    /**
     * Send a GET request to the middleware expecting JSON response.
     *
     * Example:
     *
     *     mwtest.get('/a', {param: 'val'}, function(err, res) { 
     *         assert.deepEquals(res.body, {hello: 'world'});
     *     });
     *
     * @param {String} url - Request path
     * @param {Object} query - Query parameters in URL
     * @param {String} opt.method - GET/POST/PUT etc.
     * @param {Object} opt.body - Post body (form data, JSON only)
     * @param {Object} opt.headers - Headers
     * @param {Boolean} opt.json - Interpret response as JSON
     * @param {Function} done - callback(err, response)
     * @return {Stream} - Response stream. 
     */
    tester.getJSON = function(url, query, opt, done) {
        if (!done) { 
            done = opt; 
            opt = {}; 
        } 
        if (!done) {
            done = query;
            query = {};
        }
        opt.json = true;
        return tester.get(url, query, opt, done); 
    };

    /**
     * Send a POST request to the middleware expecting JSON response.
     *
     * Example:
     *
     *     mwtest.post('/a', {param: 'val'}, function(err, res) { 
     *         assert.deepEquals(res.body, {hello: 'world'});
     *     });
     *
     * @param {String} url - Request path
     * @param {Object} body - Optional form data
     * @param {String} opt.method - GET/POST/PUT etc.
     * @param {Object} opt.body - Post body (form data, JSON only)
     * @param {Object} opt.headers - Headers
     * @param {Boolean} opt.json - Interpret response as JSON
     * @param {Function} done - callback(err, response)
     * @return {Stream} - Response stream. 
     */
    tester.postJSON = function(url, body, opt, done) {
        if (!done) { 
            done = opt; 
            opt = {}; 
        }
        opt.json = true; 
        return tester.post(url, body, opt, done);
    };

    P.promisifyAll(tester);

    return tester;
};



