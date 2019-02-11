
module.exports = (app) => {
    const serverPort = process.env.PORT || 3000
    app.listen(serverPort, () => {
        console.info('Server listening on port ' + serverPort)
    })
    return app
}
