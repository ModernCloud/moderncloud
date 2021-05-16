"use strict";
/*
 * Copyright (C) 2017, 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LspServer = void 0;
const path = require("path");
const tempy = require("tempy");
const lsp = require("vscode-languageserver");
const lspcalls = require("./lsp-protocol.calls.proposed");
const fs = require("fs-extra");
const commandExists = require("command-exists");
const debounce = require("p-debounce");
const logger_1 = require("./logger");
const tsp_client_1 = require("./tsp-client");
const diagnostic_queue_1 = require("./diagnostic-queue");
const modules_resolver_1 = require("./modules-resolver");
const protocol_translation_1 = require("./protocol-translation");
const utils_1 = require("./utils");
const document_1 = require("./document");
const completion_1 = require("./completion");
const hover_1 = require("./hover");
const commands_1 = require("./commands");
const quickfix_1 = require("./quickfix");
const refactor_1 = require("./refactor");
const organize_imports_1 = require("./organize-imports");
const document_symbol_1 = require("./document-symbol");
const calls_1 = require("./calls");
class LspServer {
    constructor(options) {
        this.options = options;
        this.documents = new document_1.LspDocuments();
        this.requestDiagnostics = debounce(() => this.doRequestDiagnostics(), 200);
        this.logger = new logger_1.PrefixingLogger(options.logger, '[lspserver]');
        this.diagnosticQueue = new diagnostic_queue_1.DiagnosticEventQueue(diagnostics => this.options.lspClient.publishDiagnostics(diagnostics), this.documents, this.logger);
    }
    closeAll() {
        for (const file of [...this.documents.files]) {
            this.closeDocument(file);
        }
    }
    findTsserverPath() {
        if (this.options.tsserverPath) {
            return this.options.tsserverPath;
        }
        // 1) look into node_modules of workspace root
        let executable = modules_resolver_1.findPathToModule(this.rootPath(), `.bin/${utils_1.getTsserverExecutable()}`);
        if (executable) {
            return executable;
        }
        // 2) use globally installed tsserver
        if (commandExists.sync(utils_1.getTsserverExecutable())) {
            return utils_1.getTsserverExecutable();
        }
        // 3) look into node_modules of typescript-language-server
        const bundled = modules_resolver_1.findPathToModule(__dirname, path.join("typescript", "lib", "tsserver.js"));
        if (!bundled) {
            throw Error(`Couldn't find '${utils_1.getTsserverExecutable()}' executable or 'tsserver.js' module`);
        }
        return bundled;
    }
    initialize(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('initialize', params);
            this.initializeParams = params;
            const { logVerbosity, plugins } = Object.assign({ logVerbosity: this.options.tsserverLogVerbosity, plugins: [] }, this.initializeParams.initializationOptions);
            const logFile = this.getLogFile(logVerbosity);
            const globalPlugins = [];
            const pluginProbeLocations = [];
            for (const plugin of plugins) {
                globalPlugins.push(plugin.name);
                pluginProbeLocations.push(plugin.location);
            }
            const tsserverPath = this.findTsserverPath();
            this.tspClient = new tsp_client_1.TspClient({
                tsserverPath,
                logFile,
                logVerbosity,
                globalPlugins,
                pluginProbeLocations,
                logger: this.options.logger,
                onEvent: this.onTsEvent.bind(this)
            });
            this.tspClient.start();
            this.tspClient.request("configure" /* Configure */, {
                preferences: {
                    allowTextChangesInNewFiles: true
                }
            });
            this.tspClient.request("compilerOptionsForInferredProjects" /* CompilerOptionsForInferredProjects */, {
                options: {
                    module: "CommonJS" /* CommonJS */,
                    target: "ES2016" /* ES2016 */,
                    jsx: "Preserve" /* Preserve */,
                    allowJs: true,
                    allowSyntheticDefaultImports: true,
                    allowNonTsExtensions: true
                }
            });
            const logFileUri = logFile && protocol_translation_1.pathToUri(logFile, undefined);
            this.initializeResult = {
                capabilities: {
                    textDocumentSync: lsp.TextDocumentSyncKind.Incremental,
                    completionProvider: {
                        triggerCharacters: ['.', '"', '\'', '/', '@', '<'],
                        resolveProvider: true
                    },
                    codeActionProvider: true,
                    definitionProvider: true,
                    documentFormattingProvider: true,
                    documentRangeFormattingProvider: true,
                    documentHighlightProvider: true,
                    documentSymbolProvider: true,
                    executeCommandProvider: {
                        commands: [
                            commands_1.Commands.APPLY_WORKSPACE_EDIT,
                            commands_1.Commands.APPLY_CODE_ACTION,
                            commands_1.Commands.APPLY_REFACTORING,
                            commands_1.Commands.ORGANIZE_IMPORTS,
                            commands_1.Commands.APPLY_RENAME_FILE
                        ]
                    },
                    hoverProvider: true,
                    renameProvider: true,
                    referencesProvider: true,
                    signatureHelpProvider: {
                        triggerCharacters: ['(', ',', '<']
                    },
                    workspaceSymbolProvider: true,
                    implementationProvider: true,
                    typeDefinitionProvider: true,
                    foldingRangeProvider: true
                },
                logFileUri
            };
            this.initializeResult.capabilities.callsProvider = true;
            this.logger.log('onInitialize result', this.initializeResult);
            return this.initializeResult;
        });
    }
    getLogFile(logVerbosity) {
        if (logVerbosity === undefined || logVerbosity === 'off') {
            return undefined;
        }
        const logFile = this.doGetLogFile();
        if (logFile) {
            fs.ensureFileSync(logFile);
            return logFile;
        }
        return tempy.file({ name: 'tsserver.log' });
    }
    doGetLogFile() {
        if (process.env.TSSERVER_LOG_FILE) {
            return process.env.TSSERVER_LOG_FILE;
        }
        if (this.options.tsserverLogFile) {
            return this.options.tsserverLogFile;
        }
        if (this.initializeParams.rootUri) {
            return path.join(protocol_translation_1.uriToPath(this.initializeParams.rootUri), '.log/tsserver.log');
        }
        if (this.initializeParams.rootPath) {
            return path.join(this.initializeParams.rootPath, '.log/tsserver.log');
        }
        return undefined;
    }
    interuptDiagnostics(f) {
        if (!this.diagnosticsTokenSource) {
            return f();
        }
        this.cancelDiagnostics();
        const result = f();
        this.requestDiagnostics();
        return result;
    }
    doRequestDiagnostics() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cancelDiagnostics();
            const geterrTokenSource = new lsp.CancellationTokenSource();
            this.diagnosticsTokenSource = geterrTokenSource;
            const { files } = this.documents;
            try {
                return yield this.tspClient.request("geterr" /* Geterr */, { delay: 0, files }, this.diagnosticsTokenSource.token);
            }
            finally {
                if (this.diagnosticsTokenSource === geterrTokenSource) {
                    this.diagnosticsTokenSource = undefined;
                }
            }
        });
    }
    cancelDiagnostics() {
        if (this.diagnosticsTokenSource) {
            this.diagnosticsTokenSource = undefined;
        }
    }
    didOpenTextDocument(params) {
        const file = protocol_translation_1.uriToPath(params.textDocument.uri);
        this.logger.log('onDidOpenTextDocument', params, file);
        if (!file) {
            return;
        }
        if (this.documents.open(file, params.textDocument)) {
            this.tspClient.notify("open" /* Open */, {
                file,
                fileContent: params.textDocument.text,
                scriptKindName: this.getScriptKindName(params.textDocument.languageId),
                projectRootPath: this.rootPath()
            });
            this.requestDiagnostics();
        }
        else {
            this.logger.log(`Cannot open already opened doc '${params.textDocument.uri}'.`);
            this.didChangeTextDocument({
                textDocument: params.textDocument,
                contentChanges: [
                    {
                        text: params.textDocument.text
                    }
                ]
            });
        }
    }
    getScriptKindName(languageId) {
        switch (languageId) {
            case 'typescript': return 'TS';
            case 'typescriptreact': return 'TSX';
            case 'javascript': return 'JS';
            case 'javascriptreact': return 'JSX';
        }
        return undefined;
    }
    didCloseTextDocument(params) {
        const file = protocol_translation_1.uriToPath(params.textDocument.uri);
        this.logger.log('onDidCloseTextDocument', params, file);
        if (!file) {
            return;
        }
        this.closeDocument(file);
    }
    closeDocument(file) {
        const document = this.documents.close(file);
        if (!document) {
            return;
        }
        this.tspClient.notify("close" /* Close */, { file });
        // We won't be updating diagnostics anymore for that file, so clear them
        // so we don't leave stale ones.
        this.options.lspClient.publishDiagnostics({
            uri: document.uri,
            diagnostics: [],
        });
    }
    didChangeTextDocument(params) {
        const { textDocument } = params;
        const file = protocol_translation_1.uriToPath(textDocument.uri);
        this.logger.log('onDidChangeTextDocument', params, file);
        if (!file) {
            return;
        }
        const document = this.documents.get(file);
        if (!document) {
            this.logger.error("Received change on non-opened document " + textDocument.uri);
            throw new Error("Received change on non-opened document " + textDocument.uri);
        }
        if (textDocument.version === null) {
            throw new Error(`Received document change event for ${textDocument.uri} without valid version identifier`);
        }
        for (const change of params.contentChanges) {
            let line, offset, endLine, endOffset = 0;
            if (!change.range) {
                line = 1;
                offset = 1;
                const endPos = document.positionAt(document.getText().length);
                endLine = endPos.line + 1;
                endOffset = endPos.character + 1;
            }
            else {
                line = change.range.start.line + 1;
                offset = change.range.start.character + 1;
                endLine = change.range.end.line + 1;
                endOffset = change.range.end.character + 1;
            }
            this.tspClient.notify("change" /* Change */, {
                file,
                line,
                offset,
                endLine,
                endOffset,
                insertString: change.text
            });
            document.applyEdit(textDocument.version, change);
        }
        this.requestDiagnostics();
    }
    didSaveTextDocument(params) {
        // do nothing
    }
    definition(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: implement version checking and if semver.gte(version, 270) use `definitionAndBoundSpan` instead
            return this.getDefinition({
                type: 'definition',
                params
            });
        });
    }
    implementation(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getDefinition({
                type: 'implementation',
                params
            });
        });
    }
    typeDefinition(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getDefinition({
                type: 'typeDefinition',
                params
            });
        });
    }
    getDefinition({ type, params }) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log(type, params, file);
            if (!file) {
                return [];
            }
            const result = yield this.tspClient.request(type, {
                file,
                line: params.position.line + 1,
                offset: params.position.character + 1
            });
            return result.body ? result.body.map(fileSpan => protocol_translation_1.toLocation(fileSpan, this.documents)) : [];
        });
    }
    documentSymbol(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('symbol', params, file);
            if (!file) {
                return [];
            }
            const response = yield this.tspClient.request("navtree" /* NavTree */, {
                file
            });
            const tree = response.body;
            if (!tree || !tree.childItems) {
                return [];
            }
            if (this.supportHierarchicalDocumentSymbol) {
                const symbols = [];
                for (const item of tree.childItems) {
                    document_symbol_1.collectDocumentSymbols(item, symbols);
                }
                return symbols;
            }
            const symbols = [];
            for (const item of tree.childItems) {
                document_symbol_1.collectSymbolInformations(params.textDocument.uri, item, symbols);
            }
            return symbols;
        });
    }
    get supportHierarchicalDocumentSymbol() {
        const textDocument = this.initializeParams.capabilities.textDocument;
        const documentSymbol = textDocument && textDocument.documentSymbol;
        return !!documentSymbol && !!documentSymbol.hierarchicalDocumentSymbolSupport;
    }
    /*
     * implemented based on
     * https://github.com/Microsoft/vscode/blob/master/extensions/typescript-language-features/src/features/completions.ts
     */
    completion(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('completion', params, file);
            if (!file) {
                return [];
            }
            const document = this.documents.get(file);
            if (!document) {
                throw new Error("The document should be opened for completion, file: " + file);
            }
            try {
                const result = yield this.interuptDiagnostics(() => this.tspClient.request("completions" /* Completions */, {
                    file,
                    line: params.position.line + 1,
                    offset: params.position.character + 1,
                    includeExternalModuleExports: true,
                    includeInsertTextCompletions: true
                }));
                const body = result.body || [];
                return body
                    .filter(entry => entry.kind !== 'warning')
                    .map(entry => completion_1.asCompletionItem(entry, file, params.position, document));
            }
            catch (error) {
                if (error.message === "No content available.") {
                    this.logger.info('No content was available for completion request');
                    return null;
                }
                else {
                    throw error;
                }
            }
        });
    }
    completionResolve(item) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('completion/resolve', item);
            const { body } = yield this.interuptDiagnostics(() => this.tspClient.request("completionEntryDetails" /* CompletionDetails */, item.data));
            const details = body && body.length && body[0];
            if (!details) {
                return item;
            }
            return completion_1.asResolvedCompletionItem(item, details);
        });
    }
    hover(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('hover', params, file);
            if (!file) {
                return { contents: [] };
            }
            const result = yield this.interuptDiagnostics(() => this.getQuickInfo(file, params.position));
            if (!result || !result.body) {
                return { contents: [] };
            }
            const range = protocol_translation_1.asRange(result.body);
            const contents = [
                { language: 'typescript', value: result.body.displayString }
            ];
            const tags = protocol_translation_1.asTagsDocumentation(result.body.tags);
            contents.push(result.body.documentation + (tags ? '\n\n' + tags : ''));
            return {
                contents,
                range
            };
        });
    }
    getQuickInfo(file, position) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.tspClient.request("quickinfo" /* Quickinfo */, {
                    file,
                    line: position.line + 1,
                    offset: position.character + 1
                });
            }
            catch (err) {
                return undefined;
            }
        });
    }
    rename(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('onRename', params, file);
            if (!file) {
                return undefined;
            }
            const result = yield this.tspClient.request("rename" /* Rename */, {
                file,
                line: params.position.line + 1,
                offset: params.position.character + 1
            });
            if (!result.body || !result.body.info.canRename || result.body.locs.length === 0) {
                return undefined;
            }
            const workspaceEdit = {
                changes: {}
            };
            result.body.locs
                .forEach((spanGroup) => {
                const uri = protocol_translation_1.pathToUri(spanGroup.file, this.documents), textEdits = workspaceEdit.changes[uri] || (workspaceEdit.changes[uri] = []);
                spanGroup.locs.forEach((textSpan) => {
                    textEdits.push({
                        newText: params.newName,
                        range: {
                            start: protocol_translation_1.toPosition(textSpan.start),
                            end: protocol_translation_1.toPosition(textSpan.end)
                        }
                    });
                });
            });
            return workspaceEdit;
        });
    }
    references(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('onReferences', params, file);
            if (!file) {
                return [];
            }
            const result = yield this.tspClient.request("references" /* References */, {
                file,
                line: params.position.line + 1,
                offset: params.position.character + 1
            });
            if (!result.body) {
                return [];
            }
            return result.body.refs
                .map(fileSpan => protocol_translation_1.toLocation(fileSpan, this.documents));
        });
    }
    documentFormatting(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('documentFormatting', params, file);
            if (!file) {
                return [];
            }
            let opts = Object.assign({}, params.options);
            // translate
            if (opts.convertTabsToSpaces === undefined) {
                opts.convertTabsToSpaces = params.options.insertSpaces;
            }
            if (opts.indentSize === undefined) {
                opts.indentSize = params.options.tabSize;
            }
            try {
                opts = JSON.parse(fs.readFileSync(this.rootPath() + "/tsfmt.json", 'utf-8'));
            }
            catch (err) {
                this.logger.log("No formatting options found " + err);
            }
            // options are not yet supported in tsserver, but we can send a configure request first
            yield this.tspClient.request("configure" /* Configure */, {
                formatOptions: opts
            });
            const response = yield this.tspClient.request("format" /* Format */, {
                file,
                line: 1,
                offset: 1,
                endLine: Number.MAX_SAFE_INTEGER,
                endOffset: Number.MAX_SAFE_INTEGER,
                options: opts
            });
            if (response.body) {
                return response.body.map(e => protocol_translation_1.toTextEdit(e));
            }
            return [];
        });
    }
    documentRangeFormatting(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('documentRangeFormatting', params, file);
            if (!file) {
                return [];
            }
            let opts = Object.assign({}, params.options);
            // translate
            if (opts.convertTabsToSpaces === undefined) {
                opts.convertTabsToSpaces = params.options.insertSpaces;
            }
            if (opts.indentSize === undefined) {
                opts.indentSize = params.options.tabSize;
            }
            try {
                opts = JSON.parse(fs.readFileSync(this.rootPath() + "/tsfmt.json", 'utf-8'));
            }
            catch (err) {
                this.logger.log("No formatting options found " + err);
            }
            // options are not yet supported in tsserver, but we can send a configure request first
            yield this.tspClient.request("configure" /* Configure */, {
                formatOptions: opts
            });
            const response = yield this.tspClient.request("format" /* Format */, {
                file,
                line: params.range.start.line + 1,
                offset: params.range.start.character + 1,
                endLine: params.range.end.line + 1,
                endOffset: params.range.end.character + 1,
                options: opts
            });
            if (response.body) {
                return response.body.map(e => protocol_translation_1.toTextEdit(e));
            }
            return [];
        });
    }
    signatureHelp(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('signatureHelp', params, file);
            if (!file) {
                return undefined;
            }
            const response = yield yield this.interuptDiagnostics(() => this.getSignatureHelp(file, params.position));
            if (!response || !response.body) {
                return undefined;
            }
            const info = response.body;
            return hover_1.asSignatureHelp(response.body);
        });
    }
    getSignatureHelp(file, position) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.tspClient.request("signatureHelp" /* SignatureHelp */, {
                    file,
                    line: position.line + 1,
                    offset: position.character + 1
                });
            }
            catch (err) {
                return undefined;
            }
        });
    }
    codeAction(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('codeAction', params, file);
            if (!file) {
                return [];
            }
            const args = protocol_translation_1.toFileRangeRequestArgs(file, params.range);
            const codeActions = [];
            const errorCodes = params.context.diagnostics.map(diagnostic => Number(diagnostic.code));
            quickfix_1.provideQuickFix(yield this.getCodeFixes(Object.assign(Object.assign({}, args), { errorCodes })), codeActions, this.documents);
            refactor_1.provideRefactors(yield this.getRefactors(args), codeActions, args);
            organize_imports_1.provideOrganizeImports(file, params.context, codeActions);
            return codeActions;
        });
    }
    getCodeFixes(args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.tspClient.request("getCodeFixes" /* GetCodeFixes */, args);
            }
            catch (err) {
                return undefined;
            }
        });
    }
    getRefactors(args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.tspClient.request("getApplicableRefactors" /* GetApplicableRefactors */, args);
            }
            catch (err) {
                return undefined;
            }
        });
    }
    executeCommand(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('executeCommand', arg);
            if (arg.command === commands_1.Commands.APPLY_WORKSPACE_EDIT && arg.arguments) {
                const edit = arg.arguments[0];
                yield this.options.lspClient.applyWorkspaceEdit({
                    edit
                });
            }
            else if (arg.command === commands_1.Commands.APPLY_CODE_ACTION && arg.arguments) {
                const codeAction = arg.arguments[0];
                if (!(yield this.applyFileCodeEdits(codeAction.changes))) {
                    return;
                }
                if (codeAction.commands && codeAction.commands.length) {
                    for (const command of codeAction.commands) {
                        yield this.tspClient.request("applyCodeActionCommand" /* ApplyCodeActionCommand */, { command });
                    }
                }
            }
            else if (arg.command === commands_1.Commands.APPLY_REFACTORING && arg.arguments) {
                const args = arg.arguments[0];
                const { body } = yield this.tspClient.request("getEditsForRefactor" /* GetEditsForRefactor */, args);
                if (!body || !body.edits.length) {
                    return;
                }
                for (const edit of body.edits) {
                    yield fs.ensureFile(edit.fileName);
                }
                if (!(yield this.applyFileCodeEdits(body.edits))) {
                    return;
                }
                const renameLocation = body.renameLocation;
                if (renameLocation) {
                    yield this.options.lspClient.rename({
                        textDocument: {
                            uri: protocol_translation_1.pathToUri(args.file, this.documents)
                        },
                        position: protocol_translation_1.toPosition(renameLocation)
                    });
                }
            }
            else if (arg.command === commands_1.Commands.ORGANIZE_IMPORTS && arg.arguments) {
                const file = arg.arguments[0];
                const { body } = yield this.tspClient.request("organizeImports" /* OrganizeImports */, {
                    scope: {
                        type: 'file',
                        args: { file }
                    }
                });
                yield this.applyFileCodeEdits(body);
            }
            else if (arg.command === commands_1.Commands.APPLY_RENAME_FILE && arg.arguments) {
                const { sourceUri, targetUri } = arg.arguments[0];
                this.applyRenameFile(sourceUri, targetUri);
            }
            else {
                this.logger.error(`Unknown command ${arg.command}.`);
            }
        });
    }
    applyFileCodeEdits(edits) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!edits.length) {
                return false;
            }
            const changes = {};
            for (const edit of edits) {
                changes[protocol_translation_1.pathToUri(edit.fileName, this.documents)] = edit.textChanges.map(protocol_translation_1.toTextEdit);
            }
            const { applied } = yield this.options.lspClient.applyWorkspaceEdit({
                edit: { changes }
            });
            return applied;
        });
    }
    applyRenameFile(sourceUri, targetUri) {
        return __awaiter(this, void 0, void 0, function* () {
            const edits = yield this.getEditsForFileRename(sourceUri, targetUri);
            this.applyFileCodeEdits(edits);
        });
    }
    getEditsForFileRename(sourceUri, targetUri) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFilePath = protocol_translation_1.uriToPath(targetUri);
            const oldFilePath = protocol_translation_1.uriToPath(sourceUri);
            if (!newFilePath || !oldFilePath) {
                return [];
            }
            try {
                const { body } = yield this.tspClient.request("getEditsForFileRename" /* GetEditsForFileRename */, {
                    oldFilePath,
                    newFilePath
                });
                return body;
            }
            catch (err) {
                return [];
            }
        });
    }
    documentHighlight(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(arg.textDocument.uri);
            this.logger.log('documentHighlight', arg, file);
            if (!file) {
                return [];
            }
            let response;
            try {
                response = yield this.tspClient.request("documentHighlights" /* DocumentHighlights */, {
                    file,
                    line: arg.position.line + 1,
                    offset: arg.position.character + 1,
                    filesToSearch: [file]
                });
            }
            catch (err) {
                return [];
            }
            if (!response.body) {
                return [];
            }
            const result = [];
            for (const item of response.body) {
                // tsp returns item.file with POSIX path delimiters, whereas file is platform specific.
                // Converting to a URI and back to a path ensures consistency.
                if (protocol_translation_1.uriToPath(protocol_translation_1.pathToUri(item.file, this.documents)) === file) {
                    const highlights = protocol_translation_1.toDocumentHighlight(item);
                    result.push(...highlights);
                }
            }
            return result;
        });
    }
    rootPath() {
        return this.initializeParams.rootUri ? protocol_translation_1.uriToPath(this.initializeParams.rootUri) : this.initializeParams.rootPath;
    }
    lastFileOrDummy() {
        return this.documents.files[0] || this.rootPath();
    }
    workspaceSymbol(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.tspClient.request("navto" /* Navto */, {
                file: this.lastFileOrDummy(),
                searchValue: params.query
            });
            if (!result.body) {
                return [];
            }
            return result.body.map(item => {
                return {
                    location: {
                        uri: protocol_translation_1.pathToUri(item.file, this.documents),
                        range: {
                            start: protocol_translation_1.toPosition(item.start),
                            end: protocol_translation_1.toPosition(item.end)
                        }
                    },
                    kind: protocol_translation_1.toSymbolKind(item.kind),
                    name: item.name
                };
            });
        });
    }
    /**
     * implemented based on https://github.com/Microsoft/vscode/blob/master/extensions/typescript-language-features/src/features/folding.ts
     */
    foldingRanges(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('foldingRanges', params, file);
            if (!file) {
                return undefined;
            }
            const document = this.documents.get(file);
            if (!document) {
                throw new Error("The document should be opened for foldingRanges', file: " + file);
            }
            const { body } = yield this.tspClient.request("getOutliningSpans" /* GetOutliningSpans */, { file });
            if (!body) {
                return undefined;
            }
            const foldingRanges = [];
            for (const span of body) {
                const foldingRange = this.asFoldingRange(span, document);
                if (foldingRange) {
                    foldingRanges.push(foldingRange);
                }
            }
            return foldingRanges;
        });
    }
    asFoldingRange(span, document) {
        const range = protocol_translation_1.asRange(span.textSpan);
        const kind = this.asFoldingRangeKind(span);
        // workaround for https://github.com/Microsoft/vscode/issues/49904
        if (span.kind === 'comment') {
            const line = document.getLine(range.start.line);
            if (line.match(/\/\/\s*#endregion/gi)) {
                return undefined;
            }
        }
        const startLine = range.start.line;
        // workaround for https://github.com/Microsoft/vscode/issues/47240
        const endLine = (range.end.character > 0 && document.getText(lsp.Range.create(lsp.Position.create(range.end.line, range.end.character - 1), range.end)) === '}') ? Math.max(range.end.line - 1, range.start.line) : range.end.line;
        return {
            startLine,
            endLine,
            kind
        };
    }
    asFoldingRangeKind(span) {
        switch (span.kind) {
            case 'comment': return lsp.FoldingRangeKind.Comment;
            case 'region': return lsp.FoldingRangeKind.Region;
            case 'imports': return lsp.FoldingRangeKind.Imports;
            case 'code':
            default: return undefined;
        }
    }
    onTsEvent(event) {
        if (event.event === "semanticDiag" /* SementicDiag */ ||
            event.event === "syntaxDiag" /* SyntaxDiag */ ||
            event.event === "suggestionDiag" /* SuggestionDiag */) {
            this.diagnosticQueue.updateDiagnostics(event.event, event);
        }
        else {
            this.logger.log("Ignored event", {
                "event": event.event
            });
        }
    }
    calls(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let callsResult = { calls: [] };
            const file = protocol_translation_1.uriToPath(params.textDocument.uri);
            this.logger.log('calls', params, file);
            if (!file) {
                return callsResult;
            }
            if (params.direction === lspcalls.CallDirection.Outgoing) {
                const documentProvider = (file) => this.documents.get(file);
                callsResult = yield calls_1.computeCallees(this.tspClient, params, documentProvider);
            }
            else {
                callsResult = yield calls_1.computeCallers(this.tspClient, params);
            }
            return callsResult;
        });
    }
}
exports.LspServer = LspServer;
//# sourceMappingURL=lsp-server.js.map