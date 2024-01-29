'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const {findById} = require("../services/apikey.service")

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        // Check object Key
        const objectKey = await findById(key)
        if (!objectKey) {
            return res.status(403).json({
                message: 'Forbidden Error Not Found Key'
            })
        }
        req.objectKey = objectKey
        return next()
    } catch (error) {
        return error
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objectKey.permissions) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }

        console.log('Permissions::',req.objectKey.permissions)
        const validPermission = req.objectKey.permissions.includes(permission)
        if(!req.objectKey.permissions) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }

        return next()
    }
}

module.exports = {
    apiKey, permission
}