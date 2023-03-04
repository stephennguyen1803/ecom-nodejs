'use strict'

const mongoose = require('mongoose');

const connectString = `mongodb://172.22.0.4:27017/shopDEV`

mongoose.connect( connectString).then(_ => console.log(`Connected Mongodb Sucess`)).catch( err => console.log(`Error Connect!!!`))

//dev
if (1=== true){
    mongoose.set('debug', true)
    mongoose.set('debug', {color:true})
}

module.exports = mongoose