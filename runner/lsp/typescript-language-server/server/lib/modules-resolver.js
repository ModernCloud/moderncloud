"use strict";
/*
 * Copyright (C) 2017, 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPathToModule = void 0;
const fs = require("fs");
const paths = require("path");
function findPathToModule(dir, moduleName) {
    const stat = fs.statSync(dir);
    if (stat.isDirectory()) {
        const candidate = paths.resolve(dir, 'node_modules', moduleName);
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    const parent = paths.resolve(dir, '..');
    if (parent !== dir) {
        return findPathToModule(parent, moduleName);
    }
    return undefined;
}
exports.findPathToModule = findPathToModule;
//# sourceMappingURL=modules-resolver.js.map