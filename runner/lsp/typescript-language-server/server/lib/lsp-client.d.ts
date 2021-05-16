import * as lsp from 'vscode-languageserver';
export interface LspClient {
    publishDiagnostics(args: lsp.PublishDiagnosticsParams): void;
    showMessage(args: lsp.ShowMessageParams): void;
    logMessage(args: lsp.LogMessageParams): void;
    applyWorkspaceEdit(args: lsp.ApplyWorkspaceEditParams): Promise<lsp.ApplyWorkspaceEditResponse>;
    telemetry(args: any): void;
    rename(args: lsp.TextDocumentPositionParams): Promise<any>;
}
export declare class LspClientImpl implements LspClient {
    protected connection: lsp.IConnection;
    constructor(connection: lsp.IConnection);
    publishDiagnostics(args: lsp.PublishDiagnosticsParams): void;
    showMessage(args: lsp.ShowMessageParams): void;
    logMessage(args: lsp.LogMessageParams): void;
    telemetry(args: any): void;
    applyWorkspaceEdit(args: lsp.ApplyWorkspaceEditParams): Promise<lsp.ApplyWorkspaceEditResponse>;
    rename(args: lsp.TextDocumentPositionParams): Promise<any>;
}
//# sourceMappingURL=lsp-client.d.ts.map