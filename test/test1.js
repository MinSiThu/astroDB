let AstroDB =require('../index');
let config = require('./db.config');

AstroDB.connect('mongodb://localhost/AstroDB');
AstroDB.addAll(config);

let statement = `ADMIN.POST G.username,G.password,G.age`;

(async function() {
    AstroDB.setGlobalParaemter({username:'min si thu',password:'min si thu',age:18});
    let result = await AstroDB.exec(statement);
    console.log(result);
    
})()