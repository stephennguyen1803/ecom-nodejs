require('dotenv').config()
const express = require('express')
const app = express()


const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')


//--------- init middlewares
app.use(morgan("dev")) // morgan("combined") -> nen su dung o mode PRODUCTION / morgan("common") thong bao thieu thong tin / morgan("short") / morgan("tiny")
app.use(helmet()) // bao ve thong tin rieng tu
app.use(compression()) //giam tai băng thông
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
//--------- init database
require('./db/init.mongodb')
const { checkOverLoad } = require('./helper/check.connect')
checkOverLoad()

//--------- init router
app.use('',require('./routers/index'))

//--------- handling errors

module.exports = app