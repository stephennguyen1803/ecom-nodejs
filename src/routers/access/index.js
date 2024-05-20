'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const {asyncMiddleware} = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')

// signUp
router.post('/shop/signup', asyncMiddleware(accessController.signUp))
// Login
router.post('/shop/login', asyncMiddleware(accessController.login))

// authentication logout
router.use(authentication)
/// logout
router.post('/shop/logout', asyncMiddleware(accessController.logout));


module.exports = router