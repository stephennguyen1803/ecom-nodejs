'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helper/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')

//Service 
const {findByUserId} = require('../services/keyToken.service')

const HEADER = {
    APIKEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
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
        3 - verify RefreshToken
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
        throw new NotFoundError('Not Found Key Store')
    }

    //3 Verify RefreshToken
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if (decodeUser.userId !== userId) {
                throw new AuthFailureError('Invalid User Id')
            }
            req.keyStore = keyStore
            req.refreshToken = refreshToken
            req.user = decodeUser
            return next()
        } catch (error) {
            throw error
        }
    }

    //3 Verfiy-token
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailureError('Invalid Access Token')
    }

    try {
        console.log('KeyStore::', keyStore)
        console.log('AccessToken::', accessToken)
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (decodeUser.userId !== userId) {
            throw new AuthFailureError('Invalid User Id')
        }
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error;
    }
})

const verifyToken = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyToken
}