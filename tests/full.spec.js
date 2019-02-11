'use strict'
const path = require('path')
global.__basedir = path.join(__dirname, '..')
const baseDir = __basedir
const sinon = require('sinon')
const should = require('should')
const md5 = require('md5')
require('dotenv').config()
const services = require(`${baseDir}/services`)
const models = require(`${baseDir}/db/models`)

describe('Movie scenario', () => {
    it('Should return a list of movies', async () => {
        const movies = await services.movies(models).all()
        movies.should.be.Array()
        movies.length.should.be.equal(4)
    })

    it('Should return a movie when search by title with "deadpo"', async () => {
        const movies = await services.movies(models).all('deadpo')
        movies.should.be.Array()
        movies.length.should.be.equals(1)
        movies.pop().title.should.be.equals('Deadpool 2')
    })
})

describe('User scenario', () => {
    let User

    before(async () => {
        await models.sequelize.query('TRUNCATE TABLE users;')
    })

    it('Should not create an user without name', async () => {
        const userData = {
            email: 'foo@test.com',
            password: 123
        }
        try {
            await services.users(models).create(userData)
        } catch (err) {
            err.message.should.be.equals('Nome é obrigatorio!')
        }
    })

    it('Should not create an user without email', async () => {
        const userData = {
            name: 'Johnny Test',
            password: 123
        }
        try {
            await services.users(models).create(userData)
        } catch (err) {
            err.message.should.be.equals('Email é obrigatorio!')
        }
    })

    it('Should not create an user without password', async () => {
        const userData = {
            name: 'Johnny Test',
            email: 'foo@test.com'
        }
        try {
            await services.users(models).create(userData)
        } catch (err) {
            err.message.should.be.equals('Senha é obrigatoria!')
        }
    })

    it('Should not create an user without password too short', async () => {
        const userData = {
            name: 'Johnny Test',
            email: 'foo@test.com',
            password: '123'
        }
        try {
            await services.users(models).create(userData)
        } catch (err) {
            err.message.should.be.equals(
                'Senha muito curta! Informe pelo menos 5 caracteres ;)'
            )
        }
    })

    it('Should create an user', async () => {
        const userData = {
            name: 'Johnny Test',
            email: 'foo@test.com',
            password: '12334'
        }
        const user = await services.users(models).create(userData)
        user.name.should.be.equals(userData.name)
        user.email.should.be.equals(userData.email)
        should(user.password).be.Undefined()
    })

    it('Should not create an user with same email', async () => {
        const userData = {
            name: 'Johnny Test II',
            email: 'foo@test.com',
            password: '123456'
        }
        try {
            await services.users(models).create(userData)
        } catch (err) {
            err.message.should.be.equals('Esse email já foi cadastrado!')
        }
    })
})

describe('Auth scenario', () => {
    let User
    it('Should emit an error if email not founded', async () => {
        const userData = {
            email: 'foolly@test.com',
            password: '12345'
        }
        try {
            await services.auth(models).login(userData)
        } catch (err) {
            err.message.should.be.equals(
                'Usuário não encontrado ou token inválido'
            )
        }
    })

    it('Should emit an error if user founded but password incorrect', async () => {
        const userData = {
            email: 'foo@test.com',
            password: '123345'
        }
        try {
            await services.auth(models).login(userData)
        } catch (err) {
            err.message.should.be.equals(
                'Usuário encontrado, mas a senha é inválida'
            )
        }
    })

    it('Should login', async () => {
        const userData = {
            email: 'foo@test.com',
            password: '12334'
        }
        User = await services.auth(models).login(userData)
        User.token.should.be.String()
        User.is_logged.should.be.True()
    })

    it('Should authorized user by token', async () => {
        let user = await services.auth(models).isAuthorized(User.token)
        user.is_logged.should.be.True()
    })

    it('Should logout', async () => {
        let logout = await services.auth(models).logout(User)
        logout.should.be.True()
    })

    it('Token should be invalidated by logout', async () => {
        try {
            let authorized = await services.auth(models).isAuthorized(User.token)
        } catch(err) {
            err.message.should.be.equals('Token inválido! Usuário não encontrado.')
        }
    })

    it('Should emit an error if token not present', async() => {
        try {
            let authorized = await services.auth(models).isAuthorized()
        } catch(err) {
            err.message.should.be.equals('Token não informado')
        }
    })

    it('Should emit an error if token is invalid', async() => {
        try {
            let token = User.token + 'a'
            let authorized = await services.auth(models).isAuthorized(token)
        } catch(err) {
            err.message.should.be.equals('Signature verification failed')
        }
    })
})

describe('Rent scenario', () => {
    let User
    let AnotherUser

    it('Should login an user', async () => {
        const userData = {
            email: 'foo@test.com',
            password: '12334'
        }
        User = await services.auth(models).login(userData)
        User.token.should.be.String()
    })

    it('User should rent a movie', async () => {
        let movie = await services.movies(models).all('avenger')
        let rentData = {movie_id: movie.pop().id, user_id: User.id}
        const rent = await services.rents(models).rentOut(rentData)
        rent.should.not.be.Null()
    })

    it ('Should emit an error if movie_id is not present', async () => {
        let rentData = {user_id: User.id}
        try {
            await services.rents(models).rentOut(rentData)
        } catch (err) {
            err.message.should.be.equals('É preciso informar um filme!')
        }
    })

    it('User should rent a unknown movie', async () => {
        let rentData = {movie_id: 123, user_id: User.id}
        try {
            await services.rents(models).rentOut(rentData)
        } catch (err) {
            err.message.should.be.equals('Filme não encontrado.')
        }

    })

    it('Should create another user', async () => {
        const anotherData = {
            name: 'johnny test jr.',
            email: 'jjunior@bar.com',
            password: '123jr'
        }
        let user = await services.users(models).create(anotherData)
        user.name.should.be.equals(anotherData.name)
        user.email.should.be.equals(anotherData.email)
    })

    it('Should login another user', async () => {
        const anotherLogin = {
            email: 'jjunior@bar.com',
            password: '123jr'
        }
        AnotherUser = await services.auth(models).login(anotherLogin)
        AnotherUser.token.should.be.String()
    })

    it('Another user should not rent the same movie', async () => {
        let movie = await services.movies(models).all('avengers')
        let rentData = {
            user_id: AnotherUser.id,
            movie_id: movie.pop().id
        }
        try {
            await services.rents(models).rentOut(rentData)
        } catch (err) {
            err.message.should.be.equals('Não é possível alugar esse filme no momento.')
        }
    })

    it('Should emit an error if movie_id is not present', async () => {
        let rentData = {
            user_id: User.id
        }
        try {
            await services.rents(models).returnBack(rentData)
        } catch (err) {
            err.message.should.be.equals('É preciso informar um filme!')
        }
    })

    it('Should return back a movie', async () => {
        let movie = await services.movies(models).all('avengers')
        let rentData = {
            movie_id: movie.pop().id,
            user_id: User.id
        }
        const rent = await services.rents(models).returnBack(rentData)
        rent.should.not.be.Null()
    })

    it('Should not return back a movie without rent before', async () => {
        let movie = await services.movies(models).all('Deadpool')
        let rentData = {
            movie_id: movie.pop().id,
            user_id: User.id
        }

        try {
            await services.rents(models).returnBack(rentData)
        } catch (err) {
            err.message.should.be.equals('O usuário não possui devoluções pendentes.')
        }
    })

    after(async() => {
        await models.sequelize.query('TRUNCATE TABLE movies')
        await models.sequelize.query('TRUNCATE TABLE rents')
        await models.sequelize.query('TRUNCATE TABLE users')
    })
})
