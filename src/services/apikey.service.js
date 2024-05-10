'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')

const findById = async (key) => {

    // create api key for testing
    // const newKey = await apikeyModel.create({
    //     key: crypto.randomBytes(64).toString('hex'),
    //     permissions: ['0000']
    // })
    // console.log(newKey)
    console.log('Key::',key)
    const objKey = await apikeyModel.findOne({key: key, status: true}).lean().exec()
    return objKey
}

module.exports = {
    findById
}