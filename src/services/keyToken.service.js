'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
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
}

module.exports = KeyTokenService