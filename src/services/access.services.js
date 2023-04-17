'use strict'

const shopModel = require("../models/shop.model")
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const RoleShop = {
    SHOP: '01', //SHOP
    WRITER: '02',
    EDITOR: '03',
    ADMIN: '04'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // step 1: check email exists ??
            
            const hoderShop = await shopModel.findOne({email}).lean()
            if (hoderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered'
                }
            }

            const passwordHash = await bycrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop) {
                // create privateKey, publicKey
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                })
                console.log({privateKey, publicKey}) // save collection KeyStore
            }

        } catch(error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService