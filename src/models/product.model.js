'use strict'

const {model, Schema} = require('mongoose');
const { schema } = require('./shop.model');
const e = require('express');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name:{type:String,required:true},
    product_thumbnail:{type:String,required:true},
    product_description:{type:String},
    product_price:{type:Number, required:true},
    product_quantity:{type:Number, required:true},
    product_type:{type:String, required:true, enum:['Electronisc','Clothing', 'Funiture', 'Books', 'Others']},
    product_category:{type:String},
    product_shop:{type:Schema.Types.ObjectId, ref:'Shop', required:true},
    product_attributes:{type:schema.Types.Mixed, required:true}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// define the product type = clothing
const clothingSchema = new Schema({
    brand:{type:String, required:true},
    size:{type:String},
    material:{type:String},
    color:{type:String},
}, {
    collection: 'clothes',
    timestamps: true
});

const elactronicSchema = new Schema({
    manufacturer:{type:String, required:true},
    model:{type:String, required:true},
    color:{type:String},
}, {
    collection: 'electronics',
    timestamps: true
});

module.exports = {
    Product: model(DOCUMENT_NAME, productSchema),
    Clothing: model('Clothing', clothingSchema),
    Electronic: model('Electronic', elactronicSchema)
}