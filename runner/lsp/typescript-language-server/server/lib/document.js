"use strict";
/*
 * Copyright (C) 2017, 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LspDocuments = exports.LspDocument = void 0;
const lsp = require("vscode-languageserver");
class LspDocument {
    constructor(doc) {
        const { uri, languageId, version, text } = doc;
        this.document = lsp.TextDocument.create(uri, languageId, version, text);
    }
    get uri() {
        return this.document.uri;
    }
    get languageId() {
        return this.document.languageId;
    }
    get version() {
        return this.document.version;
    }
    getText(range) {
        return this.document.getText(range);
    }
    positionAt(offset) {
        return this.document.positionAt(offset);
    }
    offsetAt(position) {
        return this.document.offsetAt(position);
    }
    get lineCount() {
        return this.document.lineCount;
    }
    getLine(line) {
        const lineRange = this.getLineRange(line);
        return this.getText(lineRange);
    }
    getLineRange(line) {
        const lineStart = this.getLineStart(line);
        const lineEnd = this.getLineEnd(line);
        return lsp.Range.create(lineStart, lineEnd);
    }
    getLineEnd(line) {
        const nextLineOffset = this.getLineOffset(line + 1);
        return this.positionAt(nextLineOffset - 1);
    }
    getLineOffset(line) {
        const lineStart = this.getLineStart(line);
        return this.offsetAt(lineStart);
    }
    getLineStart(line) {
        return lsp.Position.create(line, 0);
    }
    applyEdit(version, change) {
        const content = this.getText();
        let newContent = change.text;
        if (change.range) {
            const start = this.offsetAt(change.range.start);
            const end = this.offsetAt(change.range.end);
            newContent = content.substr(0, start) + change.text + content.substr(end);
        }
        this.document = lsp.TextDocument.create(this.uri, this.languageId, version, newContent);
    }
}
exports.LspDocument = LspDocument;
class LspDocuments {
    constructor() {
        this._files = [];
        this.documents = new Map();
    }
    /**
     * Sorted by last access.
     */
    get files() {
        return this._files;
    }
    get(file) {
        const document = this.documents.get(file);
        if (!document) {
            return undefined;
        }
        if (this.files[0] !== file) {
            this._files.splice(this._files.indexOf(file), 1);
            this._files.unshift(file);
        }
        return document;
    }
    open(file, doc) {
        if (this.documents.has(file)) {
            return false;
        }
        this.documents.set(file, new LspDocument(doc));
        this._files.unshift(file);
        return true;
    }
    close(file) {
        const document = this.documents.get(file);
        if (!document) {
            return undefined;
        }
        this.documents.delete(file);
        this._files.splice(this._files.indexOf(file), 1);
        return document;
    }
}
exports.LspDocuments = LspDocuments;
//# sourceMappingURL=document.js.map