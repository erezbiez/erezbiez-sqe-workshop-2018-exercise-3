import * as escodegen from 'escodegen';

/* eslint-disable complexity,no-unused-vars */
const handlers = {
    'AssignmentExpression': assignmentExpression,
    'BlockStatement': body,
    'ExpressionStatement': expressionStatement,
    'FunctionDeclaration': functionDeclaration,
    'IfStatement': ifStatement,
    'Program': body,
    'VariableDeclaration': variableDeclaration,
    'WhileStatement': whileStatement,
    'ReturnStatement': returnStatement
};

const atomicHandlers = {
    'BinaryExpression': binaryExpression,
    'Identifier': identifier,
    'Literal': literal,
    'LogicalExpression': binaryExpression,
    'MemberExpression': memberExpression,
};

function substituteParsedCode(exp, env, params, colors) {
    if (exp.type in handlers)
        return handlers[exp.type](exp, env, params, colors);
    return false;
}

function assignmentExpression(exp, env, params, colors) {
    env[exp.left.name] = atomicHandlers[exp.right.type](exp.right, env);
    return !(params.includes(exp.left.name));
}

function binaryExpression(exp, env) {
    exp.left = atomicHandlers[exp.left.type](exp.left, env);
    exp.right = atomicHandlers[exp.right.type](exp.right, env);
    if (exp.left.type === 'Literal' && exp.right.type === 'Literal'){
        const value = eval(exp.left.raw+exp.operator+exp.right.raw);
        return {'type': 'Literal', 'value': value, 'raw': ''+value};
    }
    if (exp.left.type === 'Literal' && exp.left.value === 0) return exp.right;
    if (exp.right.type === 'Literal' && exp.right.value === 0) return exp.left;
    return exp;
}

function body(exp, initEnv, params, colors) {
    let env = JSON.parse(JSON.stringify(initEnv));
    let expsToRemove = [];
    for (let i = 0; i < exp.body.length; i++) {
        if (substituteParsedCode(exp.body[i], env, params, colors))
            expsToRemove.push(i);
    }
    for (let i = expsToRemove.length-1; i >= 0 ; i--) {
        exp.body.splice(expsToRemove[i], 1);
    }
}

function expressionStatement(exp, env, params, colors) {
    return substituteParsedCode(exp.expression, env, params, colors);
}

function param(param, env, params) {
    env[param.name] = param;
    params.push(param.name);
}

function paramWithValue(param, value, env) {
    env[param.name] = value;
}

function functionDeclaration(exp, env, params, colors) {
    if (params.length === 0)
        exp.params.forEach(p => param(p, env, params));
    else
        exp.params.forEach((p,i) => paramWithValue(p, params[i], env));
    substituteParsedCode(exp.body, env, params, colors);
}

function identifier(exp, env) {
    return env[exp.name];
}

function ifStatement(exp, env, params, colors) {
    exp.test = atomicHandlers[exp.test.type](exp.test, env);
    if (exp.test.type === 'Literal') {
        if (exp.test.value) colors['green'].push(exp.loc.start.line);
        else colors['red'].push(exp.loc.start.line);
    }
    substituteParsedCode(exp.consequent, env, params, colors);
    if (exp.alternate !== null)
        if (exp.test.type === 'Literal' && exp.alternate.type === 'BlockStatement') {
            if (exp.test.value) colors['red'].push(exp.alternate.loc.start.line);
            else colors['green'].push(exp.alternate.loc.start.line);
        }
    substituteParsedCode(exp.alternate, env, params, colors);
}

// eslint-disable-next-line no-unused-vars
function literal(exp, env) {
    return exp;
}

function memberExpression(exp, env) {
    exp.object = atomicHandlers[exp.object.type](exp.object, env);
    exp.propery = atomicHandlers[exp.property.type](exp.property, env);
    return exp;
}

function returnStatement(exp, env, params, colors) {
    exp.argument = atomicHandlers[exp.argument.type](exp.argument,env);
    return false;
}

function variableDeclaration(exp, env, params, colors) {
    for (let i = 0; i < exp.declarations.length; i++)
        variableDeclarator(exp.declarations[i], env);
    return true;
}

function variableDeclarator(exp, env) {
    let init = exp.id;
    if (exp.init !== null) {
        init = atomicHandlers[exp.init.type](exp.init, env);
    }
    env[exp.id.name] = init;
}

function whileStatement(exp, env, params, colors) {
    exp.test = atomicHandlers[exp.test.type](exp.test, env);
    return substituteParsedCode(exp.body, env, params, colors);
}

function evaluateParams(parsedCode) {
    let res = [];
    if (parsedCode.body.length !== 0)
        res = parsedCode.body[0].expression.expressions;
    return res;
}

function generateSubstitutedCode(parsedCode, params, colors) {
    let env = {};
    substituteParsedCode(parsedCode, env, params, colors);
    return escodegen.generate(parsedCode);
}

function generateRow(row, i, colors) {
    let color = 'black';
    if (colors.red.includes(i)) color = 'red'
    if (colors.green.includes(i)) color = 'green'
    return '<span style="white-space: pre; color: ' + color + ';">'+ row + '</span><br>';
}

export {evaluateParams, generateSubstitutedCode, generateRow};

