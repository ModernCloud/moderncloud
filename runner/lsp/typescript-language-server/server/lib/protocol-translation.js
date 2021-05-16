"use strict";
/*
 * Copyright (C) 2017, 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.Position = exports.asPlainText = exports.asTagBodyText = exports.asTagDocumentation = exports.asTagsDocumentation = exports.asDocumentation = exports.asRange = exports.toDocumentHighlight = exports.toTextDocumentEdit = exports.toMarkDown = exports.toTextEdit = exports.asRelatedInformation = exports.toDiagnostic = exports.toDiagnosticSeverity = exports.toSymbolKind = exports.toFileRangeRequestArgs = exports.toLocation = exports.toPosition = exports.currentVersion = exports.pathToUri = exports.uriToPath = void 0;
const lsp = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
function uriToPath(stringUri) {
    const uri = vscode_uri_1.default.parse(stringUri);
    if (uri.scheme !== 'file') {
        return undefined;
    }
    return uri.fsPath;
}
exports.uriToPath = uriToPath;
function pathToUri(filepath, documents) {
    const fileUri = vscode_uri_1.default.file(filepath);
    const document = documents && documents.get(fileUri.fsPath);
    return document ? document.uri : fileUri.toString();
}
exports.pathToUri = pathToUri;
function currentVersion(filepath, documents) {
    const fileUri = vscode_uri_1.default.file(filepath);
    const document = documents && documents.get(fileUri.fsPath);
    return document ? document.version : 0;
}
exports.currentVersion = currentVersion;
function toPosition(location) {
    return {
        line: location.line - 1,
        character: location.offset - 1
    };
}
exports.toPosition = toPosition;
function toLocation(fileSpan, documents) {
    return {
        uri: pathToUri(fileSpan.file, documents),
        range: {
            start: toPosition(fileSpan.start),
            end: toPosition(fileSpan.end)
        }
    };
}
exports.toLocation = toLocation;
function toFileRangeRequestArgs(file, range) {
    return {
        file,
        startLine: range.start.line + 1,
        startOffset: range.start.character + 1,
        endLine: range.end.line + 1,
        endOffset: range.end.character + 1
    };
}
exports.toFileRangeRequestArgs = toFileRangeRequestArgs;
;
const symbolKindsMapping = {
    'enum member': lsp.SymbolKind.Constant,
    'JSX attribute': lsp.SymbolKind.Property,
    'local class': lsp.SymbolKind.Class,
    'local function': lsp.SymbolKind.Function,
    'local var': lsp.SymbolKind.Variable,
    'type parameter': lsp.SymbolKind.Variable,
    alias: lsp.SymbolKind.Variable,
    class: lsp.SymbolKind.Class,
    const: lsp.SymbolKind.Constant,
    constructor: lsp.SymbolKind.Constructor,
    enum: lsp.SymbolKind.Enum,
    field: lsp.SymbolKind.Field,
    file: lsp.SymbolKind.File,
    function: lsp.SymbolKind.Function,
    getter: lsp.SymbolKind.Method,
    interface: lsp.SymbolKind.Interface,
    let: lsp.SymbolKind.Variable,
    method: lsp.SymbolKind.Method,
    module: lsp.SymbolKind.Module,
    parameter: lsp.SymbolKind.Variable,
    property: lsp.SymbolKind.Property,
    setter: lsp.SymbolKind.Method,
    var: lsp.SymbolKind.Variable
};
function toSymbolKind(tspKind) {
    return symbolKindsMapping[tspKind] || lsp.SymbolKind.Variable;
}
exports.toSymbolKind = toSymbolKind;
function toDiagnosticSeverity(category) {
    switch (category) {
        case 'error': return lsp.DiagnosticSeverity.Error;
        case 'warning': return lsp.DiagnosticSeverity.Warning;
        case 'suggestion': return lsp.DiagnosticSeverity.Hint;
        default: return lsp.DiagnosticSeverity.Error;
    }
}
exports.toDiagnosticSeverity = toDiagnosticSeverity;
function toDiagnostic(diagnostic, documents) {
    return {
        range: {
            start: toPosition(diagnostic.start),
            end: toPosition(diagnostic.end)
        },
        message: diagnostic.text,
        severity: toDiagnosticSeverity(diagnostic.category),
        code: diagnostic.code,
        source: diagnostic.source || 'typescript',
        relatedInformation: asRelatedInformation(diagnostic.relatedInformation, documents)
    };
}
exports.toDiagnostic = toDiagnostic;
function asRelatedInformation(info, documents) {
    if (!info) {
        return undefined;
    }
    const result = [];
    for (const item of info) {
        const span = item.span;
        if (span) {
            result.push(lsp.DiagnosticRelatedInformation.create(toLocation(span, documents), item.message));
        }
    }
    return result;
}
exports.asRelatedInformation = asRelatedInformation;
function toTextEdit(edit) {
    return {
        range: {
            start: toPosition(edit.start),
            end: toPosition(edit.end)
        },
        newText: edit.newText
    };
}
exports.toTextEdit = toTextEdit;
function tagsMarkdownPreview(tags) {
    return (tags || [])
        .map(tag => {
        const label = `*@${tag.name}*`;
        if (!tag.text) {
            return label;
        }
        return label + (tag.text.match(/\r\n|\n/g) ? '  \n' + tag.text : ` — ${tag.text}`);
    })
        .join('  \n\n');
}
function toMarkDown(documentation, tags) {
    let result = "";
    result += asPlainText(documentation);
    const tagsPreview = tagsMarkdownPreview(tags);
    if (tagsPreview) {
        result += '\n\n' + tagsPreview;
    }
    return result;
}
exports.toMarkDown = toMarkDown;
function toTextDocumentEdit(change, documents) {
    return {
        textDocument: {
            uri: pathToUri(change.fileName, documents),
            version: currentVersion(change.fileName, documents)
        },
        edits: change.textChanges.map(c => toTextEdit(c))
    };
}
exports.toTextDocumentEdit = toTextDocumentEdit;
function toDocumentHighlight(item) {
    return item.highlightSpans.map(i => {
        return {
            kind: toDocumentHighlightKind(i.kind),
            range: {
                start: toPosition(i.start),
                end: toPosition(i.end)
            }
        };
    });
}
exports.toDocumentHighlight = toDocumentHighlight;
// copied because the protocol module is not available at runtime (js version).
var HighlightSpanKind;
(function (HighlightSpanKind) {
    HighlightSpanKind["none"] = "none";
    HighlightSpanKind["definition"] = "definition";
    HighlightSpanKind["reference"] = "reference";
    HighlightSpanKind["writtenReference"] = "writtenReference";
})(HighlightSpanKind || (HighlightSpanKind = {}));
function toDocumentHighlightKind(kind) {
    switch (kind) {
        case HighlightSpanKind.definition: return lsp.DocumentHighlightKind.Write;
        case HighlightSpanKind.reference:
        case HighlightSpanKind.writtenReference: return lsp.DocumentHighlightKind.Read;
        default: return lsp.DocumentHighlightKind.Text;
    }
}
function asRange(span) {
    return lsp.Range.create(Math.max(0, span.start.line - 1), Math.max(0, span.start.offset - 1), Math.max(0, span.end.line - 1), Math.max(0, span.end.offset - 1));
}
exports.asRange = asRange;
function asDocumentation(data) {
    let value = '';
    const documentation = asPlainText(data.documentation);
    if (documentation) {
        value += documentation;
    }
    if (data.tags) {
        const tagsDocumentation = asTagsDocumentation(data.tags);
        if (tagsDocumentation) {
            value += '\n\n' + tagsDocumentation;
        }
    }
    return value.length ? {
        kind: lsp.MarkupKind.Markdown,
        value
    } : undefined;
}
exports.asDocumentation = asDocumentation;
function asTagsDocumentation(tags) {
    return tags.map(asTagDocumentation).join('  \n\n');
}
exports.asTagsDocumentation = asTagsDocumentation;
function asTagDocumentation(tag) {
    switch (tag.name) {
        case 'param':
            const body = (tag.text || '').split(/^([\w\.]+)\s*-?\s*/);
            if (body && body.length === 3) {
                const param = body[1];
                const doc = body[2];
                const label = `*@${tag.name}* \`${param}\``;
                if (!doc) {
                    return label;
                }
                return label + (doc.match(/\r\n|\n/g) ? '  \n' + doc : ` — ${doc}`);
            }
    }
    // Generic tag
    const label = `*@${tag.name}*`;
    const text = asTagBodyText(tag);
    if (!text) {
        return label;
    }
    return label + (text.match(/\r\n|\n/g) ? '  \n' + text : ` — ${text}`);
}
exports.asTagDocumentation = asTagDocumentation;
function asTagBodyText(tag) {
    if (!tag.text) {
        return undefined;
    }
    switch (tag.name) {
        case 'example':
        case 'default':
            // Convert to markdown code block if it not already one
            if (tag.text.match(/^\s*[~`]{3}/g)) {
                return tag.text;
            }
            return '```\n' + tag.text + '\n```';
    }
    return tag.text;
}
exports.asTagBodyText = asTagBodyText;
function asPlainText(parts) {
    if (!parts) {
        return undefined;
    }
    return parts.map(part => part.text).join('');
}
exports.asPlainText = asPlainText;
var Position;
(function (Position) {
    function Min(...positions) {
        if (!positions.length) {
            return undefined;
        }
        let result = positions.pop();
        for (let p of positions) {
            if (isBefore(p, result)) {
                result = p;
            }
        }
        return result;
    }
    Position.Min = Min;
    function isBefore(one, other) {
        if (one.line < other.line) {
            return true;
        }
        if (other.line < one.line) {
            return false;
        }
        return one.character < other.character;
    }
    Position.isBefore = isBefore;
    function Max(...positions) {
        if (!positions.length) {
            return undefined;
        }
        let result = positions.pop();
        for (let p of positions) {
            if (isAfter(p, result)) {
                result = p;
            }
        }
        return result;
    }
    Position.Max = Max;
    function isAfter(one, other) {
        return !isBeforeOrEqual(one, other);
    }
    Position.isAfter = isAfter;
    function isBeforeOrEqual(one, other) {
        if (one.line < other.line) {
            return true;
        }
        if (other.line < one.line) {
            return false;
        }
        return one.character <= other.character;
    }
    Position.isBeforeOrEqual = isBeforeOrEqual;
})(Position = exports.Position || (exports.Position = {}));
var Range;
(function (Range) {
    function intersection(one, other) {
        const start = Position.Max(other.start, one.start);
        const end = Position.Min(other.end, one.end);
        if (Position.isAfter(start, end)) {
            // this happens when there is no overlap:
            // |-----|
            //          |----|
            return undefined;
        }
        return lsp.Range.create(start, end);
    }
    Range.intersection = intersection;
})(Range = exports.Range || (exports.Range = {}));
//# sourceMappingURL=protocol-translation.js.map