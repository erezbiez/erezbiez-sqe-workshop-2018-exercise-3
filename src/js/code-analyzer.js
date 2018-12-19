import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

const parseCodeNoLoc = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};


export {parseCode, parseCodeNoLoc};
