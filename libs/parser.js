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
    let tokens = statement.split(' ');
    return tokens;
}

function Header(segment){
    let [collectionName,method] = segment.split('.');
    return {collectionName,method};
}

function Where(conditions){

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