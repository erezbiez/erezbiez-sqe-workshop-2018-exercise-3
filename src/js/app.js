import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {generateGraph, evaluateParams} from './graph-generator';

import Viz from 'viz.js';
import {Module, render} from 'viz.js/full.render.js';

$(document).ready(function () {
    $('#graphCreatorButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let parametersToParse = $('#parametersPlaceholder').val();
        let parsedParameters = parseCode(parametersToParse);
        let initParams = evaluateParams(parsedParameters);

        let dotGraph = generateGraph(parsedCode, initParams);

        let viz = new Viz({ Module, render });
        viz.renderSVGElement(dotGraph)
            .then(function(element) {
                let graphArea = document.getElementById('graphArea');
                graphArea.innerHTML = '';
                graphArea.append(element);
            });
    });
});
