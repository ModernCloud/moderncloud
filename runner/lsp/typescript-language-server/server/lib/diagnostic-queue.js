"use strict";
/*
 * Copyright (C) 2017, 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticEventQueue = void 0;
const protocol_translation_1 = require("./protocol-translation");
const debounce = require("p-debounce");
class FileDiagnostics {
    constructor(uri, publishDiagnostics, documents) {
        this.uri = uri;
        this.publishDiagnostics = publishDiagnostics;
        this.documents = documents;
        this.diagnosticsPerKind = new Map();
        this.firePublishDiagnostics = debounce(() => {
            const diagnostics = this.getDiagnostics();
            this.publishDiagnostics({ uri: this.uri, diagnostics });
        }, 50);
    }
    update(kind, diagnostics) {
        this.diagnosticsPerKind.set(kind, diagnostics);
        this.firePublishDiagnostics();
    }
    getDiagnostics() {
        const result = [];
        for (const diagnostics of this.diagnosticsPerKind.values()) {
            for (const diagnostic of diagnostics) {
                result.push(protocol_translation_1.toDiagnostic(diagnostic, this.documents));
            }
        }
        return result;
    }
}
class DiagnosticEventQueue {
    constructor(publishDiagnostics, documents, logger) {
        this.publishDiagnostics = publishDiagnostics;
        this.documents = documents;
        this.logger = logger;
        this.diagnostics = new Map();
    }
    updateDiagnostics(kind, event) {
        if (!event.body) {
            this.logger.error(`Received empty ${event.event} diagnostics.`);
            return;
        }
        const { file } = event.body;
        const uri = protocol_translation_1.pathToUri(file, this.documents);
        const diagnostics = this.diagnostics.get(uri) || new FileDiagnostics(uri, this.publishDiagnostics, this.documents);
        diagnostics.update(kind, event.body.diagnostics);
        this.diagnostics.set(uri, diagnostics);
    }
}
exports.DiagnosticEventQueue = DiagnosticEventQueue;
//# sourceMappingURL=diagnostic-queue.js.map