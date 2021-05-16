"use strict";
/*
 * Copyright (C) 2017, 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const path = require("path");
const modules_resolver_1 = require("./modules-resolver");
describe('findPathToModule', () => {
    it('resolves the local tsserver', () => {
        const tsserverPath = modules_resolver_1.findPathToModule(__dirname, 'typescript/bin/tsserver');
        chai.assert.equal(path.resolve(__dirname, '../../node_modules/typescript/bin/tsserver'), tsserverPath);
    });
});
//# sourceMappingURL=modules-resolver.spec.js.map