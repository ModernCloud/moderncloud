import * as tsp from 'typescript/lib/protocol';
import * as lsp from 'vscode-languageserver';
import { Logger } from './logger';
import { EventTypes } from './tsp-command-types';
import { LspDocuments } from './document';
declare class FileDiagnostics {
    protected readonly uri: string;
    protected readonly publishDiagnostics: (params: lsp.PublishDiagnosticsParams) => void;
    protected readonly documents: LspDocuments;
    private readonly diagnosticsPerKind;
    constructor(uri: string, publishDiagnostics: (params: lsp.PublishDiagnosticsParams) => void, documents: LspDocuments);
    update(kind: EventTypes, diagnostics: tsp.Diagnostic[]): void;
    protected readonly firePublishDiagnostics: any;
    protected getDiagnostics(): lsp.Diagnostic[];
}
export declare class DiagnosticEventQueue {
    protected readonly publishDiagnostics: (params: lsp.PublishDiagnosticsParams) => void;
    protected readonly documents: LspDocuments;
    protected readonly logger: Logger;
    protected readonly diagnostics: Map<string, FileDiagnostics>;
    constructor(publishDiagnostics: (params: lsp.PublishDiagnosticsParams) => void, documents: LspDocuments, logger: Logger);
    updateDiagnostics(kind: EventTypes, event: tsp.DiagnosticEvent): void;
}
export {};
//# sourceMappingURL=diagnostic-queue.d.ts.map