'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helper/asyncHandler')
const { AuthFailureError, NotfoundError } = require('../core/error.response')

//Service 
const {findByUserId} = require('../services/keyToken.service')

const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

/* JWT process token pair
const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //access token
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        //refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        //refresh token use to refersh access token when access token expired
        //verify token
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err)
            } else {
                console.log(`decode verify::`, decode)
            }
        })
        return {accessToken, refreshToken}
    } catch (error) {
        return error
    }
}
END JWT process token pair */
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        //refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        //refresh token use to refersh access token when access token expired
        //verify token
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err)
            } else {
                console.log(`decode verify::`, decode)
            }
        })
        return {accessToken, refreshToken}
    } catch (error) {
        return error
    }
}

const authentication = asyncHandler(async (req, res, next) => {

    console.log('Authentication Middleware')
    /*
        1 - Check userId is missing
        2 - get AccesstToken
        3 - verify Token
        4 - check user in database?
        5 - check keyStore with userID ?
        6 - Ok all => return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new AuthFailureError('Invalid Request')
    }

    //2
    const keyStore = await findByUserId(userId)
    if (!keyStore) {
        throw new NotfoundError('Not Found Key Store')
    }

    //3 Verfiy-token
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailureError('Invalid Access Token')
    }

    try {
        console.log('KeyStore::', keyStore)
        console.log('AccessToken::', accessToken)
        const decode = JWT.verify(accessToken, keyStore.publicKey)
        if (decode.userId !== userId) {
            throw new AuthFailureError('Invalid User Id')
        }
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error;
    }
})

module.exports = {
    createTokenPair,
    authentication
}