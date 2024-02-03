const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
// const url = require('url');
// const querystring = require('querystring');

const app = express()

require('dotenv').config()

const routEmpleado = require('./route/router-employee')

mongoose.connect(process.env.ATLAS_URL) 

const db = mongoose.connection

db.on('error', (e) => {
    console.error('\n :::::::::  FAILED TO CONNECT ::::::::: \n');
    console.log( e );
})
db.once('open', () => {
    console.log(`Successfully connected to Mongo`);
    //Detalle opcional:
    let clusterEnv = process.env.ATLAS_URL.includes('mongodb+srv')?'Atlas':process.env.ATLAS_URL.includes('localhost')?'Local':'Server';
    let dbName = process.env.ATLAS_URL.substring( process.env.ATLAS_URL.lastIndexOf('/') + 1, process.env.ATLAS_URL.indexOf('?'));
    console.log(`[${clusterEnv} > ${dbName?dbName:''}] `);
})

app.use( express.json() )
app.use(cors());
app.use('/empleados', routEmpleado)


//Main Root endPoint/Route for testing
app.get('/', function(req, res){
    console.log('<Root.get>');
    console.log('queryParams: ', req.query ); //http://localhost:3000/?QUERY

    let myparam = req.query.myparam;
    let defCode = 500;
    console.log('myparam: ', myparam ); //http://localhost:3000/?myparam=prueba
    if(req.query.code && !isNaN(Number.parseInt(req.query.code))){
        defCode = Number.parseInt(req.query.code)
        console.log(`code ${defCode}`);
    }
    res.status(defCode).json( { message: `${myparam}${defCode1=500?', code: '+defCode:''}` })
})

app.listen(process.env.APP_PORT, ()=>{ 
     console.log(`Server is running on port: ${process.env.APP_PORT}`);
     console.log('Connecting...');
})