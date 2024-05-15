'use strict'

const shopModel = require("../models/shop.model")
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")

// services
const { findByEmail} = require("./shop.service")

const RoleShop = {
    SHOP: '01', //SHOP
    WRITER: '02',
    EDITOR: '03',
    ADMIN: '04'
}

class AccessService {

    /**
     * 1 - check email exists
     * 2 - match password in db with password in request
     * 3 - create AccessToken, RefreshToken and save
     * 4 - generate tokens
     * 5 - return tokens
     * @param {string} email
     */
    static login = async ({email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({email})
        console.log('Found Shop::', foundShop)
        //1 
        if (!foundShop) {
            throw new BadRequestError('Error: Shop not found with this email.')
        }

        //2
        const match = bycrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailureError('Authenticate error!!!')
        }

        //3 
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')
        //4 generate tokens
        const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)
        console.log(`Created Token Sucess::`, tokens)
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey: publicKey,
            privateKey: privateKey,
            refreshToken: tokens.refreshToken
        })

        return {
            metaData: {
                shop: getInfoData({fields: ['id', 'name', 'email'], object: foundShop}),
                tokens
            }
        }
    }

    //using static method we call it without create instance
    static signUp = async ({name, email, password}) => {
        // try {
            // step 1: check email exists ?? also we use lean() to return plain object.
            const holderShop = await shopModel.findOne({email}).lean()
            if (holderShop) {
                throw new BadRequestError('Error: Shop already registered with this email.')
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
                    throw new BadRequestError('Error: KeyStore not created.')
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

        // } catch(error) {
        //     console.error('Error Sign Up with' , name, email, password)
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService