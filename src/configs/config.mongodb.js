'use strict'

//level 0
// const config = {
//     app: {
//         port: 3000
//     },
//     db: {
//         host: '172.22.0.4',
//         port: 27017,
//         name: 'db'
//     }
// }

//level 2
const local = {
    app: {
        port: process.env.LOCAL_APP_PORT || 3052
    },
    db: {
        host: process.env.LOCAL_DB_HOST || 'localhost',
        port: process.env.LOCAL_DB_PORT || 27017,
        name: process.env.LOCAL_DB_NAME || 'shopLocal'
    }
}

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3051
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'shopDev'
    }
}

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3050
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'shopPRO'
    }
}
const config = {local, dev, pro}
const env = process.env.NODE_EVN || 'local'
module.exports = config[env]