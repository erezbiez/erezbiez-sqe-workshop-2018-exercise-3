import * as escodegen from 'escodegen';
import * as esgraph from 'esgraph';
import {parseCode} from './code-analyzer';

/* eslint-disable complexity,no-unused-vars */
const handlers = {
    'AssignmentExpression': assignmentExpression,
    'BlockStatement': body,
    'ExpressionStatement': expressionStatement,
    'Program': body,
    'VariableDeclaration': variableDeclaration,
    'BinaryExpression': binaryExpression,
};

const atomicHandlers = {
    'ArrayExpression': arrayExpression,
    'BinaryExpression': binaryExpression,
    'Identifier': identifier,
    'Literal': literal,
    'LogicalExpression': binaryExpression,
    'MemberExpression': memberExpression,
};

function evaluateCode(exp, env) {
    return handlers[exp.type](exp, env);
}

function arrayExpression(exp, env) {
    return eval('[' + exp.elements.map(ex => atomicHandlers[ex.type](ex, env)).join(',') + ']');
}

function assignmentExpression(exp, env) {
    if (exp.left.type === 'MemberExpression') {
        env[exp.left.object.name][exp.left.property.value] = atomicHandlers[exp.right.type](exp.right, env);
    } else {
        env[exp.left.name] = atomicHandlers[exp.right.type](exp.right, env);
    }
    return true;
}

function binaryExpression(exp, env) {
    let left = atomicHandlers[exp.left.type](exp.left, env);
    let right = atomicHandlers[exp.right.type](exp.right, env);
    return eval(left + exp.operator + right);
}

function body(exp, env) {
    for (let i = 0; i < exp.body.length; i++) {
        evaluateCode(exp.body[i], env);
    }
    return true;
}

function expressionStatement(exp, env) {
    return evaluateCode(exp.expression, env);
}

function identifier(exp, env) {
    return env[exp.name];
}

function literal(exp, env) {
    return exp.value;
}

function memberExpression(exp, env) {
    let arr = env[exp.object.name];
    let property = exp.property.value;
    return arr[property];
}

function variableDeclaration(exp, env) {
    for (let i = 0; i < exp.declarations.length; i++)
        variableDeclarator(exp.declarations[i], env);
    return true;
}

function variableDeclarator(exp, env) {
    if (exp.init !== null) {
        env[exp.id.name] = atomicHandlers[exp.init.type](exp.init, env);
    }
}

function evaluateParams(parsedCode) {
    let params;
    let env = {};
    if (parsedCode.body.length !== 0) {
        params = parsedCode.body[0].expression;
        if (params.type === 'SequenceExpression')
            return params.expressions.map(ex => atomicHandlers[ex.type](ex, env));
        else {
            let arr = [];
            arr.push(atomicHandlers[params.type](params, env));
            return arr;
        }
    } else {
        return [];
    }
}

function buildEnv(parsedCode, values) {
    let env = {};
    let params = parsedCode.body[0].params;
    for (let i = 0; i < params.length; i++) {
        if (params[i].type === 'ArrayExpression') {
            env[params[i].object.name] = values[i];
        } else {
            env[params[i].name] = values[i];
        }
    }
    return env;
}

function generateGraph(parsedCode, values) {
    let nodes = createNodes(parsedCode);
    let env = buildEnv(parsedCode, values);
    let currNode = nodes[0];
    while (currNode.next.length !== 0) {
        currNode.green = true;
        if (currNode.normal) {
            evaluateCode(parseCode(currNode.label), env);
            currNode = currNode.normal;
        }
        else if (evaluateCode(parseCode(currNode.label).body[0], env)) {
            currNode = currNode.true;
        } else {
            currNode = currNode.false;
        }
    }
    currNode.green = true;
    return createDotGraph(nodes);
}

function createNodes(parsedCode) {
    let nodes = esgraph(parsedCode.body[0].body)[2];
    nodes = nodes.slice(1, nodes.length - 1);
    nodes[0].prev = [];
    nodes.filter(node => node.astNode.type === 'ReturnStatement').forEach(node => {node.next=[]; delete node.normal;});
    nodes.forEach(node => node.label = escodegen.generate(node.astNode).replace(new RegExp('\\n', 'g'),'').replace(new RegExp(' {2}', 'g'),''));
    for (let i = 0; i < nodes.length; i++) {
        let currNode = nodes[i];
        if (currNode.normal && currNode.normal.normal && currNode.normal.next.length !== 0) {
            nodes.splice(nodes.indexOf(currNode.normal), 1);
            currNode.label = `${currNode.label} \n ${currNode.normal.label}`;
            currNode.next = currNode.normal.next;
            currNode.normal = currNode.normal.normal;
            i--;
        }
    }
    return nodes;
}

/** based on esgraph.dot(cfg, options) */
function createDotGraph(nodes) {
    const output = ['digraph cfg { forcelabels=true '];
    printAllNodes(output, nodes);
    printAllEdges(output, nodes);
    output.push(' }');
    return output.join('');
}

function printAllNodes(output, nodes) {
    for (const [i, node] of nodes.entries()) {
        let {label = node.type} = node;
        output.push(`n${i} [label="${label}", xlabel = ${i + 1}, `);
        let shape = 'rectangle';
        if (node.true || node.false) {
            shape = 'diamond';
        }
        output.push(` shape=${shape},`);
        if (node.green) {
            output.push(' style = filled, fillcolor = green');
        }
        output.push(']\n');
    }
}

function printAllEdges(output, nodes) {
    for (const [i, node] of nodes.entries()) {
        for (const type of ['normal', 'true', 'false']) {
            const next = node[type];
            if (!next) continue;
            output.push(`n${i} -> n${nodes.indexOf(next)} [`);
            if (['true', 'false'].includes(type)) output.push(`label="${type.charAt(0).toUpperCase()}"`);
            output.push(']\n');
        }
    }
}

export {generateGraph, evaluateParams};

