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
            }
        },

        {
            'name':'Post',
            'schema':{
                'author':{type:Types.ObjectId,ref:'Admin'},
                'content':String,
            },
        },

        {
            'name':'User',
            'schema':{
                username:String,
                password:String,
                typeOfUsage:{
                    type:String,
                    default:'user'   
                },
            },
            'virtuals':{
                'status':function(){
                    return `${this.username} has password ${this.password}`;
                }
            }
        }
    ];
}

  