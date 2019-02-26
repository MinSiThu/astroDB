function build(query){
    query.where.traverse((node, path, parent)=>{
        console.log(node);
        console.log('one node ends here');
        
        
    })
    return false;
}


module.exports = {
    build,
}