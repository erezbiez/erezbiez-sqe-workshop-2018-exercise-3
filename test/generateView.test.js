import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {substituteParsedCode} from '../src/js/generateView';

describe('The generate view module', () => {
    it('is parsing assignment expression statement correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('i=0;'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'assignment expression',
                'name': 'i',
                'condition': '',
                'value': '0'
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing for statement with variable declaration as init correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('for (let i=0; i<10; i++) {}'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'for statement',
                'name': '',
                'condition': 'i = 0; i&lt10; i++',
                'value': ''
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing for statement with assignment expression as init correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('for (let i=0; i<10; i++) {}'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'for statement',
                'name': '',
                'condition': 'i = 0; i&lt10; i++',
                'value': ''
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing variable declaration of one variable correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('let i;'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'variable declaration',
                'name': 'i',
                'condition': '',
                'value': ''
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing variable declaration of one variable with init correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('let i=0;'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'variable declaration',
                'name': 'i',
                'condition': '',
                'value': '0'
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing variable declaration of few variables correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('let a,b;'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'variable declaration',
                'name': 'a',
                'condition': '',
                'value': ''
            },
            {
                'line': 1,
                'type': 'variable declaration',
                'name': 'b',
                'condition': '',
                'value': ''
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing variable declaration of few variables with init correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('let a=1, b=2;'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'variable declaration',
                'name': 'a',
                'condition': '',
                'value': '1'
            },
            {
                'line': 1,
                'type': 'variable declaration',
                'name': 'b',
                'condition': '',
                'value': '2'
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing if statement with no else correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('if (i>0) {}'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'if statement',
                'name': '',
                'condition': 'i&gt0',
                'value': ''
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing if statement with else correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('if (i>0) {}\n else {}'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'if statement',
                'name': '',
                'condition': 'i&gt0',
                'value': ''
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing if statement with else if and no else correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('if (i>0) {} \n' +
            'else if (i<-5) {}'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'if statement',
                'name': '',
                'condition': 'i&gt0',
                'value': ''
            },
            {
                'line': 2,
                'type': 'else if statement',
                'name': '',
                'condition': 'i&lt-5',
                'value': ''
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing if statement with else if and else correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('if (i>0) {} \n' +
            'else if (i<-5) {}\n' +
            'else {}'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'if statement',
                'name': '',
                'condition': 'i&gt0',
                'value': ''
            },
            {
                'line': 2,
                'type': 'else if statement',
                'name': '',
                'condition': 'i&lt-5',
                'value': ''
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing while statement correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('while (i<0){\n' +
            'i++;\n' +
            '}\n'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'while statement',
                'name': '',
                'condition': 'i&lt0',
                'value': ''
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing function declaration (on args) correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('function foo(){}'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'function declaration',
                'name': 'foo',
                'condition': '',
                'value': ''
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

    it('is parsing function declaration (with args), variable declaration and return statement correctly', () => {
        let rowsList = [];
        substituteParsedCode(parseCode('function foo(a){\n' +
            'return a;\n' +
            '}'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'function declaration',
                'name': 'foo',
                'condition': '',
                'value': ''
            },
            {
                'line': 1,
                'type': 'variable declartion',
                'name': 'a',
                'condition': '',
                'value': ''
            },
            {
                'line': 2,
                'type': 'return statement',
                'name': '',
                'condition': '',
                'value': 'a'
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

});
