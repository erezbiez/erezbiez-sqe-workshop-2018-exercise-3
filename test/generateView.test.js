import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parsedCodeToTable} from '../src/js/generateView';

describe('The generate view module', () => {
    it('is parsing expressions statement correctly', () => {
        let rowsList = [];
        parsedCodeToTable(parseCode('i=0;'), rowsList);
        var json = [
            {
                'line': 1,
                'type': 'assignment expression',
                'name': 'i',
                'condition': '',
                'value': '0'
            }
        ];
        assert.equal(
            JSON.stringify(rowsList),
            JSON.stringify(json)
        );
    });

});
