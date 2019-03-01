let AstroDB =require('../index');
let config = require('./db.config');

AstroDB.connect('mongodb://localhost/AstroDB');
AstroDB.addAll(config);

let Query = (DB)=>{
    return DB.exec('Post','find',{content:'what is java?'},{populate:['author']});
}

(async function() {
    let result = await Query(AstroDB);
    console.log(result);
    
})()