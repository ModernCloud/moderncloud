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
const chai = require("chai");
const test_utils_1 = require("./test-utils");
const assert = chai.assert;
const expect = chai.expect;
let server;
before(() => __awaiter(void 0, void 0, void 0, function* () {
    server = yield test_utils_1.createServer({
        rootUri: test_utils_1.uri(),
        publishDiagnostics: () => { }
    });
}));
beforeEach(() => {
    server.closeAll();
});
describe('documentHighlight', () => {
    it('simple test', () => __awaiter(void 0, void 0, void 0, function* () {
        const doc = {
            uri: test_utils_1.uri('module2.ts'),
            languageId: 'typescript',
            version: 1,
            text: test_utils_1.readContents(test_utils_1.filePath('module2.ts'))
        };
        server.didOpenTextDocument({
            textDocument: doc
        });
        const result = yield server.documentHighlight({
            textDocument: doc,
            position: test_utils_1.lastPosition(doc, 'doStuff')
        });
        assert.equal(2, result.length, JSON.stringify(result, undefined, 2));
    })).timeout(10000);
});
//# sourceMappingURL=file-lsp-server.spec.js.map