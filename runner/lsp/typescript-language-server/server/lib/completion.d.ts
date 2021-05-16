import * as lsp from 'vscode-languageserver';
import * as tsp from 'typescript/lib/protocol';
import { LspDocument } from './document';
import { ScriptElementKind } from './tsp-command-types';
export interface TSCompletionItem extends lsp.CompletionItem {
    data: tsp.CompletionDetailsRequestArgs;
}
export declare function asCompletionItem(entry: import('typescript/lib/protocol').CompletionEntry, file: string, position: lsp.Position, document: LspDocument): TSCompletionItem;
export declare function asCompletionItemKind(kind: ScriptElementKind): lsp.CompletionItemKind;
export declare function asCommitCharacters(kind: ScriptElementKind): string[] | undefined;
export declare function asResolvedCompletionItem(item: TSCompletionItem, details: tsp.CompletionEntryDetails): TSCompletionItem;
export declare function asCodeActions(details: tsp.CompletionEntryDetails, filepath: string): {
    command?: lsp.Command;
    additionalTextEdits?: lsp.TextEdit[];
};
export declare function asDetail({ displayParts, source }: tsp.CompletionEntryDetails): string | undefined;
//# sourceMappingURL=completion.d.ts.map