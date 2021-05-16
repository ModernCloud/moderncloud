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
const tsp_client_1 = require("./tsp-client");
const logger_1 = require("./logger");
const test_utils_1 = require("./test-utils");
const modules_resolver_1 = require("./modules-resolver");
const assert = chai.assert;
const executableServer = new tsp_client_1.TspClient({
    logger: new logger_1.ConsoleLogger(),
    tsserverPath: 'tsserver'
});
const tsserverModuleRelativePath = path.join("typescript", "lib", "tsserver.js");
const bundled = modules_resolver_1.findPathToModule(__dirname, tsserverModuleRelativePath);
const moduleServer = new tsp_client_1.TspClient({
    logger: new logger_1.ConsoleLogger(),
    tsserverPath: bundled
});
const servers = { executableServer, moduleServer };
Object.keys(servers).forEach(serverName => {
    const server = servers[serverName];
    server.start();
    describe('ts server client using ' + serverName, () => {
        it('completion', () => {
            const f = test_utils_1.filePath('module2.ts');
            server.notify("open" /* Open */, {
                file: f,
                fileContent: test_utils_1.readContents(f)
            });
            return server.request("completions" /* Completions */, {
                file: f,
                line: 1,
                offset: 0,
                prefix: 'im',
                includeExternalModuleExports: true,
                includeInsertTextCompletions: true
            }).then(completions => {
                assert.equal(completions.body[1].name, "ImageBitmap");
            });
        }).timeout(5000);
        it('references', () => {
            const f = test_utils_1.filePath('module2.ts');
            server.notify("open" /* Open */, {
                file: f,
                fileContent: test_utils_1.readContents(f)
            });
            return server.request("references" /* References */, {
                file: f,
                line: 8,
                offset: 16
            }).then(references => {
                assert.equal(references.body.symbolName, "doStuff");
            });
        }).timeout(5000);
        it('documentHighlight', () => {
            const f = test_utils_1.filePath('module2.ts');
            server.notify("open" /* Open */, {
                file: f,
                fileContent: test_utils_1.readContents(f)
            });
            return server.request("documentHighlights" /* DocumentHighlights */, {
                file: f,
                line: 8,
                offset: 16,
                filesToSearch: [f]
            }).then(response => {
                assert.isTrue(response.body.some(({ file }) => file.endsWith('module2.ts')), JSON.stringify(response.body, undefined, 2));
                assert.isFalse(response.body.some(({ file }) => file.endsWith('module1.ts')), JSON.stringify(response.body, undefined, 2));
            });
        }).timeout(5000);
    });
});
//# sourceMappingURL=tsp-client.spec.js.map