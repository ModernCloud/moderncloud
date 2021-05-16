import * as lsp from 'vscode-languageserver';
export declare class LspDocument implements lsp.TextDocument {
    protected document: lsp.TextDocument;
    constructor(doc: lsp.TextDocumentItem);
    get uri(): string;
    get languageId(): string;
    get version(): number;
    getText(range?: lsp.Range): string;
    positionAt(offset: number): lsp.Position;
    offsetAt(position: lsp.Position): number;
    get lineCount(): number;
    getLine(line: number): string;
    getLineRange(line: number): lsp.Range;
    getLineEnd(line: number): lsp.Position;
    getLineOffset(line: number): number;
    getLineStart(line: number): lsp.Position;
    applyEdit(version: number, change: lsp.TextDocumentContentChangeEvent): void;
}
export declare class LspDocuments {
    private readonly _files;
    private readonly documents;
    /**
     * Sorted by last access.
     */
    get files(): string[];
    get(file: string): LspDocument | undefined;
    open(file: string, doc: lsp.TextDocumentItem): boolean;
    close(file: string): LspDocument | undefined;
}
//# sourceMappingURL=document.d.ts.map