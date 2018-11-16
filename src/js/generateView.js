const handlers = {
    'AssignmentExpression': assignmentExpression,
    'BlockStatement': body,
    'ExpressionStatement': expressionStatement,
    'ForStatement': forStatement,
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
    'UnaryExpression': unaryExpression,
    'UpdateExpression': updateExpression,
    'VariableDeclaration': variableDeclarationWithResult,
    'AssignmentExpression': assignmentExpressionWithResult
};

function parsedCodeToTable(exp, rowsList) {
    if (exp.type in handlers)
        handlers[exp.type](exp, rowsList);
}

function assignmentExpressionWithResult(exp){
    return atomicHandlers[exp.left.type](exp.left)+' = '+atomicHandlers[exp.right.type](exp.right);
}

function assignmentExpression(exp, rowsList) {
    pushToTable(rowsList, exp.loc.start.line, 'assignment expression', atomicHandlers[exp.left.type](exp.left), '', atomicHandlers[exp.right.type](exp.right));
}

function binaryExpression(exp) {
    let op = exp.operator;
    switch (op) {
    case '<':
        op = '&lt'; break;
    case '>':
        op = '&gt'; break;
    case '&':
        op='&amp'; break;
    case '&&':
        op='&amp&amp'; break;
    }
    return atomicHandlers[exp.left.type](exp.left) + op + atomicHandlers[exp.right.type](exp.right);
}

function body(exp, rowsList) {
    exp.body.forEach(e => parsedCodeToTable(e, rowsList));
}

function expressionStatement(exp, rowsList) {
    parsedCodeToTable(exp.expression, rowsList);
}

function forStatement(exp, rowsList) {
    let condition = atomicHandlers[exp.init.type](exp.init) + '; ' + atomicHandlers[exp.test.type](exp.test) + '; ' + atomicHandlers[exp.update.type](exp.update);
    pushToTable(rowsList, exp.loc.start.line, 'for statement', '', condition, '');
}

function param(param, rowsList) {
    pushToTable(rowsList, param.loc.start.line, 'variable declartion', param.name, '', '');
}

function functionDeclaration(exp, rowsList) {
    pushToTable(rowsList, exp.loc.start.line, 'function declaration', atomicHandlers[exp.id.type](exp.id), '', '');
    exp.params.forEach(p => param(p, rowsList));
    parsedCodeToTable(exp.body, rowsList);
}

function identifier(exp) {
    return exp.name;
}

function ifStatement(exp, rowsList) {
    ifStatementHelper(exp, rowsList, true);
}

function ifStatementHelper(exp, rowsList, firstIf) {
    if (firstIf)
        pushToTable(rowsList, exp.loc.start.line, 'if statement', '', atomicHandlers[exp.test.type](exp.test), '');
    else
        pushToTable(rowsList, exp.loc.start.line, 'else if statement', '', atomicHandlers[exp.test.type](exp.test), '');
    parsedCodeToTable(exp.consequent, rowsList);
    if (exp.alternate !== null) {
        if (exp.alternate.type !== 'IfStatement')
            parsedCodeToTable(exp.alternate, rowsList);
        else
            ifStatementHelper(exp.alternate, rowsList, false);
    }
}

function literal(exp) {
    return exp.raw;
}

function memberExpression(exp) {
    return atomicHandlers[exp.object.type](exp.object) + '[' + atomicHandlers[exp.property.type](exp.property) + ']';
}

function returnStatement(exp, rowsList) {
    pushToTable(rowsList, exp.loc.start.line, 'return statement', '', '', atomicHandlers[exp.argument.type](exp.argument));
}

function unaryExpression(exp) {
    return exp.operator + atomicHandlers[exp.argument.type](exp.argument);
}

function updateExpression(exp) {
    return atomicHandlers[exp.argument.type](exp.argument) + exp.operator;
}

function variableDeclaration(exp, rowsList, toReturn) {
    exp.declarations.forEach(d => variableDeclarator(d, rowsList, toReturn));
}

function variableDeclarationWithResult(exp) {
    return exp.declarations.reduce((str, d) => str + variableDeclaratorWithResult(d), '');
}

function variableDeclarator(exp, rowsList) {
    let init = '';
    if (exp.init !== null)
        init = atomicHandlers[exp.init.type](exp.init);
    pushToTable(rowsList, exp.loc.start.line, 'variable declaration', atomicHandlers[exp.id.type](exp.id), '', init);
}

function variableDeclaratorWithResult(exp) {
    let init = '';
    let vd = atomicHandlers[exp.id.type](exp.id);
    if (exp.init !== null) {
        init = atomicHandlers[exp.init.type](exp.init);
        vd = vd + ' = ' + init;
    }
    return vd;
}

function whileStatement(exp, rowsList) {
    pushToTable(rowsList, exp.loc.start.line, 'while statement', '', atomicHandlers[exp.test.type](exp.test), '');
    parsedCodeToTable(exp.body, rowsList);
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

function generateTable(parsedCode) {
    let rowsList = [];
    pushToTable(rowsList, 'Line', 'Type', 'Name', 'Condition', 'Value');
    parsedCodeToTable(parsedCode, rowsList);
    return rowsList.reduce((str, row) => str + generateRow(row), '');
}

export {generateTable, parsedCodeToTable};

