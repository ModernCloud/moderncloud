"use strict";
/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asDetail = exports.asCodeActions = exports.asResolvedCompletionItem = exports.asCommitCharacters = exports.asCompletionItemKind = exports.asCompletionItem = void 0;
const lsp = require("vscode-languageserver");
const tsp_command_types_1 = require("./tsp-command-types");
const protocol_translation_1 = require("./protocol-translation");
const commands_1 = require("./commands");
function asCompletionItem(entry, file, position, document) {
    const item = {
        label: entry.name,
        kind: asCompletionItemKind(entry.kind),
        sortText: entry.sortText,
        commitCharacters: asCommitCharacters(entry.kind),
        data: {
            file,
            line: position.line + 1,
            offset: position.character + 1,
            entryNames: [
                entry.source ? { name: entry.name, source: entry.source } : entry.name
            ]
        }
    };
    if (entry.isRecommended) {
        // Make sure isRecommended property always comes first
        // https://github.com/Microsoft/vscode/issues/40325
        item.preselect = true;
    }
    else if (entry.source) {
        // De-prioritze auto-imports
        // https://github.com/Microsoft/vscode/issues/40311
        item.sortText = '\uffff' + entry.sortText;
    }
    if (item.kind === lsp.CompletionItemKind.Function || item.kind === lsp.CompletionItemKind.Method) {
        item.insertTextFormat = lsp.InsertTextFormat.Snippet;
    }
    let insertText = entry.insertText;
    let replacementRange = entry.replacementSpan && protocol_translation_1.asRange(entry.replacementSpan);
    // Make sure we only replace a single line at most
    if (replacementRange && replacementRange.start.line !== replacementRange.end.line) {
        replacementRange = lsp.Range.create(replacementRange.start, document.getLineEnd(replacementRange.start.line));
    }
    if (insertText && replacementRange && insertText[0] === '[') { // o.x -> o['x']
        item.filterText = '.' + item.label;
    }
    if (entry.kindModifiers && entry.kindModifiers.match(/\boptional\b/)) {
        if (!insertText) {
            insertText = item.label;
        }
        if (!item.filterText) {
            item.filterText = item.label;
        }
        item.label += '?';
    }
    if (insertText && replacementRange) {
        item.textEdit = lsp.TextEdit.replace(replacementRange, insertText);
    }
    else {
        item.insertText = insertText;
    }
    return item;
}
exports.asCompletionItem = asCompletionItem;
function asCompletionItemKind(kind) {
    switch (kind) {
        case tsp_command_types_1.ScriptElementKind.primitiveType:
        case tsp_command_types_1.ScriptElementKind.keyword:
            return lsp.CompletionItemKind.Keyword;
        case tsp_command_types_1.ScriptElementKind.constElement:
            return lsp.CompletionItemKind.Constant;
        case tsp_command_types_1.ScriptElementKind.letElement:
        case tsp_command_types_1.ScriptElementKind.variableElement:
        case tsp_command_types_1.ScriptElementKind.localVariableElement:
        case tsp_command_types_1.ScriptElementKind.alias:
            return lsp.CompletionItemKind.Variable;
        case tsp_command_types_1.ScriptElementKind.memberVariableElement:
        case tsp_command_types_1.ScriptElementKind.memberGetAccessorElement:
        case tsp_command_types_1.ScriptElementKind.memberSetAccessorElement:
            return lsp.CompletionItemKind.Field;
        case tsp_command_types_1.ScriptElementKind.functionElement:
            return lsp.CompletionItemKind.Function;
        case tsp_command_types_1.ScriptElementKind.memberFunctionElement:
        case tsp_command_types_1.ScriptElementKind.constructSignatureElement:
        case tsp_command_types_1.ScriptElementKind.callSignatureElement:
        case tsp_command_types_1.ScriptElementKind.indexSignatureElement:
            return lsp.CompletionItemKind.Method;
        case tsp_command_types_1.ScriptElementKind.enumElement:
            return lsp.CompletionItemKind.Enum;
        case tsp_command_types_1.ScriptElementKind.moduleElement:
        case tsp_command_types_1.ScriptElementKind.externalModuleName:
            return lsp.CompletionItemKind.Module;
        case tsp_command_types_1.ScriptElementKind.classElement:
        case tsp_command_types_1.ScriptElementKind.typeElement:
            return lsp.CompletionItemKind.Class;
        case tsp_command_types_1.ScriptElementKind.interfaceElement:
            return lsp.CompletionItemKind.Interface;
        case tsp_command_types_1.ScriptElementKind.warning:
        case tsp_command_types_1.ScriptElementKind.scriptElement:
            return lsp.CompletionItemKind.File;
        case tsp_command_types_1.ScriptElementKind.directory:
            return lsp.CompletionItemKind.Folder;
        case tsp_command_types_1.ScriptElementKind.string:
            return lsp.CompletionItemKind.Constant;
    }
    return lsp.CompletionItemKind.Property;
}
exports.asCompletionItemKind = asCompletionItemKind;
function asCommitCharacters(kind) {
    const commitCharacters = [];
    switch (kind) {
        case tsp_command_types_1.ScriptElementKind.memberGetAccessorElement:
        case tsp_command_types_1.ScriptElementKind.memberSetAccessorElement:
        case tsp_command_types_1.ScriptElementKind.constructSignatureElement:
        case tsp_command_types_1.ScriptElementKind.callSignatureElement:
        case tsp_command_types_1.ScriptElementKind.indexSignatureElement:
        case tsp_command_types_1.ScriptElementKind.enumElement:
        case tsp_command_types_1.ScriptElementKind.interfaceElement:
            commitCharacters.push('.');
            break;
        case tsp_command_types_1.ScriptElementKind.moduleElement:
        case tsp_command_types_1.ScriptElementKind.alias:
        case tsp_command_types_1.ScriptElementKind.constElement:
        case tsp_command_types_1.ScriptElementKind.letElement:
        case tsp_command_types_1.ScriptElementKind.variableElement:
        case tsp_command_types_1.ScriptElementKind.localVariableElement:
        case tsp_command_types_1.ScriptElementKind.memberVariableElement:
        case tsp_command_types_1.ScriptElementKind.classElement:
        case tsp_command_types_1.ScriptElementKind.functionElement:
        case tsp_command_types_1.ScriptElementKind.memberFunctionElement:
            commitCharacters.push('.', ',');
            commitCharacters.push('(');
            break;
    }
    return commitCharacters.length === 0 ? undefined : commitCharacters;
}
exports.asCommitCharacters = asCommitCharacters;
function asResolvedCompletionItem(item, details) {
    item.detail = asDetail(details);
    item.documentation = protocol_translation_1.asDocumentation(details);
    Object.assign(item, asCodeActions(details, item.data.file));
    return item;
}
exports.asResolvedCompletionItem = asResolvedCompletionItem;
function asCodeActions(details, filepath) {
    if (!details.codeActions || !details.codeActions.length) {
        return {};
    }
    // Try to extract out the additionalTextEdits for the current file.
    // Also check if we still have to apply other workspace edits and commands
    // using a vscode command
    const additionalTextEdits = [];
    let hasReaminingCommandsOrEdits = false;
    for (const tsAction of details.codeActions) {
        if (tsAction.commands) {
            hasReaminingCommandsOrEdits = true;
        }
        // Apply all edits in the current file using `additionalTextEdits`
        if (tsAction.changes) {
            for (const change of tsAction.changes) {
                if (change.fileName === filepath) {
                    for (const textChange of change.textChanges) {
                        additionalTextEdits.push(protocol_translation_1.toTextEdit(textChange));
                    }
                }
                else {
                    hasReaminingCommandsOrEdits = true;
                }
            }
        }
    }
    let command = undefined;
    if (hasReaminingCommandsOrEdits) {
        // Create command that applies all edits not in the current file.
        command = {
            title: '',
            command: commands_1.Commands.APPLY_COMPLETION_CODE_ACTION,
            arguments: [filepath, details.codeActions.map(codeAction => ({
                    commands: codeAction.commands,
                    description: codeAction.description,
                    changes: codeAction.changes.filter(x => x.fileName !== filepath)
                }))]
        };
    }
    return {
        command,
        additionalTextEdits: additionalTextEdits.length ? additionalTextEdits : undefined
    };
}
exports.asCodeActions = asCodeActions;
function asDetail({ displayParts, source }) {
    const result = [];
    const importPath = protocol_translation_1.asPlainText(source);
    if (importPath) {
        result.push(`Auto import from '${importPath}'`);
    }
    const detail = protocol_translation_1.asPlainText(displayParts);
    if (detail) {
        result.push(detail);
    }
    return result.join('\n');
}
exports.asDetail = asDetail;
//# sourceMappingURL=completion.js.map