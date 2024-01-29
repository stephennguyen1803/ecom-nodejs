'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    /* Function Save Data for JWT process
    static createKeyToken = async ({ userId, publicKey}) => {
        try {
            //const publicKeyString = publicKey.toString()
            console.log(`PublicKey To Save in DB::`,publicKey)
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKey
            })

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    } 
    END Function Save Data for JWT process
    */
    static createKeyToken = async ({userId, publicKey, privateKey}) => {
        try {
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKey,
                privateKey: privateKey
            })
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
   }
}

module.exports = KeyTokenService