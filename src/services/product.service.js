'use strict'

const {product,clothing, electronic, furniture } = require("../models/product.model")
const {BadRequestError} = require("../core/error.response")

// define factory class to create product

class ProductFactory {

    /**
     * to store product class
     */
    static productRegistry = {}

    static registerProduct(type, productClass) {
        ProductFactory.productRegistry[type] = productClass
    }

    /**
     * 
     * @param {string} type 
     */
    static async createProduct(type, payload) {
        console.log(ProductFactory.productRegistry)
        if (!ProductFactory.productRegistry[type]) {
            throw new BadRequestError(`Invalid product type $(type)`)
        }
        return await new ProductFactory.productRegistry[type](payload).createProduct()
    }
}

// define base product class 
class Product {
    constructor({
        product_name, product_thumbnail, product_description, product_price, product_quantity,
        product_type, product_category, product_shop, product_attributes
    }){
        this.product_name = product_name
        this.product_thumbnail = product_thumbnail
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_category = product_category
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    //create new product
    async createProduct(product_id) {
        return await product.create({...this, _id: product_id})
    }
}

//Define subclass for different product type = clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes, 
            product_shop: this.product_shop
        })
        if (!newClothing) {
            throw new BadRequestError('Cannot create new clothing')
        }

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) {
            throw new BadRequestError('Cannot create new product')
        }
        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) {
            throw new BadRequestError('Cannot create new electronic')
        }
        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) {
            throw new BadRequestError('Cannot create new product')
        }
        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) {
            throw new BadRequestError('Cannot create new furniture')
        }
        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) {
            throw new BadRequestError('Cannot create new product')
        }
        return newProduct;
    }
}

ProductFactory.registerProduct('Clothing', Clothing)
ProductFactory.registerProduct('Electronic', Electronic)
ProductFactory.registerProduct('Furniture', Furniture)
module.exports = ProductFactory;