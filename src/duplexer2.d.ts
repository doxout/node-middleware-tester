declare module "duplexer2" {
    import stream = require('stream');
    function duplexer2(r:ReadableStream,
                       w:WritableStream):ReadWriteStream;
    export = duplexer2;
}
