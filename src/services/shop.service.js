'use strict'

const shopModel = require("../models/shop.model")

const findByEmail = async ({email, select = {
    id:1, email: 1, password: 2, name: 1, status: 1, roles: 1
}}) => {

    // return await shopModel.findOne({email}, select).lean()
    return await shopModel.findOne({email}).select(select).lean()
}

module.exports = {
    findByEmail
}