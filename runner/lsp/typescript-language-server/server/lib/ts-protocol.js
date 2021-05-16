"use strict";
/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptRenameRequest = void 0;
/**
 * **IMPORTANT** this module should not depend on `vscode-languageserver` only protocol and types
 */
const lsp = require("vscode-languageserver-protocol");
var TypeScriptRenameRequest;
(function (TypeScriptRenameRequest) {
    TypeScriptRenameRequest.type = new lsp.RequestType("_typescript.rename");
})(TypeScriptRenameRequest = exports.TypeScriptRenameRequest || (exports.TypeScriptRenameRequest = {}));
//# sourceMappingURL=ts-protocol.js.map