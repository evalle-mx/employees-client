const express = require('express');
const router = express.Router();

const Empleado = require('../schema/Empleado')

// const utily = require('../util/utilies.js')


//GET (list & read) 
router.get('/', async (req, res) =>{
    //console.log('<empleado.GET>');

    // var empleados = [];
    try{
        if(req.query){            
            let qy= req.query; 
            //console.log(qy);
            
            if(qIsEmpty(qy)){ //List:  {{BaseUrl}}/empleados/
                //todos
                let filter = {};
                // var empleados = []; //TO_findAll
                var empleados = await Empleado.find(filter);
                res.status(200).json(empleados);
            }
            else if(qy.consultar){   //Read:  {{BaseUrl}}/empleados/?consultar=ID
                let idEmp = Number.parseInt(qy.consultar);  // != _id
                //console.log(`Buscar empleado con ID: ${idEmp}`);
                //var empleado = getEmpleadoId(idEmp);// TO_ReadOneByParam
                var empleado = await readOneByParam(idEmp);
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
router.post('/', async (req, res) =>{
    // console.log('<empleado.POST>');  //?insertar=1
    try{
        //CREATE
        if(req.query && !qIsEmpty(req.query) && req.query.insertar){ 
            //check body
            const body = req.body;
            //console.log('body: ', body);
            if(!body.nombre || !body.correo){
                res.status(400).json({error:'Nombre y Correo son requeridos'});
            }else{
                let newEmpleado = await createEmpleado(body); //{id:getID_tmp()};
                //console.log(`Creado`);
                //console.log(newEmpleado);
                if(newEmpleado && newEmpleado._id){
                    res.status(201).json({_id:newEmpleado._id, success:1});    
                }
                else{
                    res.status(500).json(newEmpleado);
                }
            }
            //if(($correo!="")&&($nombre!="")){
        }
        //UPDATE
        else if(req.query && !qIsEmpty(req.query) && req.query.actualizar){ 
            const body = req.body;
            //console.log('body: ', body);
            if(!body.id || !body.nombre || !body.correo){ //|| !body.nombre || !body.correo
                res.status(400).json({error:'ID, Nombre y Correo son requeridos'});
            }else{
                let idEmp = body.id;//console.log(`Buscar empleado ID: ${idEmp}`);

                //let empleado = getEmpleadoId(idEmp);// TO_ReadOneByParam
                var empleado = await readOneByParam(idEmp);
                if(empleado.id){
                    //TO_updateById
                    empleado.nombre=body.nombre;
                    empleado.correo=body.correo;
                   
                    let resp = await empleado.save();
                    // console.log('resp: ', resp);
                    res.status(200).json({success:1});                 
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

//DELETE 
router.delete('/', async(req, res) =>{
    //console.log('<empleado.DELETE>');  //?borrar=ID
    try {
        if(req.query && !qIsEmpty(req.query) && req.query.borrar){ 
            let idEmp= Number.parseInt(req.query.borrar); //not _id
            //console.log(`Buscar empleado ID: ${idEmp}`);

            //let empleado = getEmpleadoId(idEmp);// TO_ReadOne
            var empleado = await readOneByParam(idEmp);
            if(empleado.id){
                //console.log('empleado: ', empleado );
                // //TO_delete By Param
                const result = await empleado.deleteOne({id:idEmp});
                //console.log(result);

                // let resp = {id:idEmp, success:1};
                res.status(200).json({...result, success:1});                 
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
// function getEmpleadoId(idEmp){
//     return  { id:idEmp, nombre:'test', correo:'test@mail.com'};
// }

//Using Mongoose-Schema
async function readOneByParam(idEmp){  //throws error
    //console.log(`<ReadOneByParam> id: ${idEmp}`);
    let empl;
    if(idEmp){
        empl = await Empleado.findOne({id:idEmp});
        if(empl == null){  //means not exists
            empl ={message:'Empleado no Existe', code:404}
        }
    }
    return empl;
}

async function createEmpleado(body){
    const newEmpl = new Empleado({
        //id: getID_tmp(),  /* Id is generated via Trigger */
        nombre: body.nombre,
        correo: body.correo
    })
    const created = await newEmpl.save()
    return created;
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
    return (cDate.getMinutes()*10)+cDate.getSeconds()+1; //15;
}

module.exports = router;