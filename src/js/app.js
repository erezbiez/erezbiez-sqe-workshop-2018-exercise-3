import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {generateSubtitutedCode} from './generateView';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let substitutedCode = generateSubtitutedCode(parsedCode);
        // let table = document.getElementById('viewTable');
        // table.innerHTML = view;
        $('#parsedCode').val(JSON.stringify(substitutedCode, null, 2));
    });
});
