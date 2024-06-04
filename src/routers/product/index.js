'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const {asyncMiddleware} = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')

console.log('Product Router::')
// authentication for product
router.use(authentication)
//console.log('Product Router::',router)
router.post('', asyncMiddleware(productController.createProduct))

module.exports = router