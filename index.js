let mongoose = require('mongoose');

const functionNames = {
    'NEW':'new',
    'UPDATE':'update',
    'UPDATEMANY':'updateMany',
    'UPDATEONE':'updateOne',
}

let mainCollections = new Map();
let {Schema,model} = mongoose;

// configuration
function connect(url){
    mongoose.connect(url);
}

/**
 * @param {Object} Unloader
 * @return {Object}
 */
function Unloader(configFunc){
    return configFunc(Schema.Types);
}

/**
 * this method add array of Schema to astroDB
 * @param {array} collectionInfos
 * @returns {void} 
 */
function addAll(configFunc){
    let collectionInfos = Unloader(configFunc); 
    collectionInfos.forEach(collectionInfo => {
        add(collectionInfo);
    });
}

/**
 * 
 * @param {String} collectionName 
 * @return {Object}
 */
function get(collectionName) {
    return mainCollections.get(collectionName);    
}

/**
 * this methods add single Schema to astroDB 
 * @param {Object} collectionInfo
 * @returns void 
 */
function add(collectionInfo){
    let collectionSchema = new Schema(collectionInfo.schema);
    if(collectionInfo.statics){
        addStatics(collectionSchema,collectionInfo.statics)
    }
    if(collectionInfo.virtuals){
        addVirtuals(collectionSchema,collectionInfo.virtuals);
    }
    let collectionModel = model(collectionInfo.name,collectionSchema);
    mainCollections.set(collectionInfo.name,{collectionSchema,collectionModel});
}

/**
 * @param {Object,Object} addVirtuals
 * @returns void
 */
function addVirtuals(collectionSchema,virtuals){
    Object.entries(virtuals).forEach(virtual=>{
        let [virtualName,virtualFunction] = virtual;
        collectionSchema.virtual(virtualName).get(virtualFunction);
    });
}

/**
 * @param {Object} statics
 * @returns void 
 */
function addStatics(collectionSchema,statics){
    Object.entries(statics).forEach(staticProperty=>{
        let [staticName,staticFunction] = staticProperty;
        collectionSchema.statics[staticName] = staticFunction;
    }) 
}


/**
 * 
 * @param {String} statement
 * @returns Array 
 */
async function exec(collectionName,functionName,query,extraQuery = {}){
   try{
    let {collectionModel} = mainCollections.get(collectionName);

    switch(functionName){
        case functionNames.NEW:
            let model = new collectionModel(query);
            return await model.save();
        break;

        case functionNames.UPDATE:
        case functionNames.UPDATEMANY:
        case functionNames.UPDATEONE:
            let raw = await collectionModel[functionName](query,extraQuery);
            return raw;
        break;

        default:
            let statement = collectionModel[functionName](query);
            if(extraQuery.limit){ statement.limit(extraQuery.limit)};
            if(extraQuery.select){ statement.select(extraQuery.select)};
            if(extraQuery.sort){ statement.sort(extraQuery.sort)};
            if(extraQuery.populate){
                extraQuery.populate.forEach(extraquery=>statement.populate(extraquery));
            }
            return await statement.exec();
        break;
    }
    return false;
   }catch(e){
       console.log(e);
   }
}


module.exports = {
    connect,
    addAll,
    get,
    exec,
}