'use strict'

const AccessService = require("../services/access.service")
const { OK, CREATED, SuccessResponse } = require("../core/success.response")

class AccessController {

    handleRefreshToken = async(req, res, next) => {
        new SuccessResponse({
            message: "Refresh Token Success!",
            metaData: await AccessService.handleRefreshToken({refreshToken: req.body.refreshToken}),
        }).send({res})
    }

    logout = async(req, res, next) => {
        new SuccessResponse({
            message: "Logout Success!",
            metaData: await AccessService.logout({keyStore: req.keyStore}),
        }).send({res})
    }

    login = async(req, res, next) => {
        new SuccessResponse({
            metaData: await AccessService.login(req.body),
        }).send({res})
    }

    /**
     * Create new Shop
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next 
     * @returns 
     */
    signUp = async(req, res, next) => {
        // try {
        console.log('[P]::signUp::', req.body)
        /**
         * 200 OK
         * 201 CREATED
         */

        new CREATED({
            message: 'Registered OK!',
            metaData: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send({res})
        // return res.status(201).json(await AccessService.signUp(
        //     req.body,
        // ))
        // } catch(error) {
        //     next(error)
        // }
    }
}

module.exports = new AccessController()