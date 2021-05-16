"use strict";
/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideOrganizeImports = void 0;
const lsp = require("vscode-languageserver");
const commands_1 = require("./commands");
function provideOrganizeImports(file, context, result) {
    if (!context.only || context.only.indexOf(lsp.CodeActionKind.SourceOrganizeImports) === -1) {
        return;
    }
    result.push(lsp.CodeAction.create("Organize Imports", lsp.Command.create('', commands_1.Commands.ORGANIZE_IMPORTS, file), lsp.CodeActionKind.SourceOrganizeImports));
}
exports.provideOrganizeImports = provideOrganizeImports;
//# sourceMappingURL=organize-imports.js.map