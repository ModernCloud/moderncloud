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
exports.LspClientImpl = void 0;
const lsp = require("vscode-languageserver");
const ts_protocol_1 = require("./ts-protocol");
class LspClientImpl {
    constructor(connection) {
        this.connection = connection;
    }
    publishDiagnostics(args) {
        this.connection.sendNotification(lsp.PublishDiagnosticsNotification.type, args);
    }
    showMessage(args) {
        this.connection.sendNotification(lsp.ShowMessageNotification.type, args);
    }
    logMessage(args) {
        this.connection.sendNotification(lsp.LogMessageNotification.type, args);
    }
    telemetry(args) {
        this.connection.sendNotification(lsp.TelemetryEventNotification.type, args);
    }
    applyWorkspaceEdit(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.sendRequest(lsp.ApplyWorkspaceEditRequest.type, args);
        });
    }
    rename(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.sendRequest(ts_protocol_1.TypeScriptRenameRequest.type, args);
        });
    }
}
exports.LspClientImpl = LspClientImpl;
//# sourceMappingURL=lsp-client.js.map