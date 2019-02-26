let mongoose = require('mongoose');
let parser = require('./libs/parser');
let QueryBuilder = require('./libs/QueryBuilder');

let GlobalParameter = {
    getData:(params)=>{
        let data = {};
        params.forEach(param=>{
            if(GlobalParameter.obj[param] == undefined){
                throw new Error(`${param} is ${GlobalParameter.obj[param]}`);
            }else{
                data[param] = GlobalParameter.obj[param];
            }  
        })
        return data;
    }
};

/**
 * check GlobalParameter has obj property
 * if not throw error 
 */
function checkGlobalObj(){
    if(GlobalParameter.obj == undefined){
        throw new Error(`${GlobalParameter} GlobalParameter`);
    }
}

let mainCollections = new Map();
let {Schema,model} = mongoose;

// configuration
function connect(url){
    mongoose.connect(url);
}

/**
 * this method add array of Schema to astroDB
 * @param {array} collectionInfos
 * @returns void 
 */
function addAll(collectionInfos){
    collectionInfos.forEach(collectionInfo => {
        add(collectionInfo);
    });
}

/**
 * this methods add single Schema to astroDB 
 * @param {Object} collectionInfo
 * @returns void 
 */
function add(collectionInfo){
    let collectionSchema = new Schema(collectionInfo.schema);
    let collectionModel = model(collectionInfo.name,collectionSchema);
    mainCollections.set(collectionInfo.name,{collectionSchema,collectionModel});
}

/**
 * set Global-parameter of the module
 * @param {Object} obj 
 * @returns void 
 */
function setGlobalParaemter(obj){
    GlobalParameter.obj = obj;
}

/**
 * 
 * @param {String} statement
 * @returns Array 
 */
async function exec(statement){
    let commands = parser.parse(statement);
    
    switch(commands.method){
        case 'POST':
            return await POST(commands);
        break;

        case 'GET':
            return await GET(commands);
            break;

        case 'LIST':
            return await LIST(commands);
            break;

        default:
            throw new Error(`${statement} is on wrong syntax`);
        break;
    }
}

// Encapsulated Functions
async function POST(commands){
    checkGlobalObj();
    
    let {collectionModel} = mainCollections.get(commands.collectionName);
    let data = GlobalParameter.getData(commands.propertyNames);
    
    let document = new collectionModel(data);
    let result = await document.save();
    return result;
}

async function GET(commands){
    checkGlobalObj();

    let {collectionModel} = mainCollections.get(commands.collectionName);
    let Query = QueryBuilder.build(commands.query);
   // let data = GlobalParameter.getData(commands.params);

    if(commands.parameterOperator == false){
        return await collectionModel.find(data);
    }
    return false;
}

module.exports = {
    connect,
    setGlobalParaemter,
    addAll,add,
    exec,
}