"use strict";
/*
 * Copyright (C) 2017, 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefixingLogger = exports.ConsoleLogger = exports.LspClientLogger = void 0;
const lsp = require("vscode-languageserver");
class LspClientLogger {
    constructor(client, level) {
        this.client = client;
        this.level = level;
    }
    sendMessage(severity, messageObjects) {
        if (this.level >= severity) {
            let message = messageObjects.map(p => {
                if (typeof p === 'object') {
                    return JSON.stringify(p, null, 2);
                }
                else {
                    return p;
                }
            }).join(' ');
            this.client.logMessage({
                type: severity,
                message: message
            });
        }
    }
    error(...arg) {
        this.sendMessage(lsp.MessageType.Error, arg);
    }
    warn(...arg) {
        this.sendMessage(lsp.MessageType.Warning, arg);
    }
    info(...arg) {
        this.sendMessage(lsp.MessageType.Info, arg);
    }
    log(...arg) {
        this.sendMessage(lsp.MessageType.Log, arg);
    }
}
exports.LspClientLogger = LspClientLogger;
class ConsoleLogger {
    constructor(isLogEnabled) {
        this.isLogEnabled = isLogEnabled;
    }
    toStrings(...arg) {
        return (arg.map(a => JSON.stringify(a, null, 2)));
    }
    error(...arg) {
        console.error(...this.toStrings(arg));
    }
    warn(...arg) {
        console.warn(...this.toStrings(arg));
    }
    info(...arg) {
        console.info(...this.toStrings(arg));
    }
    log(...arg) {
        if (this.isLogEnabled) {
            console.log(...this.toStrings(arg));
        }
    }
}
exports.ConsoleLogger = ConsoleLogger;
class PrefixingLogger {
    constructor(logger, prefix) {
        this.logger = logger;
        this.prefix = prefix;
    }
    error(...arg) {
        this.logger.error(this.prefix, ...arg);
    }
    warn(...arg) {
        this.logger.warn(this.prefix, ...arg);
    }
    info(...arg) {
        this.logger.info(this.prefix, ...arg);
    }
    log(...arg) {
        this.logger.log(this.prefix, ...arg);
    }
}
exports.PrefixingLogger = PrefixingLogger;
//# sourceMappingURL=logger.js.map