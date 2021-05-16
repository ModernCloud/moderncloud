import * as lsp from 'vscode-languageserver';
import * as tsp from 'typescript/lib/protocol';
export declare function asSignatureHelp(info: tsp.SignatureHelpItems): lsp.SignatureHelp;
export declare function getActiveParameter(info: tsp.SignatureHelpItems): number;
export declare function asSignatureInformation(item: tsp.SignatureHelpItem): lsp.SignatureInformation;
export declare function asParameterInformation(parameter: tsp.SignatureHelpParameter): lsp.ParameterInformation;
//# sourceMappingURL=hover.d.ts.map