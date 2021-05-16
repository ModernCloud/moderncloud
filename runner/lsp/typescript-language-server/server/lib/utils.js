"use strict";
/*
 * Copyright (C) 2017, 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTsserverExecutable = exports.Deferred = void 0;
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
exports.Deferred = Deferred;
function getTsserverExecutable() {
    return isWindows() ? 'tsserver.cmd' : 'tsserver';
}
exports.getTsserverExecutable = getTsserverExecutable;
function isWindows() {
    return /^win/.test(process.platform);
}
//# sourceMappingURL=utils.js.map