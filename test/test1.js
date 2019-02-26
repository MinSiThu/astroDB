let AstroDB =require('../index');
let config = require('./db.config');

AstroDB.connect('mongodb://localhost/AstroDB');
AstroDB.addAll(config);

let statement = `Admin.GET|where|(DB.username==G.username and DB.age>12 and DB.password<=G.password)|`;

(async function() {
    AstroDB.setGlobalParaemter({username:'test1',password:'test1',age:34});
    let result = await AstroDB.exec(statement);
    console.log(result);
    
})()