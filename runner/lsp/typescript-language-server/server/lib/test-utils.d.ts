import * as lsp from 'vscode-languageserver';
import { LspServer } from './lsp-server';
export declare function uri(suffix?: string): string;
export declare function filePath(suffix?: string): string;
export declare function readContents(path: string): string;
export declare function positionAt(document: lsp.TextDocumentItem, idx: number): lsp.Position;
export declare function position(document: lsp.TextDocumentItem, match: string): lsp.Position;
export declare function lastPosition(document: lsp.TextDocumentItem, match: string): lsp.Position;
export declare function createServer(options: {
    rootUri: string | null;
    tsserverLogVerbosity?: string;
    publishDiagnostics: (args: lsp.PublishDiagnosticsParams) => void;
}): Promise<LspServer>;
//# sourceMappingURL=test-utils.d.ts.map