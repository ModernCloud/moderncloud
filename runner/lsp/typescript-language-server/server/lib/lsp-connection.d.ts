import * as lsp from 'vscode-languageserver';
export interface IServerOptions {
    tsserverPath: string;
    tsserverLogFile?: string;
    tsserverLogVerbosity?: string;
    showMessageLevel: lsp.MessageType;
}
export declare function createLspConnection(options: IServerOptions): lsp.IConnection;
//# sourceMappingURL=lsp-connection.d.ts.map