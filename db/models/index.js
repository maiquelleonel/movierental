/* istanbul ignore file */
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
let db = {}
let config = require('../database')

const sequelize = new Sequelize({
    'dialect': 'mysql',
    'host': config[process.env.NODE_ENV].host,
    'port': process.env.DB_PORT,
    'username': config[process.env.NODE_ENV].username,
    'password': config[process.env.NODE_ENV].password,
    'database': config[process.env.NODE_ENV].database,
    'logging': false,
    'multipleStatements': true,
    'connectionLimit': 100
});

db.sequelize = sequelize;

fs.readdirSync(`${__dirname}`)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach((file) => {
        let model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    });


db.Sequelize = Sequelize

module.exports = db
