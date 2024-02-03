
/* No se usa todavia */

//-- use 'strict'
function isEmpty(obj) {
    if(!obj){
        return true;
    }
    else if(Array.isArray(obj) && obj.length==0){
        return true;
    }
    else {
        return Object.keys(obj).length === 0
    }
    
}


module.exports = isEmpty;