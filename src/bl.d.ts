
declare module "bl" {
    function bl(f: (err: Error, data: NodeBuffer) => void):ReadWriteStream;
    export = bl;
}