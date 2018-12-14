import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {evaluateParams, generateSubstitutedCode, generateRow} from './substitutioner';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let colors = {'red': [], 'green': []};
        let substitutedCode = generateSubstitutedCode(parsedCode, [], colors);
        let substitutedParseCode = parseCode(substitutedCode);

        let parametersToParse = $('#parametersPlaceholder').val();
        let parsedParameters = parseCode(parametersToParse);
        let initParams = evaluateParams(parsedParameters);
        colors = {'red': [], 'green': []};
        let evaluatedCode = generateSubstitutedCode(substitutedParseCode, initParams, colors);
        let substitutedCodeArea = document.getElementById('substitutedCodeArea');
        substitutedCodeArea.innerHTML = '';
        substitutedCode.split('\n').forEach((r,i) => substitutedCodeArea.innerHTML += generateRow(r, i+1, colors));
        $('#parsedCode').val(JSON.stringify(evaluatedCode, null, 2));
    });
});
