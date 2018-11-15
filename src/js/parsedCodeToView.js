function parsedCodeToView(exp){
    switch (exp.type) {
    case 'AssignmentExpression': return assignmentExpressionToView(exp);
    case 'BinaryExpression': return binaryExpressionToView(exp);
    case 'BlockStatement': return bodyToView(exp.body);
    case 'ExpressionStatement': return parsedCodeToView(exp.expression);
    case 'FunctionDeclaration': return functionDeclarationToView(exp);
    case 'Identifier': return exp.name;
    case 'IfStatement': return ifStatementToView(exp, false);
    case 'Literal': return exp.raw;
    case 'MemberExpression': return parsedCodeToView(exp.object) + '[' + parsedCodeToView(exp.property) + ']';
    case 'Program': return bodyToView(exp.body);
    case 'UnaryExpression': return unaryExpressionToView(exp);
    case 'VariableDeclaration': return variableDeclarationToView(exp);
    case 'WhileStatement': return whileStatementToView(exp);
    case 'ReturnStatement': return returnStatementToView(exp);
    default: return 'Not Supported';
    }
}

function assignmentExpressionToView(exp) {
    return buildRow(exp.loc.start.line, 'assignment expression', parsedCodeToView(exp.left), '', parsedCodeToView(exp.right));
}

function bodyToView(exp) {
    return exp.reduce((exps, currExp) => exps + parsedCodeToView(currExp), '');
}

function binaryExpressionToView(exp) {
    return parsedCodeToView(exp.left) + exp.operator + parsedCodeToView(exp.right);
}

function functionDeclarationToView(exp) {
    const functionDeclaration = buildRow(exp.loc.start.line, 'function declaration', parsedCodeToView(exp.id), '', '');
    let variablesDeclaration = '';
    if ('params' in exp) {
        variablesDeclaration = exp.params.reduce((table, param) => table + buildRow(param.loc.start.line, 'variable declartion', param.name, '', ''), '');
    }
    const body = parsedCodeToView(exp.body);
    return functionDeclaration + variablesDeclaration + body;
}

function ifStatementToView(exp, elseif) {
    let test = buildRow(exp.loc.start.line, 'if statement', '', parsedCodeToView(exp.test), '');
    if (elseif)
        test = buildRow(exp.loc.start.line, 'else if statement', '', parsedCodeToView(exp.test), '');
    const consequent = parsedCodeToView(exp.consequent);
    let view = test + consequent;
    if ('alternate' in exp) {
        const alternate = exp.alternate.type !== 'IfStatement'
            ? parsedCodeToView(exp.alternate)
            : ifStatementToView(exp.alternate, true);
        view = view + alternate;
    }
    return view;
}

function returnStatementToView(exp) {
    return buildRow(exp.loc.start.line, 'return statement', '', '', parsedCodeToView(exp.argument));
}

function unaryExpressionToView(exp) {
    return exp.operator + parsedCodeToView(exp.argument);
}

function variableDeclarationToView(exp) {
    return exp.declarations.reduce((exps, exp) => exps + variableDeclaratorToView(exp), '');
}

function variableDeclaratorToView(exp) {
    buildRow(exp.loc.start.line, 'variable declaration', parsedCodeToView(exp.id), '', '');
}

function whileStatementToView(exp) {
    const condition = buildRow(exp.loc.start.line, 'while statement', '', parsedCodeToView(exp.test), '');
    const body = parsedCodeToView(exp.body);
    return condition + body;
}

function buildRow(line, type, name, condition, value) {
    return '<tr>\n<td>\n' + line + '\n</td>\n' +
        '<td>\n' + type + '\n</td>\n' +
        '<td>\n' + name + '\n</td>\n' +
        '<td>\n' + condition + '\n</td>\n' +
        '<td>\n' + value + '\n</td>\n</tr>\n';
}

function generateView(parsedCode) {
    let firstRow = buildRow('Line', 'Type', 'Name', 'Condition', 'Value');
    let view = parsedCodeToView(parsedCode);
    return firstRow + view;
}

export {generateView};


