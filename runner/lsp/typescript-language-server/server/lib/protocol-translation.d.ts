import * as lsp from 'vscode-languageserver';
import * as tsp from 'typescript/lib/protocol';
import { LspDocuments } from './document';
export declare function uriToPath(stringUri: string): string | undefined;
export declare function pathToUri(filepath: string, documents: LspDocuments | undefined): string;
export declare function currentVersion(filepath: string, documents: LspDocuments | undefined): number;
export declare function toPosition(location: tsp.Location): lsp.Position;
export declare function toLocation(fileSpan: tsp.FileSpan, documents: LspDocuments | undefined): lsp.Location;
export declare function toFileRangeRequestArgs(file: string, range: lsp.Range): tsp.FileRangeRequestArgs;
export declare function toSymbolKind(tspKind: string): lsp.SymbolKind;
export declare function toDiagnosticSeverity(category: string): lsp.DiagnosticSeverity;
export declare function toDiagnostic(diagnostic: tsp.Diagnostic, documents: LspDocuments | undefined): lsp.Diagnostic;
export declare function asRelatedInformation(info: tsp.DiagnosticRelatedInformation[] | undefined, documents: LspDocuments | undefined): lsp.DiagnosticRelatedInformation[] | undefined;
export declare function toTextEdit(edit: tsp.CodeEdit): lsp.TextEdit;
export declare function toMarkDown(documentation: tsp.SymbolDisplayPart[], tags: tsp.JSDocTagInfo[]): string;
export declare function toTextDocumentEdit(change: tsp.FileCodeEdits, documents: LspDocuments | undefined): lsp.TextDocumentEdit;
export declare function toDocumentHighlight(item: tsp.DocumentHighlightsItem): lsp.DocumentHighlight[];
export declare function asRange(span: tsp.TextSpan): lsp.Range;
export declare function asDocumentation(data: {
    documentation?: tsp.SymbolDisplayPart[];
    tags?: tsp.JSDocTagInfo[];
}): lsp.MarkupContent | undefined;
export declare function asTagsDocumentation(tags: tsp.JSDocTagInfo[]): string;
export declare function asTagDocumentation(tag: tsp.JSDocTagInfo): string;
export declare function asTagBodyText(tag: tsp.JSDocTagInfo): string | undefined;
export declare function asPlainText(parts: undefined): undefined;
export declare function asPlainText(parts: tsp.SymbolDisplayPart[]): string;
export declare function asPlainText(parts: tsp.SymbolDisplayPart[] | undefined): string | undefined;
export declare namespace Position {
    function Min(): undefined;
    function Min(...positions: lsp.Position[]): lsp.Position;
    function isBefore(one: lsp.Position, other: lsp.Position): boolean;
    function Max(): undefined;
    function Max(...positions: lsp.Position[]): lsp.Position;
    function isAfter(one: lsp.Position, other: lsp.Position): boolean;
    function isBeforeOrEqual(one: lsp.Position, other: lsp.Position): boolean;
}
export declare namespace Range {
    function intersection(one: lsp.Range, other: lsp.Range): lsp.Range | undefined;
}
//# sourceMappingURL=protocol-translation.d.ts.map