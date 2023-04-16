'use strict'

const mongoose = require('mongoose');
const {db: {host, port, name}} = require('../configs/config.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`
console.log(connectString)
const { countConnect } = require('../helper/check.connect')


class Database {
    constructor(){
        this.connect()
    }

    // connect
    connect(type = 'mongodb') {
        if (1 === true) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect( connectString, {
            maxPoolSize: 50
        }).then(_ => {
            countConnect()
            console.log(`Connected Mongodb Success PRO`)
        })
        .catch( err => console.log(`Error Connect!!!`))
    }

    //Ap dung design parten Singleton khi khoi tao connection
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb