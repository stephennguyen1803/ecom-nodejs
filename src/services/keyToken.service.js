'use strict'

const { filter, update } = require("lodash")
const keytokenModel = require("../models/keytoken.model")
const {Types} = require('mongoose')

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

   static findByUserId = async (userId) => {
       return await keytokenModel.findOne({user: new Types.ObjectId(userId)}).lean()
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({_id: id})
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken})
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.findOneAndRemove({user: userId})
    }

    static updateKeyToken = async (holderToken, newRefreshToken,  oldRefreshToken) => {
        return await keytokenModel.updateOne(
            { _id:  holderToken._id}, 
            {
                $set: {
                    refreshToken: newRefreshToken                
                },
                $addToSet: {
                    refreshTokensUsed: oldRefreshToken // has been used to create new token
                }
            }
        );
    }
}

module.exports = KeyTokenService