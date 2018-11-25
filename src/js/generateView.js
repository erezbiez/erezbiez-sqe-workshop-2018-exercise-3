import * as escodegen from 'escodegen';

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

function substituteParsedCode(exp, env) {
    if (exp.type in handlers)
        handlers[exp.type](exp, env);
}

function assignmentExpression(exp, env) {
    env[atomicHandlers[exp.left.type](exp.left, env)] = atomicHandlers[exp.right.type](exp.right, env);
}

function binaryExpression(exp, env) {
    exp.left = atomicHandlers[exp.left.type](exp.left, env);
    exp.right = atomicHandlers[exp.right.type](exp.right, env);
    if (exp.left.type === 'Literal' && exp.left.type === 'Literal'){
        const value = eval(exp.left.raw+exp.operator+exp.right.raw);
        exp = {'type': 'Literal', 'value': value, 'raw': ''+value};
    }
    return exp;
}

function body(exp, initEnv) {
    let env = JSON.parse(JSON.stringify(initEnv));
    let expsToRemove = []
    for (let i = 0; i < exp.body.length; i++) {
        substituteParsedCode(exp.body[i], env);
        if (exp.body[i].type === 'ExpressionStatement' || exp.body[i].type === 'VariableDeclaration')
            expsToRemove.push(i);
    }
    for (let i = 0; i < expsToRemove.length; i++) {
        exp.body.splice(expsToRemove[i], 1);
    }
}

function expressionStatement(exp, env) {
    substituteParsedCode(exp.expression, env);
}

function param(param, env) {
    env[param] = param;
}

function functionDeclaration(exp, env) {
    exp.params.forEach(p => param(p, env));
    substituteParsedCode(exp.body, env);
}

function identifier(exp, env) {
    return env[exp.name];
}

function ifStatement(exp, env) {
    exp.test = atomicHandlers[exp.test.type](exp.test, env);
    substituteParsedCode(exp.consequent, env);
    if (exp.alternate !== null)
        substituteParsedCode(exp.alternate, env);
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

function returnStatement(exp, env) {
    atomicHandlers[exp.argument.type](exp.argument,env);
}

function variableDeclaration(exp, env) {
    for (let i = 0; i < exp.declarations.length; i++)
        variableDeclarator(exp.declarations[i],env);
}

function variableDeclarator(exp, env) {
    let init = exp.id.name;
    if (exp.init !== null) {
        init = atomicHandlers[exp.init.type](exp.init, env);
    }
    env[exp.id.name] = init;
}

function whileStatement(exp, env) {
    exp.test = atomicHandlers[exp.test.type](exp.test, env);
    substituteParsedCode(exp.body, env);
}

function pushToTable(rowsList, line, type, name, condition, value) {
    rowsList.push({'line': line, 'type': type, 'name': name, 'condition': condition, 'value': value});
}

function generateRow(obj) {
    return '<tr>\n<td>\n' + obj.line + '\n</td>\n' +
        '<td>\n' + obj.type + '\n</td>\n' +
        '<td>\n' + obj.name + '\n</td>\n' +
        '<td>\n' + obj.condition + '\n</td>\n' +
        '<td>\n' + obj.value + '\n</td>\n</tr>\n';
}

function generateSubtitutedCode(parsedCode) {
    let env = [];
    substituteParsedCode(parsedCode, env);
    return escodegen.generate(parsedCode);
}

export {generateSubtitutedCode, substituteParsedCode};

