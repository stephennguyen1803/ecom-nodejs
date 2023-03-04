'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECOND = 5000
const _MAXCONNECT = 5

// count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections::${numConnection}`)
}

// check overload connect
const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsed = process.memoryUsage().rss;
        // Example maximum number of connection base on number of cores
        const maxConnections = numCores * _MAXCONNECT
        
        console.log(`Active connection:: ${numConnection}`)
        console.log(`Memory usage:: ${memoryUsed / 1024/ 1024} MB`)
        if (numConnection > maxConnections) {
            console.log('Connection overload detected!')
            // notify.send(....)
        }
    }, _SECOND) // Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverLoad
}