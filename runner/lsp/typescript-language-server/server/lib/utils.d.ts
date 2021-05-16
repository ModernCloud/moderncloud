export declare class Deferred<T> {
    resolve: (value?: T) => void;
    reject: (err?: unknown) => void;
    promise: Promise<T>;
}
export declare function getTsserverExecutable(): string;
//# sourceMappingURL=utils.d.ts.map