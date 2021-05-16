import * as lsp from 'vscode-languageserver';
import * as lspcalls from './lsp-protocol.calls.proposed';
import * as tsp from 'typescript/lib/protocol';
import { Logger } from './logger';
import { LspClient } from './lsp-client';
import { LspDocument } from './document';
import { TSCompletionItem } from './completion';
import { TypeScriptInitializeParams, TypeScriptInitializeResult } from './ts-protocol';
export interface IServerOptions {
    logger: Logger;
    tsserverPath?: string;
    tsserverLogFile?: string;
    tsserverLogVerbosity?: string;
    lspClient: LspClient;
}
export declare class LspServer {
    private options;
    private initializeParams;
    private initializeResult;
    private tspClient;
    private diagnosticQueue;
    private logger;
    private readonly documents;
    constructor(options: IServerOptions);
    closeAll(): void;
    protected findTsserverPath(): string;
    initialize(params: TypeScriptInitializeParams): Promise<TypeScriptInitializeResult>;
    protected getLogFile(logVerbosity: string | undefined): string | undefined;
    protected doGetLogFile(): string | undefined;
    protected diagnosticsTokenSource: lsp.CancellationTokenSource | undefined;
    protected interuptDiagnostics<R>(f: () => R): R;
    readonly requestDiagnostics: any;
    protected doRequestDiagnostics(): Promise<tsp.RequestCompletedEvent>;
    protected cancelDiagnostics(): void;
    didOpenTextDocument(params: lsp.DidOpenTextDocumentParams): void;
    protected getScriptKindName(languageId: string): tsp.ScriptKindName | undefined;
    didCloseTextDocument(params: lsp.DidCloseTextDocumentParams): void;
    protected closeDocument(file: string): void;
    didChangeTextDocument(params: lsp.DidChangeTextDocumentParams): void;
    didSaveTextDocument(params: lsp.DidChangeTextDocumentParams): void;
    definition(params: lsp.TextDocumentPositionParams): Promise<lsp.Definition>;
    implementation(params: lsp.TextDocumentPositionParams): Promise<lsp.Definition>;
    typeDefinition(params: lsp.TextDocumentPositionParams): Promise<lsp.Definition>;
    protected getDefinition({ type, params }: {
        type: 'definition' | 'implementation' | 'typeDefinition';
        params: lsp.TextDocumentPositionParams;
    }): Promise<lsp.Definition>;
    documentSymbol(params: lsp.TextDocumentPositionParams): Promise<lsp.DocumentSymbol[] | lsp.SymbolInformation[]>;
    protected get supportHierarchicalDocumentSymbol(): boolean;
    completion(params: lsp.CompletionParams): Promise<TSCompletionItem[] | null>;
    completionResolve(item: TSCompletionItem): Promise<lsp.CompletionItem>;
    hover(params: lsp.TextDocumentPositionParams): Promise<lsp.Hover>;
    protected getQuickInfo(file: string, position: lsp.Position): Promise<tsp.QuickInfoResponse | undefined>;
    rename(params: lsp.RenameParams): Promise<lsp.WorkspaceEdit | undefined>;
    references(params: lsp.TextDocumentPositionParams): Promise<lsp.Location[]>;
    documentFormatting(params: lsp.DocumentFormattingParams): Promise<lsp.TextEdit[]>;
    documentRangeFormatting(params: lsp.DocumentRangeFormattingParams): Promise<lsp.TextEdit[]>;
    signatureHelp(params: lsp.TextDocumentPositionParams): Promise<lsp.SignatureHelp | undefined>;
    protected getSignatureHelp(file: string, position: lsp.Position): Promise<tsp.SignatureHelpResponse | undefined>;
    codeAction(params: lsp.CodeActionParams): Promise<(lsp.Command | lsp.CodeAction)[]>;
    protected getCodeFixes(args: tsp.CodeFixRequestArgs): Promise<tsp.GetCodeFixesResponse | undefined>;
    protected getRefactors(args: tsp.GetApplicableRefactorsRequestArgs): Promise<tsp.GetApplicableRefactorsResponse | undefined>;
    executeCommand(arg: lsp.ExecuteCommandParams): Promise<void>;
    protected applyFileCodeEdits(edits: ReadonlyArray<tsp.FileCodeEdits>): Promise<boolean>;
    protected applyRenameFile(sourceUri: string, targetUri: string): Promise<void>;
    protected getEditsForFileRename(sourceUri: string, targetUri: string): Promise<ReadonlyArray<tsp.FileCodeEdits>>;
    documentHighlight(arg: lsp.TextDocumentPositionParams): Promise<lsp.DocumentHighlight[]>;
    private rootPath;
    private lastFileOrDummy;
    workspaceSymbol(params: lsp.WorkspaceSymbolParams): Promise<lsp.SymbolInformation[]>;
    /**
     * implemented based on https://github.com/Microsoft/vscode/blob/master/extensions/typescript-language-features/src/features/folding.ts
     */
    foldingRanges(params: lsp.FoldingRangeRequestParam): Promise<lsp.FoldingRange[] | undefined>;
    protected asFoldingRange(span: tsp.OutliningSpan, document: LspDocument): lsp.FoldingRange | undefined;
    protected asFoldingRangeKind(span: tsp.OutliningSpan): lsp.FoldingRangeKind | undefined;
    protected onTsEvent(event: protocol.Event): void;
    calls(params: lspcalls.CallsParams): Promise<lspcalls.CallsResult>;
}
//# sourceMappingURL=lsp-server.d.ts.map