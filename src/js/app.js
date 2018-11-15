import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {generateTable} from './generateView';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let view = generateTable(parsedCode);
        let table = document.getElementById('viewTable');
        table.innerHTML = view;
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});
