"use strict";
/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asKind = exports.asApplyRefactoring = exports.asSelectRefactoring = exports.provideRefactors = void 0;
const lsp = require("vscode-languageserver");
const commands_1 = require("./commands");
function provideRefactors(response, result, args) {
    if (!response || !response.body) {
        return;
    }
    for (const info of response.body) {
        if (info.inlineable === false) {
            result.push(asSelectRefactoring(info, args));
        }
        else {
            for (const action of info.actions) {
                result.push(asApplyRefactoring(action, info, args));
            }
        }
    }
}
exports.provideRefactors = provideRefactors;
function asSelectRefactoring(info, args) {
    return lsp.CodeAction.create(info.description, lsp.Command.create(info.description, commands_1.Commands.SELECT_REFACTORING, info, args), lsp.CodeActionKind.Refactor);
}
exports.asSelectRefactoring = asSelectRefactoring;
function asApplyRefactoring(action, info, args) {
    return lsp.CodeAction.create(action.description, lsp.Command.create(action.description, commands_1.Commands.APPLY_REFACTORING, Object.assign(Object.assign({}, args), { refactor: info.name, action: action.name })), asKind(info));
}
exports.asApplyRefactoring = asApplyRefactoring;
function asKind(refactor) {
    if (refactor.name.startsWith('function_')) {
        return lsp.CodeActionKind.RefactorExtract + '.function';
    }
    else if (refactor.name.startsWith('constant_')) {
        return lsp.CodeActionKind.RefactorExtract + '.constant';
    }
    else if (refactor.name.startsWith('Move')) {
        return lsp.CodeActionKind.Refactor + '.move';
    }
    return lsp.CodeActionKind.Refactor;
}
exports.asKind = asKind;
//# sourceMappingURL=refactor.js.map