
declare module "through2" {
    import stream = require('stream');
    function through2(...args:any[]):ReadWriteStream;
    export = through2;
}