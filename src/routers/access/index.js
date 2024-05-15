'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const {asyncMiddleware} = require('../../auth/checkAuth')

// signUp
router.post('/shop/signup', asyncMiddleware(accessController.signUp))
// Login
router.post('/shop/login', asyncMiddleware(accessController.login))

module.exports = router