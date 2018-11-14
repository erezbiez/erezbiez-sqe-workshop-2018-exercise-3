import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parse(codeToParse,{loc:true});
};

export {parseCode};
