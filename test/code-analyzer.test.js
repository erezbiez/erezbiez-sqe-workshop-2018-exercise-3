import assert from 'assert';
import {parseCodeNoRange} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCodeNoRange('')),
            JSON.stringify(JSON.parse('{\n' +
            '  "type": "Program",\n' +
            '  "body": [],\n' +
            '  "sourceType": "script"\n' +
            '}'))
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCodeNoRange('let a = 1;')),
            JSON.stringify(JSON.parse(
                '{\n' +
                '  "type": "Program",\n' +
                '  "body": [\n' +
                '    {\n' +
                '      "type": "VariableDeclaration",\n' +
                '      "declarations": [\n' +
                '        {\n' +
                '          "type": "VariableDeclarator",\n' +
                '          "id": {\n' +
                '            "type": "Identifier",\n' +
                '            "name": "a"\n' +
                '          },\n' +
                '          "init": {\n' +
                '            "type": "Literal",\n' +
                '            "value": 1,\n' +
                '            "raw": "1"\n' +
                '          }\n' +
                '        }\n' +
                '      ],\n' +
                '      "kind": "let"\n' +
                '    }\n' +
                '  ],\n' +
                '  "sourceType": "script"\n' +
                '}'))
        );
    });
});
