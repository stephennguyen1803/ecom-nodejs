'use strict'

const shopModel = require("../models/shop.model")
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")

const RoleShop = {
    SHOP: '01', //SHOP
    WRITER: '02',
    EDITOR: '03',
    ADMIN: '04'
}

class AccessService {
    //using static method we call it without create instance
    static signUp = async ({name, email, password}) => {
        try {
            // step 1: check email exists ?? also we use lean() to return plain object.
            
            const hoderShop = await shopModel.findOne({email}).lean()
            if (hoderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered'
                }
            }
            // step 2: hash password. Limit 10 to hash password
            const passwordHash = await bycrypt.hash(password, 10)
    
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop) {
                /* Processing flowling JWT process */
                // create privateKey, publicKey
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1', //PKCS8
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                // PKSC1 public key cryptographic standard 1
                // PEM Privacy Enhanced Mail
                //console.log({privateKey, publicKey}) // save collection KeyStore
                /* END Processing flowling JWT process */

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                console.log({privateKey, publicKey}) 
                //save publicKey to table Key with userId is shopId
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id, 
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: 'xxxx',
                        message: 'keyStore error'
                    }
                }

                // const publicKeyObject = crypto.createPublicKey(publicKeyString) in here publicKeyString has been change to keyStore

                //created token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, 
                    publicKey,
                    privateKey)
                console.log(`Created Token Sucess::`, tokens)

                return {
                    code: 201,
                    metaData: {
                        shop: getInfoData({fields: ['id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metaData: null
            }

        } catch(error) {
            console.error('Error Sign Up with' , name, email, password)
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService