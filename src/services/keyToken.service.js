'use strict'

const { filter, update } = require("lodash")
const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    /* Function Save Data for JWT process
    static createKeyToken = async ({ userId, publicKey}) => {
        try {
            //const publicKeyString = publicKey.toString()
            console.log(`PublicKey To Save in DB::`,publicKey)
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    } 
    END Function Save Data for JWT process
    */
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // level 0 - create tokens basicly
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })
            //return tokens ? tokens.publicKey : null

            // level 1 - create tokens with status
            const filter = { user: userId }, update = { 
                publicKey: publicKey, privateKey: privateKey, refreshTokensUsed: [], refreshToken}, 
                options = { new: true, upsert: true }
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
   }
}

module.exports = KeyTokenService