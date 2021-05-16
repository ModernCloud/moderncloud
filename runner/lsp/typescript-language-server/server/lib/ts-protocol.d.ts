/**
 * **IMPORTANT** this module should not depend on `vscode-languageserver` only protocol and types
 */
import * as lsp from 'vscode-languageserver-protocol';
export declare namespace TypeScriptRenameRequest {
    const type: lsp.RequestType<lsp.TextDocumentPositionParams, any, void, void>;
}
export interface TypeScriptPlugin {
    name: string;
    location: string;
}
export interface TypeScriptInitializationOptions {
    logVerbosity?: string;
    plugins: TypeScriptPlugin[];
}
export declare type TypeScriptInitializeParams = lsp.InitializeParams & {
    initializationOptions?: Partial<TypeScriptInitializationOptions>;
};
export interface TypeScriptInitializeResult extends lsp.InitializeResult {
    logFileUri?: string;
}
//# sourceMappingURL=ts-protocol.d.ts.map