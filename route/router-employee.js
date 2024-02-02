const express = require('express');
const router = express.Router();

const utily = require('../util/utilies.js')

//GET (list & read) 
router.get('/', (req, res) =>{
    console.log('<empleado.GET>');

    // var empleados = [];
    try{
        if(req.query){            
            let qy= req.query; 
            console.log(qy);
            
            if(qIsEmpty(qy)){ //List:  {{BaseUrl}}/empleados/
                //todos
                var empleados = []; //TO_findAll
                res.status(200).json(empleados);
            }
            else if(qy.consultar){   //Read:  {{BaseUrl}}/empleados/?consultar=ID
                let idEmp = Number.parseInt(qy.consultar);  // != _id
                console.log(`Buscar empleado con ID: ${idEmp}`);
                var empleado = getEmpleadoId(idEmp);// TO_ReadOneByParam
                if(empleado.nombre){
                    res.status(200).json(empleado);                 
                }
                else{//Not Found
                    res.status(404).json({message:'No existe Empleado'});   
                }
            }
            else{
                res.status(400).json({message:'Metodo no definido'});
            }
        }else {
            throw new Error('Operation not defined');
        }
    }catch(e){
        console.error(e);
        res.status(500).json({error:e});
    }
    // res.status(200).json(empleados);
});

//POST: (create & update)
router.post('/', (req, res) =>{
    console.log('<empleado.POST>');  //?insertar=1
    try{
        if(req.query && !qIsEmpty(req.query) && req.query.insertar){ 
            //check body
            const body = req.body;
            console.log('body: ', body);
            if(!body.nombre || !body.correo){
                res.status(400).json({error:'Nombre y Correo son requeridos'});
            }else{
                let newEmpleado = {id:getID_tmp()};
                res.status(201).json(newEmpleado);
            }
            //if(($correo!="")&&($nombre!="")){
        }
        else if(req.query && !qIsEmpty(req.query) && req.query.actualizar){ 
            const body = req.body;
            console.log('body: ', body);
            if(!body.id || !body.nombre || !body.correo){
                res.status(400).json({error:'ID, Nombre y Correo son requeridos'});
            }else{
                let idEmp = body.id;console.log(`Buscar empleado ID: ${idEmp}`);

                let empleado = getEmpleadoId(idEmp);// TO_ReadOneByParam
                if(empleado.nombre){
                    //TO_updateById
                    let resp = {id:idEmp, success:1};
                    res.status(200).json(resp);                 
                }
                else{//Not Found
                    res.status(404).json({message:'No existe Empleado'});   
                }
            }
        }
        else {
            throw new Error('Operation not defined');
        }
    }catch(e){
        console.error(e);
        res.status(500).json({error:e});
    }

});
router.delete('/', (req, res) =>{
    console.log('<empleado.DELETE>');  //?borrar=ID
    try {
        if(req.query && !qIsEmpty(req.query) && req.query.borrar){ 
            let idEmp= Number.parseInt(req.query.borrar); //not _id
            console.log(`Buscar empleado ID: ${idEmp}`);

            let empleado = getEmpleadoId(idEmp);// TO_ReadOne
            if(empleado.nombre){
                //TO_delete By Param
                let resp = {id:idEmp, success:1};
                res.status(200).json(resp);                 
            }
            else{//Not Found
                res.status(404).json({message:'No existe Empleado'});   
            }
        }
        else {
            throw new Error('Operation not defined');
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({error:e});
    }

});


//DUMMY
function getEmpleadoId(idEmp){
    return  { id:idEmp, nombre:'test', correo:'test@mail.com'};
}


// AUXILIARES
function qIsEmpty(obj) {
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

function getID_tmp(){
    const cDate = new Date();
    return cDate.getSeconds()+1; //15;
}

module.exports = router;