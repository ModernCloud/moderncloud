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
exports.createServer = exports.lastPosition = exports.position = exports.positionAt = exports.readContents = exports.filePath = exports.uri = void 0;
const path = require("path");
const fs = require("fs");
const lsp = require("vscode-languageserver");
const protocol_translation_1 = require("./protocol-translation");
const lsp_server_1 = require("./lsp-server");
const logger_1 = require("./logger");
function uri(suffix = '') {
    const resolved = this.filePath(suffix);
    return protocol_translation_1.pathToUri(resolved, undefined);
}
exports.uri = uri;
function filePath(suffix = '') {
    return path.resolve(__dirname, `../test-data`, suffix);
}
exports.filePath = filePath;
function readContents(path) {
    return fs.readFileSync(path, 'utf-8').toString();
}
exports.readContents = readContents;
function positionAt(document, idx) {
    const doc = lsp.TextDocument.create(document.uri, document.languageId, document.version, document.text);
    const pos = doc.positionAt(idx);
    return {
        line: pos.line,
        character: pos.character
    };
}
exports.positionAt = positionAt;
function position(document, match) {
    return positionAt(document, document.text.indexOf(match));
}
exports.position = position;
function lastPosition(document, match) {
    return positionAt(document, document.text.lastIndexOf(match));
}
exports.lastPosition = lastPosition;
function createServer(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = new logger_1.ConsoleLogger(false);
        const server = new lsp_server_1.LspServer({
            logger,
            tsserverPath: 'tsserver',
            tsserverLogVerbosity: options.tsserverLogVerbosity,
            tsserverLogFile: path.resolve(__dirname, '../tsserver.log'),
            lspClient: {
                publishDiagnostics: options.publishDiagnostics,
                showMessage(args) {
                    throw args; // should not be called.
                },
                logMessage(args) {
                    logger.log('logMessage', JSON.stringify(args));
                },
                telemetry(args) {
                    logger.log('telemetry', JSON.stringify(args));
                },
                applyWorkspaceEdit: () => Promise.reject(new Error('unsupported')),
                rename: () => Promise.reject(new Error('unsupported'))
            },
        });
        yield server.initialize({
            rootPath: undefined,
            rootUri: options.rootUri,
            processId: 42,
            capabilities: {
                textDocument: {
                    documentSymbol: {
                        hierarchicalDocumentSymbolSupport: true
                    }
                }
            },
            workspaceFolders: null
        });
        return server;
    });
}
exports.createServer = createServer;
//# sourceMappingURL=test-utils.js.map