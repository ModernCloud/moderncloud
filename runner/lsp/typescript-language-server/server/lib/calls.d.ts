import * as lsp from 'vscode-languageserver';
import * as lspcalls from './lsp-protocol.calls.proposed';
import { TspClient } from './tsp-client';
export declare function computeCallers(tspClient: TspClient, args: lsp.TextDocumentPositionParams): Promise<lspcalls.CallsResult>;
export declare type DocumentProvider = (file: string) => lsp.TextDocument | undefined;
export declare function computeCallees(tspClient: TspClient, args: lsp.TextDocumentPositionParams, documentProvider: DocumentProvider): Promise<lspcalls.CallsResult>;
//# sourceMappingURL=calls.d.ts.map