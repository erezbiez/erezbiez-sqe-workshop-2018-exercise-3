/* eslint-disable max-lines-per-function */
import assert from 'assert';
import {parseCode, parseCodeNoLoc} from '../src/js/code-analyzer';
import {evaluateParams, generateSubstitutedCode} from '../src/js/substitutioner';

describe('The substitution module', () => {
    it('generate if statements substituted code correctly', () => {
        let colors = {'red': [], 'green': []};
        let actualSubstitutedCode = generateSubstitutedCode(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n'), [], colors);
        let expectedSubstitutedCode = generateSubstitutedCode(parseCode(
            ' function foo(x, y, z) {\n' +
            '    if (x + 1 + y < z) {\n' +
            '        return x + y + z + 5;\n' +
            '    } else if (x + 1 + y < z * 2) {\n' +
            '        return x + y + z + (x + 5);\n' +
            '    } else {\n' +
            '        return x + y + z + (z + 5);\n' +
            '    }\n' +
            '}'), [], colors);
        assert.equal(actualSubstitutedCode,expectedSubstitutedCode);
    });
    it('generate while statements substituted code correctly', () => {
        let colors = {'red': [], 'green': []};
        let actualSubstitutedCode = generateSubstitutedCode(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    while (a < z) {\n' +
            '        c = a + b;\n' +
            '        z = c * 2;\n' +
            '    }\n' +
            '    \n' +
            '    return z;\n' +
            '}\n'), [], colors);
        let expectedSubstitutedCode = generateSubstitutedCode(parseCode('function foo(x, y, z){\n' +
            '    while (x + 1 < z) {\n' +
            '        z = (x + 1 + (x + 1 + y)) * 2;\n' +
            '    }\n' +
            '    \n' +
            '    return z;\n' +
            '}\n'), [], colors);
        assert.equal(actualSubstitutedCode,expectedSubstitutedCode);
    });
    it('generate member statements substituted code correctly', () => {
        let colors = {'red': [], 'green': []};
        let actualSubstitutedCode = generateSubstitutedCode(parseCode('function foo(x, y, z){\n' +
            '    let a = x[0];\n' +
            '    return a;\n' +
            '}\n'), [], colors);
        let expectedSubstitutedCode = generateSubstitutedCode(parseCode(
            ' function foo(x, y, z) {\n' +
            '    return x[0];\n' +
            '}'), [], colors);
        assert.equal(actualSubstitutedCode,expectedSubstitutedCode);
    });
    it('member statement on the right of assignment expression -  correctly', () => {
        let colors = {'red': [], 'green': []};
        let actualSubstitutedCode = generateSubstitutedCode(parseCode('function foo(x, y, z){\n' +
            '    x[0] = 1;\n' +
            '    return y;\n' +
            '}\n'), [], colors);
        let expectedSubstitutedCode = generateSubstitutedCode(parseCode(
            ' function foo(x, y, z) {\n' +
            '    x[0] = 1;\n' +
            '    return y;\n' +
            '}'), [], colors);
        assert.equal(actualSubstitutedCode,expectedSubstitutedCode);
    });
    it('colors if + if else test correctly', () => {
        let actualColors = {'red': [], 'green': []};
        let actualSubstitutedCode = generateSubstitutedCode(parseCode(generateSubstitutedCode(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n'), [], actualColors)), evaluateParams(parseCode('0,0,10')), actualColors);
        let expectedColors = {'red': [6], 'green': [2,4]};
        assert.equal(JSON.stringify(actualColors), JSON.stringify(expectedColors));
    });
    it('colors else if test correctly', () => {
        let actualColors = {'red': [], 'green': []};
        let actualSubstitutedCode = generateSubstitutedCode(parseCode(generateSubstitutedCode(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n'), [], actualColors)), evaluateParams(parseCode('1,1,2')), actualColors);
        let expectedColors = {'red': [2,6], 'green': [4]};
        assert.equal(JSON.stringify(actualColors), JSON.stringify(expectedColors));
    });
    it('colors else test correctly', () => {
        let actualColors = {'red': [], 'green': []};
        let actualSubstitutedCode = generateSubstitutedCode(parseCode(generateSubstitutedCode(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n'), [], actualColors)), evaluateParams(parseCode('0,0,0')), actualColors);
        let expectedColors = {'red': [2,4], 'green': [6]};
        assert.equal(JSON.stringify(actualColors), JSON.stringify(expectedColors));
    });
    it('evaluates no params correctly', () => {
        let actualParams = evaluateParams(parseCode(''));
        let expectedParams = [];
        assert.equal(actualParams.length,expectedParams.length);
    });
    it('evaluates one param correctly', () => {
        let actualParams = evaluateParams(parseCodeNoLoc('1'));
        let expectedParams = [{
            'type': 'Literal',
            'value': 1,
            'raw': '1'
        }];
        assert.equal(actualParams.length,expectedParams.length);
    });
    it('evaluates few params correctly', () => {
        let actualParams = evaluateParams(parseCodeNoLoc('1, true, "hello", [1,2]'));
        let expectedParams = [
            {
                'type': 'Literal',
                'value': 1,
                'raw': '1'
            },
            {
                'type': 'Literal',
                'value': true,
                'raw': 'true'
            },
            {
                'type': 'Literal',
                'value': 'hello',
                'raw': '"hello"'
            },
            {
                'type': 'ArrayExpression',
                'elements': [
                    {
                        'type': 'Literal',
                        'value': 1,
                        'raw': '1'
                    },
                    {
                        'type': 'Literal',
                        'value': 2,
                        'raw': '2'
                    }
                ]
            }
        ];
        assert.equal(actualParams.length,expectedParams.length);
    });

});
