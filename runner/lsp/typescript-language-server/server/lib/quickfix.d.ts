import * as lsp from 'vscode-languageserver';
import * as tsp from 'typescript/lib/protocol';
import { LspDocuments } from './document';
export declare function provideQuickFix(response: tsp.GetCodeFixesResponse | undefined, result: (lsp.Command | lsp.CodeAction)[], documents: LspDocuments | undefined): void;
//# sourceMappingURL=quickfix.d.ts.map