'use strict'

const mongoose = require('mongoose');
const {db: {host, port, name}} = require('../configs/config.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`
const { countConnect } = require('../helper/check.connect')


class Database {
    constructor(){
        this.connect()
    }

    // connect mongodb and set the poolsize - we can check the connection sleep - it that mean we have pool connection
    connect(type = 'mongodb') {
        if (1 === true) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect( connectString, {
            maxPoolSize: 10
        }).then(_ => {
            countConnect()
            console.log(`Connected Mongodb Success !!!`)
        })
        .catch( err => console.log(`Error Connect!!!`,err))
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