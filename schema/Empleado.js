const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({

    id:{
        type:Number,
        //required:true
    }, 
    nombre:{
        type:String,
        required:true,
        minLength: 10
    },
    correo: {
        type: String, 
        minLength: 10,
        required: true,
        lowercase:true,
    },
    createdAt: {
        type: Date,
        immutable:true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    }

});


//MIDDLEWARE (functionality applied to save, validate & remove )
empleadoSchema.pre('save', function (next) {
    this.updatedAt = Date.now()
    //throw new Error('Simulted fail')
    next()
})
empleadoSchema.post('save', function (doc, next) {
    console.log('Salvado en Persistencia (MongoDB)');
    next()
})
empleadoSchema.post('deleteOne', function (doc, next) {
    console.log('Eliminado de Persistencia (MongoDB)');
    next()
})

module.exports = mongoose.model('Empleado', empleadoSchema);
// 1st Name of the collection, 2nd Mongoose schema
//Mongoose automatically changes this to the plural form, transforms it to lowercase, and uses that for the database collection name.