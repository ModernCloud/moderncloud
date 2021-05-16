import { LspClient } from './lsp-client';
import * as lsp from 'vscode-languageserver';
/**
 * the logger type
 */
export interface Logger {
    error(...arg: any[]): void;
    warn(...arg: any[]): void;
    info(...arg: any[]): void;
    log(...arg: any[]): void;
}
export declare class LspClientLogger implements Logger {
    protected client: LspClient;
    protected level: lsp.MessageType;
    constructor(client: LspClient, level: lsp.MessageType);
    protected sendMessage(severity: lsp.MessageType, messageObjects: any[]): void;
    error(...arg: any[]): void;
    warn(...arg: any[]): void;
    info(...arg: any[]): void;
    log(...arg: any[]): void;
}
export declare class ConsoleLogger implements Logger {
    private isLogEnabled?;
    constructor(isLogEnabled?: boolean | undefined);
    private toStrings;
    error(...arg: any[]): void;
    warn(...arg: any[]): void;
    info(...arg: any[]): void;
    log(...arg: any[]): void;
}
export declare class PrefixingLogger implements Logger {
    private logger;
    private prefix;
    constructor(logger: Logger, prefix: string);
    error(...arg: any[]): void;
    warn(...arg: any[]): void;
    info(...arg: any[]): void;
    log(...arg: any[]): void;
}
//# sourceMappingURL=logger.d.ts.map