"use strict";
/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideQuickFix = void 0;
const commands_1 = require("./commands");
const protocol_translation_1 = require("./protocol-translation");
function provideQuickFix(response, result, documents) {
    if (!response || !response.body) {
        return;
    }
    for (const fix of response.body) {
        result.push({
            title: fix.description,
            command: commands_1.Commands.APPLY_WORKSPACE_EDIT,
            arguments: [{
                    documentChanges: fix.changes.map(c => protocol_translation_1.toTextDocumentEdit(c, documents))
                }]
        });
    }
}
exports.provideQuickFix = provideQuickFix;
//# sourceMappingURL=quickfix.js.map