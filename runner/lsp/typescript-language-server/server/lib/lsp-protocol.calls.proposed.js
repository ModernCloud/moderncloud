/* --------------------------------------------------------------------------------------------
 * Copyright (c) TypeFox and others. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinitionSymbol = exports.CallDirection = exports.CallsRequest = void 0;
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
/**
 * A request to resolve all calls at a given text document position of a symbol definition or a call the same.
 * The request's parameter is of type [CallsParams](#CallsParams), the response is of type [CallsResult](#CallsResult) or a
 * Thenable that resolves to such.
 */
var CallsRequest;
(function (CallsRequest) {
    CallsRequest.type = new vscode_jsonrpc_1.RequestType('textDocument/calls');
})(CallsRequest = exports.CallsRequest || (exports.CallsRequest = {}));
/**
 * Enum of call direction kinds
 */
var CallDirection;
(function (CallDirection) {
    /**
     * Incoming calls aka. callers
     */
    CallDirection["Incoming"] = "incoming";
    /**
     * Outgoing calls aka. callees
     */
    CallDirection["Outgoing"] = "outgoing";
})(CallDirection = exports.CallDirection || (exports.CallDirection = {}));
var DefinitionSymbol;
(function (DefinitionSymbol) {
    function create(uri, symbol) {
        const { name, detail, kind, range, selectionRange } = symbol;
        const location = { uri, range };
        return { name, detail, kind, location, selectionRange };
    }
    DefinitionSymbol.create = create;
})(DefinitionSymbol = exports.DefinitionSymbol || (exports.DefinitionSymbol = {}));
//# sourceMappingURL=lsp-protocol.calls.proposed.js.map