'use strict'

const baseDir = __basedir; // eslint-disable-line
const services = require(baseDir + '/services/')
const response = require(`${baseDir}/helpers/`)

module.exports = (router) => {
    router.post('/login', async (req, res) => {
        let response
        try {
            const user = await services.auth(models).login(req.body)
            response = await helpers.response.success(user, res)
        } catch (err) {
            response = await helpers.response.error(err, res)
        }
        res.status(response.code)
        res.json(response)
    })

    // POST /signup {name, email, password}
    router.post('/signup', async (req, res) => {
        let response
        try {
            const user = await services.users(models).create(req.body)
            response = await helpers.response.success(user)
        } catch (err) {
            response = await helpers.response.error(err)
        }
        res.status(response.code)
        res.json(response)
    })
    return router
}
