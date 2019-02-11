module.exports = (express, app) => {
    const router = express.Router()
    app.use('/movierental/', require('./openRoutes.js')(router))
    app.use('/movierental/', require('./authRoutes.js')(router))
    return app
}
