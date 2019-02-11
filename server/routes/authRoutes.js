'use strict'
/* eslint-disable */
const baseDir = __basedir
const services = require(`${baseDir}/services`)
const helpers = require(`${baseDir}/helpers`)
const models = require(`${baseDir}/db/models`)

module.exports = (router) => {
    let User
    const authMiddleware = async (req, res, next) => {
        try {
            User = await services.auth(models).isAuthorized(req.headers.authorization)
            next()
        } catch (err) {
            res.status(400)
            res.json(err)
        }
    }
    // GET  /movies [{title, director, copies, available}]
    router.get('/movies', async (req, res) => {
        let response
        try {
            let filter = {}
            if (req.query.title) {
                filter = req.query.title
            }
            const movies = await services.movies(models).all(filter)
            response = helpers.response.success(movies)
        } catch (err) {
            response = helpers.response.error(err)
        }
        res.status(response.code)
        res.json(response)
    })

    router.post('/logout', authMiddleware, async (req, res) => {
        let response
        try {
            await services.auth(models).logoff(User.id)
            response = helpers.response.success(['Obrigado, volte sempre!'])
        } catch (err) {
            response = helpers.response.error(err)
        }
        res.status(response.code)
        res.json(response)
    })
    // POST /rent-out {user_id, movie_id, created_at, returned_at}
    router.post('/rent-out', authMiddleware, async (req, res) => {
        let response
        try {
            let params = {
                movie_id: req.body.movie_id,
                user_id: User.id
            }
            const rent = await services.rents(models).rentOut(params)
            response = helpers.response.success([
                'Filme locado com sucesso. Bom filme!'
            ])
        } catch (err) {
            response = helpers.response.error(err)
        }
        res.status(response.code)
        res.json(response)
    })
    // POST /return-back {movie_id, user_id}
    router.post('/return-back', authMiddleware, async (req, res) => {
        let response
        try {
            let params = {
                movie_id: req.body.movie_id,
                user_id: User.id
            }
            const rent = await services.rents(models).returnBack(params)
            response = helpers.response.success([
                'Filme devolvido com sucesso. Volte sempre!'
            ])
        } catch (err) {
            response = helpers.response.error(err)
        }
        res.status(response.code)
        res.json(response)
    })

    return router
}
