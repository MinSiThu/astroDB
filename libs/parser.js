let mathjs = require('mathjs');

const syntaxTable = {
    WHERE:'where',
    LIMIT:'limit',
    ORDER:'order',
}
const Prefix = {
    G:"G",
    DB:'DB',
}

function Tokenize(statement){
    let tokens = statement.split('|');
    return tokens;
}

function Header(segment){
    let [collectionName,method] = segment.split('.');
    return {collectionName,method};
}

function Where(conditions){
    return mathjs.parse(conditions);
}

function parsePropertyName(param){
    let [prefix,propertyName] = param.split('.');
        if(prefix != Prefix.G){
            throw new Error(`${param} must has prefix G`);
        }
    return propertyName;
}

function parsePOST(token){
    let params = token.split(',');
    let propertyNames = params.map(param=>{
        return parsePropertyName(param);
    })
    return {propertyNames};
}

function parseOthers(token){
    let Query = {};
    
    let i = 0;
    while(i<token.length){
        switch(token[i]){
            case syntaxTable.WHERE:
                Query.where = Where(token[++i]);
            break;
        }
        i++;
    }
    return {query:Query};
}

function generateAST(token){
    let header = Header(token.shift());
    let body;
    if(header.method == 'POST'){
        body = parsePOST(token.shift());
    }else{
        body = parseOthers(token);
    }
    return {...header,...body};
}

function parse(statement){
    let tokens = Tokenize(statement);
    let AST  = generateAST(tokens);
    return AST;
}

module.exports = {
    parse,
}