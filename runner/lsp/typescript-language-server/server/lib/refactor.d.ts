import * as lsp from 'vscode-languageserver';
import * as tsp from 'typescript/lib/protocol';
export declare function provideRefactors(response: tsp.GetApplicableRefactorsResponse | undefined, result: (lsp.Command | lsp.CodeAction)[], args: tsp.FileRangeRequestArgs): void;
export declare function asSelectRefactoring(info: tsp.ApplicableRefactorInfo, args: tsp.FileRangeRequestArgs): lsp.CodeAction;
export declare function asApplyRefactoring(action: tsp.RefactorActionInfo, info: tsp.ApplicableRefactorInfo, args: tsp.FileRangeRequestArgs): lsp.CodeAction;
export declare function asKind(refactor: tsp.RefactorActionInfo): lsp.CodeActionKind;
//# sourceMappingURL=refactor.d.ts.map