const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const corsHandler = (req, res, next) => {
    res.header('X-Requested-With', '*')
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
}

app.use(corsHandler)
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

require('./routes')(express, app)
require('./server')(app)

module.exports = app
