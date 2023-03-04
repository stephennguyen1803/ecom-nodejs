const express = require('express')
const app = express()

const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')


//--------- init middlewares
app.use(morgan("dev")) // morgan("combined") -> nen su dung o mode PRODUCTION / morgan("common") thong bao thieu thong tin / morgan("short") / morgan("tiny")
app.use(helmet()) // bao ve thong tin rieng tu
app.use(compression()) //giam tai băng thông
//--------- init database
require('./db/init.mongodb')
const { checkOverLoad } = require('./helper/check.connect')
checkOverLoad()

//--------- init router
app.get('/', (req, res, next) => {
    const strCompress = 'Hello Dev!!!'
    return res.status(500).json({
        message: "welcome dev!!!",
        metadata: strCompress.repeat(10000)
    })
})

//--------- handling errors

module.exports = app