'use strict'
const baseDir = __basedir
const md5 = require('md5')
const jwt = require('jwt-simple')
const secret = 'metalrulethenall'
const algo = 'HS512'

module.exports = (models) => {
    const op = models.sequelize.Op

    const login = async (userInfo) => {
        const user = await _userExists(userInfo)
        return user
    }

    const _userExists = async (userInfo) => {

        const users = await models.users.findAll({
            where: {
                [op.or]: [
                    {email: {[op.eq]: userInfo.email}},
                    {password: {[op.eq]: md5(userInfo.password)}}
                ]
            }
        })

        const user = users.find(u => u.email === userInfo.email)
        if (!user) {
            throw new Error('Usuário não encontrado ou token inválido')
        } else {
            if (user.password !== md5(userInfo.password)) {
                throw new Error('Usuário encontrado, mas a senha é inválida')
            }
            user.is_logged = true
            await user.save()
            user.token = _encode(user)
            delete (user.password)
            return user
        }
    }

    const _decode = (token) => {
        let user = jwt.decode(token, secret, false, algo)
        return user
    }

    const _encode = (data) => {
        delete (data.password)
        return jwt.encode(data, secret, algo)
    }

    const isAuthorized = async (token) => {
        if (!token) {
            throw new Error('Token não informado')
        }

        const user = _decode(token)
        /* istanbul ignore next */
        if (!user) {
            throw new Error('Token inválido')
        }

        const userFromDB = await models.users.findOne({
            where: {
                email:{[op.eq]:user.email},
                is_logged: {[op.eq]: user.is_logged}
            }
        })

        if (!userFromDB) {
            throw new Error('Token inválido! Usuário não encontrado.')
        }
        return userFromDB
    }

    const logout = async (user) => {
        const User = await models.users.findOne({
            where: {id: {[op.eq]: user.id}}
        })
        user.is_logged = false
        await user.save()
        return true
    }

    return {
        login,
        logout,
        isAuthorized
    }
}
