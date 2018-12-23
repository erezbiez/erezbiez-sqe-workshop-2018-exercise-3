/* eslint-disable max-lines-per-function */
import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {evaluateParams, generateGraph} from '../src/js/graph-generator';

describe('The graph generator module', () => {
    it('generate if statements graph correctly - if', () => {
        let initParams = evaluateParams(parseCode('0, 0, 0'));
        let actualGrpah = generateGraph(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n'), initParams);
        let expectedGraph = 'digraph cfg { forcelabels=true n0 [label="let a = x + 1; \n' +
            ' let b = a + y; \n' +
            ' let c = 0;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n1 [label="b < z", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\n' +
            'n2 [label="c = c + 5", xlabel = 3,  shape=rectangle,]\n' +
            'n3 [label="return c;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n4 [label="b < z * 2", xlabel = 5,  shape=diamond, style = filled, fillcolor = green]\n' +
            'n5 [label="c = c + x + 5", xlabel = 6,  shape=rectangle,]\n' +
            'n6 [label="c = c + z + 5", xlabel = 7,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="T"]\n' +
            'n1 -> n4 [label="F"]\n' +
            'n2 -> n3 []\n' +
            'n4 -> n5 [label="T"]\n' +
            'n4 -> n6 [label="F"]\n' +
            'n5 -> n3 []\n' +
            'n6 -> n3 []\n' +
            ' }';
        assert.equal(actualGrpah, expectedGraph);
    });
    it('generate if statements graph correctly - if else', () => {
        let initParams = evaluateParams(parseCode('1, 2, 3'));
        let actualGrpah = generateGraph(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n'), initParams);
        let expectedGraph = 'digraph cfg { forcelabels=true n0 [label="let a = x + 1; \n' +
            ' let b = a + y; \n' +
            ' let c = 0;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n1 [label="b < z", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\n' +
            'n2 [label="c = c + 5", xlabel = 3,  shape=rectangle,]\n' +
            'n3 [label="return c;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n4 [label="b < z * 2", xlabel = 5,  shape=diamond, style = filled, fillcolor = green]\n' +
            'n5 [label="c = c + x + 5", xlabel = 6,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n6 [label="c = c + z + 5", xlabel = 7,  shape=rectangle,]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="T"]\n' +
            'n1 -> n4 [label="F"]\n' +
            'n2 -> n3 []\n' +
            'n4 -> n5 [label="T"]\n' +
            'n4 -> n6 [label="F"]\n' +
            'n5 -> n3 []\n' +
            'n6 -> n3 []\n' +
            ' }';
        assert.equal(actualGrpah, expectedGraph);
    });
    it('generate if statements graph correctly - else', () => {
        let initParams = evaluateParams(parseCode('0, 0, 3'));
        let actualGrpah = generateGraph(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n'), initParams);
        let expectedGraph = 'digraph cfg { forcelabels=true n0 [label="let a = x + 1; \n' +
            ' let b = a + y; \n' +
            ' let c = 0;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n1 [label="b < z", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\n' +
            'n2 [label="c = c + 5", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n3 [label="return c;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n4 [label="b < z * 2", xlabel = 5,  shape=diamond,]\n' +
            'n5 [label="c = c + x + 5", xlabel = 6,  shape=rectangle,]\n' +
            'n6 [label="c = c + z + 5", xlabel = 7,  shape=rectangle,]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="T"]\n' +
            'n1 -> n4 [label="F"]\n' +
            'n2 -> n3 []\n' +
            'n4 -> n5 [label="T"]\n' +
            'n4 -> n6 [label="F"]\n' +
            'n5 -> n3 []\n' +
            'n6 -> n3 []\n' +
            ' }';
        assert.equal(actualGrpah, expectedGraph);
    });
    it('generate if statements graph correctly + arrays', () => {
        let initParams = evaluateParams(parseCode(''));
        let actualGrpah = generateGraph(parseCode('function foo(){\n' +
            '    let a = [1,2];\n' +
            '    let b = a[0];\n' +
            '    if (b==1){\n' +
            '       a[1]=3;\n' +
            '    }\n' +
            '    return b;\n' +
            '}\n'), initParams);
        let expectedGraph = 'digraph cfg { forcelabels=true n0 [label="let a = [1,2]; \n' +
            ' let b = a[0];", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n1 [label="b == 1", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\n' +
            'n2 [label="a[1] = 3", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n3 [label="return b;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="T"]\n' +
            'n1 -> n3 [label="F"]\n' +
            'n2 -> n3 []\n' +
            ' }';
        assert.equal(actualGrpah, expectedGraph);
    });
    it('generate while statements graph correctly - 1', () => {
        let initParams = evaluateParams(parseCode('0,0,0'));
        let actualGrpah = generateGraph(parseCode('function foo(x, y, z){\n' +
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
            '}\n'), initParams);
        let expectedGraph = 'digraph cfg { forcelabels=true n0 [label="let a = x + 1; \n' +
            ' let b = a + y; \n' +
            ' let c = 0;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n1 [label="a < z", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\n' +
            'n2 [label="c = a + b \n' +
            ' z = c * 2", xlabel = 3,  shape=rectangle,]\n' +
            'n3 [label="return z;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="T"]\n' +
            'n1 -> n3 [label="F"]\n' +
            'n2 -> n1 []\n' +
            ' }';
        assert.equal(actualGrpah, expectedGraph);
    });
    it('generate while statements graph correctly - 2', () => {
        let initParams = evaluateParams(parseCode('0,0,10'));
        let actualGrpah = generateGraph(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    while (a < z) {\n' +
            '        a = a+1;\n' +
            '    }\n' +
            '    \n' +
            '    return z;\n' +
            '}\n'), initParams);
        let expectedGraph = 'digraph cfg { forcelabels=true n0 [label="let a = x + 1; \n' +
            ' let b = a + y; \n' +
            ' let c = 0;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n1 [label="a < z", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\n' +
            'n2 [label="a = a + 1", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n3 [label="return z;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="T"]\n' +
            'n1 -> n3 [label="F"]\n' +
            'n2 -> n1 []\n' +
            ' }';
        assert.equal(actualGrpah, expectedGraph);
    });
    it('generate while + if statements graph correctly', () => {
        let initParams = evaluateParams(parseCode('1'));
        let actualGrpah = generateGraph(parseCode('function foo(x){\n' +
            '    let a = x + 1;\n' +
            '    \n' +
            '    while (x < a) {\n' +
            '        if (x==1){ \n' +
            '            x = a;\n' +
            '        }\n' +
            '        else {\n' +
            '            x = x+1;\n' +
            '        }\n' +
            '    }\n' +
            '    \n' +
            '    return a;\n' +
            '}\n'), initParams);
        let expectedGraph = 'digraph cfg { forcelabels=true n0 [label="let a = x + 1;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n1 [label="x < a", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\n' +
            'n2 [label="x == 1", xlabel = 3,  shape=diamond, style = filled, fillcolor = green]\n' +
            'n3 [label="x = a", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n4 [label="x = x + 1", xlabel = 5,  shape=rectangle,]\n' +
            'n5 [label="return a;", xlabel = 6,  shape=rectangle, style = filled, fillcolor = green]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="T"]\n' +
            'n1 -> n5 [label="F"]\n' +
            'n2 -> n3 [label="T"]\n' +
            'n2 -> n4 [label="F"]\n' +
            'n3 -> n1 []\n' +
            'n4 -> n1 []\n' +
            ' }';
        assert.equal(actualGrpah, expectedGraph);
    });
    it('evaluates no params correctly', () => {
        let actualParams = evaluateParams(parseCode(''));
        let expectedParams = [];
        assert.equal(actualParams.length,expectedParams.length);
    });
    it('evaluates one param correctly', () => {
        let actualParams = evaluateParams(parseCode('1'));
        let expectedParams = [1];
        assert.equal(actualParams.length,expectedParams.length);
    });
    it('evaluates few params correctly', () => {
        let actualParams = evaluateParams(parseCode('1, true, "hello", [1,2]'));
        let expectedParams = [1, true, 'hello', [1,2]];
        assert.equal(actualParams.length, expectedParams.length);
    });

});
