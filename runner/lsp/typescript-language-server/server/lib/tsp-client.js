"use strict";
/*
 * Copyright (C) 2017, 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TspClient = void 0;
const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const readline = require("readline");
const decoder = require("string_decoder");
const tempy = require("tempy");
const logger_1 = require("./logger");
const utils_1 = require("./utils");
class TspClient {
    constructor(options) {
        this.options = options;
        this.seq = 0;
        this.deferreds = {};
        this.logger = new logger_1.PrefixingLogger(options.logger, '[tsclient]');
        this.tsserverLogger = new logger_1.PrefixingLogger(options.logger, '[tsserver]');
    }
    start() {
        if (this.readlineInterface) {
            return;
        }
        const { tsserverPath, logFile, logVerbosity, globalPlugins, pluginProbeLocations } = this.options;
        const args = [];
        if (logFile) {
            args.push('--logFile', logFile);
        }
        if (logVerbosity) {
            args.push('--logVerbosity', logVerbosity);
        }
        if (globalPlugins && globalPlugins.length) {
            args.push('--globalPlugins', globalPlugins.join(','));
        }
        if (pluginProbeLocations && pluginProbeLocations.length) {
            args.push('--pluginProbeLocations', pluginProbeLocations.join(','));
        }
        this.cancellationPipeName = tempy.file({ name: 'tscancellation' });
        args.push('--cancellationPipeName', this.cancellationPipeName + '*');
        this.logger.info(`Starting tsserver : '${tsserverPath} ${args.join(' ')}'`);
        const tsserverPathIsModule = path.extname(tsserverPath) === ".js";
        this.tsserverProc = tsserverPathIsModule
            ? cp.fork(tsserverPath, args, { silent: true })
            : cp.spawn(tsserverPath, args);
        this.readlineInterface = readline.createInterface(this.tsserverProc.stdout, this.tsserverProc.stdin, undefined);
        process.on('exit', () => {
            this.readlineInterface.close();
            this.tsserverProc.stdin.destroy();
            this.tsserverProc.kill();
        });
        this.readlineInterface.on('line', line => this.processMessage(line));
        const dec = new decoder.StringDecoder("utf-8");
        this.tsserverProc.stderr.addListener('data', data => {
            const stringMsg = typeof data === 'string' ? data : dec.write(data);
            this.tsserverLogger.error(stringMsg);
        });
    }
    notify(command, args) {
        this.sendMessage(command, true, args);
    }
    request(command, args, token) {
        this.sendMessage(command, false, args);
        const seq = this.seq;
        const deferred = new utils_1.Deferred();
        this.deferreds[seq] = deferred;
        const request = deferred.promise;
        if (token) {
            const onCancelled = token.onCancellationRequested(() => {
                onCancelled.dispose();
                if (this.cancellationPipeName) {
                    const requestCancellationPipeName = this.cancellationPipeName + seq;
                    fs.writeFile(requestCancellationPipeName, '', err => {
                        if (!err) {
                            request.then(() => fs.unlink(requestCancellationPipeName, () => { }));
                        }
                    });
                }
            });
        }
        return request;
    }
    sendMessage(command, notification, args) {
        this.seq = this.seq + 1;
        let request = {
            command,
            seq: this.seq,
            type: 'request'
        };
        if (args) {
            request.arguments = args;
        }
        const serializedRequest = JSON.stringify(request) + "\n";
        this.tsserverProc.stdin.write(serializedRequest);
        this.logger.log(notification ? "notify" : "request", request);
    }
    processMessage(untrimmedMessageString) {
        const messageString = untrimmedMessageString.trim();
        if (!messageString || messageString.startsWith('Content-Length:')) {
            return;
        }
        const message = JSON.parse(messageString);
        this.logger.log('processMessage', message);
        if (this.isResponse(message)) {
            this.resolveResponse(message, message.request_seq, message.success);
        }
        else if (this.isEvent(message)) {
            if (this.isRequestCompletedEvent(message)) {
                this.resolveResponse(message, message.body.request_seq, true);
            }
            else {
                if (this.options.onEvent) {
                    this.options.onEvent(message);
                }
            }
        }
    }
    resolveResponse(message, request_seq, success) {
        const deferred = this.deferreds[request_seq];
        this.logger.log('request completed', { request_seq, success });
        if (deferred) {
            if (success) {
                this.deferreds[request_seq].resolve(message);
            }
            else {
                this.deferreds[request_seq].reject(message);
            }
            delete this.deferreds[request_seq];
        }
    }
    isEvent(message) {
        return message.type === 'event';
    }
    isResponse(message) {
        return message.type === 'response';
    }
    isRequestCompletedEvent(message) {
        return this.isEvent(message) && message.event === 'requestCompleted';
    }
}
exports.TspClient = TspClient;
//# sourceMappingURL=tsp-client.js.map