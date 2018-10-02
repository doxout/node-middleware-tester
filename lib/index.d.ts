import http = require('http');
import Promise = require('bluebird');

declare function mwtest(mw: mwtest.IMiddleware): Promise<mwtest.TestableServer>;
declare module mwtest {
    interface IMiddleware {
        (req: http.IncomingMessage, res: http.ServerResponse, handler: (e: Error) => void): void;
    }
    interface BodyResponse extends http.ServerResponse {
        body: string;
    }
    interface PromiStream extends Promise<BodyResponse>, NodeJS.ReadWriteStream {
        expect: (code: number) => PromiStream;
        promise: () => Promise<BodyResponse>;
    }
    interface RequestOptions {
        url: string;
        method: string;
        query: any;
        body: any;
        headers: any;
        json: boolean;
    }
    class TestableServer {
        private server;
        private _ready;
        private _isReady;
        constructor(mw: IMiddleware);
        port(): number;
        ready(): Promise<boolean>;
        tester(extras: any): Tester;
        close(): Promise<{}>;
        address(): string;
    }
    class Tester {
        private ts;
        private extras;
        constructor(ts: TestableServer, extras: any);
        request(opt: RequestOptions): PromiStream;
        get(url: string, query: any, opt: any): PromiStream;
        post(url: string, body: any, opt: any): PromiStream;
        put(url: string, body: any, opt: any): PromiStream;
        delete(url: string, query: any, opt: any): PromiStream;
        options(url: string, opt: any): PromiStream;
        getJSON(url: any, query: any, opt: any): PromiStream;
        postJSON(url: any, body: any, opt: any): PromiStream;
        putJSON(url: any, body: any, opt: any): PromiStream;
        deleteJSON(url: string, query: any, opt: any): PromiStream;
        getJSONAsync(url: any, query: any, opt: any): PromiStream;
        postJSONAsync(url: any, body: any, opt: any): PromiStream;
        putJSONAsync(url: any, body: any, opt: any): PromiStream;
    }
}
export = mwtest;
