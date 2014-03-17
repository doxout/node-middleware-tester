// Type definitions for bluebird 1.0.0
// Project: https://github.com/petkaantonov/bluebird
// Definitions by: Gorgi Kosev
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "bluebird" {


    interface Promise<T> {

        then<U>(onFulfill:(value:T) => Promise.IPromise<U>, onReject?:(reason:any) => Promise.IPromise<U>, onProgress?:Function): Promise<U>;

        then<U>(onFulfill:(value:T) => Promise.IPromise<U>, onReject?:(reason:any) => U, onProgress?:Function): Promise<U>;

        then<U>(onFulfill:(value:T) => U, onReject?:(reason:any) => Promise.IPromise<U>, onProgress?:Function): Promise<U>;
        then<U>(onFulfill:(value:T) => U, onReject?:(reason:any) => U, onProgress?:Function): Promise<U>;

        // TODO: multiple filters/types
        catch<U>(filter:(e:Error) => boolean, onRejected:(reason:Error) => U): Promise<U>;
        catch<U>(filter:(e:Error) => boolean, onRejected:(reason:Error) => Promise.IPromise<U>): Promise<U>;

        catch<U>(etype:new (any) => Error, onRejected:(reason:Error) => U): Promise<U>;
        catch<U>(etype:new (any) => Error, onRejected:(reason:Error) => Promise.IPromise<U>): Promise<U>;

        catch<U>(onRejected:(reason:any) => U): Promise<U>;
        catch<U>(onRejected:(reason:any) => Promise.IPromise<U>): Promise<U>;


        // TODO: multiple filters/types
        caught<U>(filter:(e:Error) => boolean, onRejected:(reason:Error) => U): Promise<U>;
        caught<U>(filter:(e:Error) => boolean, onRejected:(reason:Error) => Promise.IPromise<U>): Promise<U>;

        caught<U>(etype:new (any) => Error, onRejected:(reason:Error) => U): Promise<U>;
        caught<U>(etype:new (any) => Error, onRejected:(reason:Error) => Promise.IPromise<U>): Promise<U>;

        caught<U>(onRejected:(reason:any) => U): Promise<U>;
        caught<U>(onRejected:(reason:any) => Promise.IPromise<U>): Promise<U>;



        error<U>(onRejected:(reason:Promise.RejectionError) => Promise.IPromise<U>): Promise<U>;
        error<U>(onRejected:(reason:Promise.RejectionError) => U): Promise<U>;

        finally(finallyCallback:Function): Promise<T>;
        lastly(finallyCallback:Function): Promise<T>;

        //TypeScript can't model .bind very well.
        bind(object:any):Promise<T>

        progressed(onProgress:(progress:any) => any): Promise<T>;

        done(onFulfilled?:(value:T) => any, onRejected?:(reason:any) => any, onProgress?:(progress:any) => any): void;


        delay(miliseconds:number):Promise<T>;
        timeout(miliseconds:number, message?:string):Promise<T>;

        nodeify(callback:(reason:Error, value:T) => void): Promise<T>;

        // Cancelation
        cancellable():Promise<T>;
        cancel(): Promise<T>;
        fork<U>(onFulfill:(value:T) => Promise.IPromise<U>, onReject?:(reason:any) => Promise.IPromise<U>, onProgress?:Function): Promise<U>;

        fork<U>(onFulfill:(value:T) => Promise.IPromise<U>, onReject?:(reason:any) => U, onProgress?:Function): Promise<U>;

        fork<U>(onFulfill:(value:T) => U, onReject?:(reason:any) => Promise.IPromise<U>, onProgress?:Function): Promise<U>;
        fork<U>(onFulfill:(value:T) => U, onReject?:(reason:any) => U, onProgress?:Function): Promise<U>;
        uncancellable():Promise<T>;
        isCancellable():boolean;

        // Inspection
        inspect():Promise.PromiseInspection<T>

        // Miscellaneous

        call<U>(fn:string, ...args:any[]): Promise<U>;
        get<U>(propertyName:String): Promise<U>;
        return<U>(value:U): Promise<U>;
        thenReturn<U>(value:U): Promise<U>;
        thenReturn(): Promise<void>;
        throw(reason:any): Promise<T>;
        thenThrow(reason:any): Promise<T>;

        toString():string;
        toJSON():any;

        all<U>():Promise<U[]>;

        props<U>():Promise<U>;
        settle<U>():Promise<Promise.PromiseInspection<U>[]>;
        any<U>():Promise<U>;
        race<U>():Promise<U>;
        some<U>(count:number):Promise<U[]>;


        spread<U>(onFulfilled:(...values:any[]) => Promise<U>,
                  onRejected?:Function): Promise<U>;
        spread<U>(onFulfilled:(...values:any[]) => U,
                  onRejected?:Function): Promise<U>;

        spread<U>(onFulfilled:(p1:any, p2:any, p3:any) => Promise<U>,
                  onRejected?:Function): Promise<U>;
        spread<U>(onFulfilled:(p1:any, p2:any, p3:any) => U,
                  onRejected?:Function): Promise<U>;

        spread<U>(onFulfilled:(p1:any, p2:any) => Promise<U>,
                  onRejected?:Function): Promise<U>;
        spread<U>(onFulfilled:(p1:any, p2:any) => U,
                  onRejected?:Function): Promise<U>;

        spread<U>(onFulfilled:Function, onRejected?:Function): Promise<U>;

        map<U>(mapper:(item:T, index: number, length: number) => U):Promise<U[]>;
        map<U>(mapper:(item:T, index: number, length: number) => Promise.IPromise<U>):Promise<U[]>;

        reduce<U>(reducer:(accumulator:U, arg:T, index: number, length: number) => U, initial?:any):Promise<U>;
        reduce<U>(reducer:(accumulator:U, arg:T, index: number, length: number) => Promise.IPromise<U>, initial?:any):Promise<U>;

        filter<U>(predicate:(item:T, index: number, length: number) => boolean):Promise<U[]>;
        // todo: check if this works?
        filter<U>(predicate:(item:T, index: number, length: number) => Promise.IPromise<boolean>):Promise<U[]>;

        valueOf(): any;

    }

    var Promise: {
        CancellationError : new (message:string) => Promise.CancellationError;
        TimeoutError : new (message: string) => Promise.TimeoutError;
        RejectionError: new (message: string) => Promise.RejectionError;
        //PromiseInspection: Promise.PromiseInspection;

        new<T>(resback:(resolve:(T) => void, reject:(any) => void) => void):Promise<T>;

        noconflict():any;

        onPossiblyUnhandledRejection(handler:(reason:any, promise:Promise<any>) => void):void;

        // Promisification
        promisify(fn:Function, ctx?:any): Function;
        //impossible to model without interfaces
        promisifyAll(object:any);

        bind<T>(object:any):Promise<T>;

        try<U>(f:() => U):Promise<U>;
        try<U, V>(f:(arg:V) => U, arg?:V):Promise<U>;
        try<U, V>(f:(arg:V) => U, args:any[], context:any):Promise<U>;
        try<U, V>(f:(arg:V) => U, args:Promise.ArrayLike, context:any):Promise<U>;

        method<T>(method:(...args:any[]) => Promise.IPromise<T>):(...args:any[]) => Promise<T>;
        method<T>(method:(...args:any[]) => T):(...args:any[]) => Promise<T>;

        resolve<U>(value:Promise.IPromise<U>):Promise<U>;
        resolve<U>(value:U):Promise<U>;
        reject(reason:any):Promise<any>;
        defer<U>(): Promise.PromiseResolver<U>;
        cast<U>(value:Promise.IPromise<U>):Promise<U>;
        cast<U>(value:U):Promise<U>;
        is(value:any): boolean;

        longStackTraces(): void;

        // Timers
        delay<U>(value:Promise.IPromise<U>, miliseconds:number):Promise<U>;
        delay<U>(value:U, miliseconds:number):Promise<U>;
        delay<U>(miliseconds:number):Promise<U>;
        delay(miliseconds:number):Promise<void>;

        // Generators (TODO: generator arguments)
        coroutine(any): Function;
        spawn<U>(any): Promise<U>;



        settle<U>(promises:Promise<U[]>):Promise<Promise.PromiseInspection<U>[]>;

        all<U>(promises:Promise.IPromise<U>[]): Promise<U[]>;
        //all<U>(promises:any[]): Promise<U[]>;

        props<U>(object:any):Promise<U>;

        settle<U>(promises:Promise.IPromise<U>[]):Promise<Promise.PromiseInspection<U>[]>;
        settle<U>(promises:any[]):Promise<Promise.PromiseInspection<U>[]>;

        any<U>(promises:Promise.IPromise<U>[]):Promise<U>;
        any<U>(promises:any[]):Promise<U>;

        race<U>(promises:Promise.IPromise<U>[]):Promise<U>;
        race<U>(promises:any[]):Promise<U>;

        some<U>(promises:Promise.IPromise<U>[], count:number):Promise<U[]>;
        some<U>(promises:any[], count:number):Promise<U[]>;

        join<U>(...promises:Promise.IPromise<U>[]):Promise<U[]>;
        join<U>(...promises:any[]):Promise<U[]>;

        map<U, V>(promises:Promise.IPromise<U>[], fn:(value:U, index:number, length:number) => V):Promise<V[]>;
        map<U, V>(promises:Promise.IPromise<U[]>, fn:(value:U, index:number, length:number) => V):Promise<V[]>;
        map<U, V>(promises:Promise.IPromise<U>[], fn:(value:U, index:number, length:number) => Promise.IPromise<V>):Promise<V[]>;
        map<U, V>(promises:Promise.IPromise<U[]>, fn:(value:U, index:number, length:number) => Promise.IPromise<V>):Promise<V[]>;

        reduce<U, V>(promises:Promise.IPromise<U>[], reducer:(accumulator:V, arg:U, index:number, length:number) => V, initial?:any):Promise<V>;
        reduce<U, V>(promises:Promise.IPromise<U>[], reducer:(accumulator:V, arg:U, index:number, length:number) => Promise.IPromise<V>, initial?:any):Promise<V>;
        reduce<U, V>(promises:Promise.IPromise<U[]>, reducer:(accumulator:V, arg:U, index:number, length:number) => V, initial?:any):Promise<V>;
        reduce<U, V>(promises:Promise.IPromise<U[]>, reducer:(accumulator:V, arg:U, index:number, length:number) => Promise.IPromise<V>, initial?:any):Promise<V>;

        filter<U>(promises:Promise.IPromise<U>[], fn:(value:U, index:number, length:number) => boolean):Promise<U[]>;
        filter<U>(promises:Promise.IPromise<U[]>, fn:(value:U, index:number, length:number) => boolean):Promise<U[]>;
        filter<U>(promises:Promise.IPromise<U>[], fn:(value:U, index:number, length:number) => Promise.IPromise<boolean>):Promise<U[]>;
        filter<U>(promises:Promise.IPromise<U[]>, fn:(value:U, index:number, length:number) => Promise.IPromise<boolean>):Promise<U[]>;

    }

    module Promise {
        export interface ArrayLike {
            length: number;
        }

        export interface IPromise<T> {
            then<U>(onFulfill:(value:T) => Promise.IPromise<U>, onReject?:(reason:any) => Promise.IPromise<U>): Promise.IPromise<U>;
            then<U>(onFulfill:(value:T) => Promise.IPromise<U>, onReject?:(reason:any) => U): Promise.IPromise<U>;
            then<U>(onFulfill:(value:T) => U, onReject?:(reason:any) => Promise.IPromise<U>): Promise.IPromise<U>;
            then<U>(onFulfill:(value:T) => U, onReject?:(reason:any) => U): Promise.IPromise<U>;
        }
        export interface CancellationError extends Error {}
        export interface TimeoutError extends Error {}
        export interface PromiseResolver<T> {
            promise: Promise<T>;
            resolve(value:T): void;
            reject(reason:any): void;
            progress(value:any): void;
            callback: (reason:any, value:T) => void;
        }

        export interface PromiseInspection<T> {
            isFulfilled():boolean;
            isRejected():boolean;
            isPending():boolean;
            value():T;
            error():any;
        }
        export interface RejectionError extends Error {}
    }

    export = Promise;

}

