"use strict";
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
exports.computeCallees = exports.computeCallers = void 0;
const lsp = require("vscode-languageserver");
const lspcalls = require("./lsp-protocol.calls.proposed");
const protocol_translation_1 = require("./protocol-translation");
function computeCallers(tspClient, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const nullResult = { calls: [] };
        const contextDefinition = yield getDefinition(tspClient, args);
        if (!contextDefinition) {
            return nullResult;
        }
        const contextSymbol = yield findEnclosingSymbol(tspClient, contextDefinition);
        if (!contextSymbol) {
            return nullResult;
        }
        const callerReferences = yield findNonDefinitionReferences(tspClient, contextDefinition);
        const calls = [];
        for (const callerReference of callerReferences) {
            const symbol = yield findEnclosingSymbol(tspClient, callerReference);
            if (!symbol) {
                continue;
            }
            const location = protocol_translation_1.toLocation(callerReference, undefined);
            calls.push({
                location,
                symbol
            });
        }
        return { calls, symbol: contextSymbol };
    });
}
exports.computeCallers = computeCallers;
function computeCallees(tspClient, args, documentProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        const nullResult = { calls: [] };
        const contextDefinition = yield getDefinition(tspClient, args);
        if (!contextDefinition) {
            return nullResult;
        }
        const contextSymbol = yield findEnclosingSymbol(tspClient, contextDefinition);
        if (!contextSymbol) {
            return nullResult;
        }
        const outgoingCallReferences = yield findOutgoingCalls(tspClient, contextSymbol, documentProvider);
        const calls = [];
        for (const reference of outgoingCallReferences) {
            const definitionReferences = yield findDefinitionReferences(tspClient, reference);
            const definitionReference = definitionReferences[0];
            if (!definitionReference) {
                continue;
            }
            const definitionSymbol = yield findEnclosingSymbol(tspClient, definitionReference);
            if (!definitionSymbol) {
                continue;
            }
            const location = protocol_translation_1.toLocation(reference, undefined);
            calls.push({
                location,
                symbol: definitionSymbol
            });
        }
        return { calls, symbol: contextSymbol };
    });
}
exports.computeCallees = computeCallees;
function findOutgoingCalls(tspClient, contextSymbol, documentProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * The TSP does not provide call references.
         * As long as we are not able to access the AST in a tsserver plugin and return the information necessary as metadata to the reponse,
         * we need to test possible calls.
         */
        const computeCallCandidates = (document, range) => {
            const symbolText = document.getText(range);
            const regex = /\W([$_a-zA-Z0-9\u{00C0}-\u{E007F}]+)(<.*>)?\(/gmu; // Example: matches `candidate` in " candidate()", "Foo.candidate<T>()", etc.
            let match = regex.exec(symbolText);
            const candidates = [];
            while (match) {
                const identifier = match[1];
                if (identifier) {
                    const start = match.index + match[0].indexOf(identifier);
                    const end = start + identifier.length;
                    candidates.push({ identifier, start, end });
                }
                match = regex.exec(symbolText);
            }
            const offset = document.offsetAt(range.start);
            const candidateRanges = candidates.map(c => lsp.Range.create(document.positionAt(offset + c.start), document.positionAt(offset + c.end)));
            return candidateRanges;
        };
        /**
         * This function tests a candidate and returns a locaion for a valid call.
         */
        const validateCall = (file, candidateRange) => __awaiter(this, void 0, void 0, function* () {
            const tspPosition = { line: candidateRange.start.line + 1, offset: candidateRange.start.character + 1 };
            const references = yield findNonDefinitionReferences(tspClient, { file, start: tspPosition, end: tspPosition });
            for (const reference of references) {
                const tspPosition = { line: candidateRange.start.line + 1, offset: candidateRange.start.character + 1 };
                if (tspPosition.line === reference.start.line) {
                    return reference;
                }
            }
        });
        const calls = [];
        const file = protocol_translation_1.uriToPath(contextSymbol.location.uri);
        const document = documentProvider(file);
        if (!document) {
            return calls;
        }
        const candidateRanges = computeCallCandidates(document, contextSymbol.location.range);
        for (const candidateRange of candidateRanges) {
            const call = yield validateCall(file, candidateRange);
            if (call) {
                calls.push(call);
            }
        }
        return calls;
    });
}
function getDefinition(tspClient, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = protocol_translation_1.uriToPath(args.textDocument.uri);
        if (!file) {
            return undefined;
        }
        const definitionResult = yield tspClient.request("definition" /* Definition */, {
            file,
            line: args.position.line + 1,
            offset: args.position.character + 1
        });
        return definitionResult.body ? definitionResult.body[0] : undefined;
    });
}
function findEnclosingSymbol(tspClient, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = args.file;
        const response = yield tspClient.request("navtree" /* NavTree */, { file });
        const tree = response.body;
        if (!tree || !tree.childItems) {
            return undefined;
        }
        const pos = lsp.Position.create(args.start.line - 1, args.start.offset - 1);
        const symbol = yield findEnclosingSymbolInTree(tree, lsp.Range.create(pos, pos));
        if (!symbol) {
            return undefined;
        }
        const uri = protocol_translation_1.pathToUri(file, undefined);
        return lspcalls.DefinitionSymbol.create(uri, symbol);
    });
}
function findEnclosingSymbolInTree(parent, range) {
    return __awaiter(this, void 0, void 0, function* () {
        const inSpan = (span) => !!protocol_translation_1.Range.intersection(protocol_translation_1.asRange(span), range);
        const inTree = (tree) => tree.spans.some(span => inSpan(span));
        let candidate = inTree(parent) ? parent : undefined;
        outer: while (candidate) {
            const children = candidate.childItems || [];
            for (const child of children) {
                if (inTree(child)) {
                    candidate = child;
                    continue outer;
                }
            }
            break;
        }
        if (!candidate) {
            return undefined;
        }
        const span = candidate.spans.find(span => inSpan(span));
        const spanRange = protocol_translation_1.asRange(span);
        let selectionRange = spanRange;
        if (candidate.nameSpan) {
            const nameRange = protocol_translation_1.asRange(candidate.nameSpan);
            if (protocol_translation_1.Range.intersection(spanRange, nameRange)) {
                selectionRange = nameRange;
            }
        }
        return {
            name: candidate.text,
            kind: protocol_translation_1.toSymbolKind(candidate.kind),
            range: spanRange,
            selectionRange: selectionRange
        };
    });
}
function findDefinitionReferences(tspClient, args) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield findReferences(tspClient, args)).filter(ref => ref.isDefinition);
    });
}
function findNonDefinitionReferences(tspClient, args) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield findReferences(tspClient, args)).filter(ref => !ref.isDefinition);
    });
}
function findReferences(tspClient, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = args.file;
        const result = yield tspClient.request("references" /* References */, {
            file,
            line: args.start.line,
            offset: args.start.offset
        });
        if (!result.body) {
            return [];
        }
        return result.body.refs;
    });
}
//# sourceMappingURL=calls.js.map