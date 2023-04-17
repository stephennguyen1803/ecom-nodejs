'use strict'

const {model, Schema, Types} = required('mongoose')

const DOCUMENT_NAME = 'shop'
const COLLECTION_NAME = 'Shops'

//!dmbg


// Declare the Schema of the Mongo model
var shoopSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum: ['active','inactive'],
        default: 'inactive'
    },
    verify:{
        type:Schema.Types.Boolean,
        default: false
    },
    roles:{
        type: Array,
        default: []
    }
},{
    timestamps:true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);