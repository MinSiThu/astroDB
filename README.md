# AstroDB

### MongoDB driver api
![AstroDB Logo](https://github.com/MinSiThu/astroDB/blob/master/logo/logo.png?raw=true "AstroDB")
``` 
AstroDB is command library of mongodb. It reduces time required to build application with mongodb.
```

#### installation
Download the repository and add to your project. index.js file alone is enough to apply AstroDB.
```shell
$:npm install 
```
### It uses config files to build mongo Schema.
#### db.config.js file 

```javascript
module.exports = function(Types){
    return [
        {
            'name':'Admin',
            'schema':{
                username:String,
                password:String,
                age:Number,
            },
            'statics':{
                'searchAndGetUsername':function(query) {
                    return this.where(query).limit(10).select('username');
                },
            },
            'virtuals':{
                'status':function(){
                    return `${this.username} is ${this.age} yrs old.`;
                }
            }
        },
    ]
}
```

#### Yes, we have statics functions and virtuals properties.

### import these files.
#### index.js
```javascript
let AstroDB =require('./AstroDB');
let config = require('./db.config');
```

### In index.js file, write configuration codes.
```javascript
AstroDB.connect('mongodb://localhost/AstroDB');
AstroDB.addAll(config);
```
### Executing a query in **AstroDB** is easy!
```javascript
let result = await AstroDB.exec('Admin','new',{username:'Min Si Thu',password:'Min Si Thu',age:19});

// other queries
await AstroDB.exec('Admin','find',{username:'Min Si Thu'});
await AstroDB.exec('Admin','delete',{username:'Min Si Thu',age:{$gt:15,$lt:20}});
```

#### Other queries
```javascript
deleteMany
deleteOne
find
findById
findByIdAndDelete
findByIdAndRemove
findByIdAndUpdate
findOne
findOneAndDelete
findOneAndRemove
findOneAndUpdate
replaceOne
updateMany
updateOne

limit,select,sort //can be used
```
#### limit,sort,select
```javascript
await AstroDB.exec('Admin','find',{age:{$gt:15}},{limit:10,sort:'-username',select:'username age'});
```

### AstroDB also allows population.
#### Add this config object to your db.config.js
```javascript
 {
            'name':'Post',
            'schema':{
                'author':{type:Types.ObjectId,ref:'Admin'},
                'content':String,
            },
 },
```
#### Add id of Admin when creating a new Post object.
```javascript
await AstroDB.exec('Post','new',{content:'what is Node.js?',author:"5c7829144b4e2d0f9c4afbe5",})
``` 


#### This can be populated as 
```javascript
await DB.exec('Post','find',{content:'what is Node.js?'},{populate:['author']});
```

#### Resulting data is 
```javascript
[ { _id: '5c79664210095423542e27d3',
    content: 'what is java?',
    author:
     { _id: '5c7829144b4e2d0f9c4afbe5',
       username: 'test1',
       password: 'test1',
       age: 34,
       __v: 0 },
    __v: 0 } ]
```

### **AstroDB** allows aggregation framework of MongDB.
**still experimental**
```javascript
await AstroDB.exec('Post','aggregate',[
    {
        $match: {
            created: {$gt: new Date(time)}
            }
        },
        {
            $group: {
                _id: null,
                count: {$sum: 1}
            }
        }
    ]);
``` 

Contact Me @ [Min Si Thu](https://www.facebook.com/profile.php?id=100008064318566 'facebook profile'),
Archimedes557@gmail.com