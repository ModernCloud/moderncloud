import * as lsp from 'vscode-languageserver';
import * as tsp from 'typescript/lib/protocol';
export declare function collectDocumentSymbols(parent: tsp.NavigationTree, symbols: lsp.DocumentSymbol[]): boolean;
export declare function collectSymbolInformations(uri: string, current: tsp.NavigationTree, symbols: lsp.SymbolInformation[], containerName?: string): boolean;
export declare function shouldIncludeEntry(item: tsp.NavigationTree | tsp.NavigationBarItem): boolean;
//# sourceMappingURL=document-symbol.d.ts.map