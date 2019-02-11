const md5 = require('md5')

module.exports = (models) => {
    const op = models.sequelize.Op

    const create = async (data) => {
        if (!data.name) {
            throw new Error('Nome é obrigatorio!')
        }

        if (!data.email) {
            throw new Error('Email é obrigatorio!')
        }

        if (!data.password) {
            throw new Error('Senha é obrigatoria!')
        } else {
            if (data.password.length < 5) {
                throw new Error('Senha muito curta! Informe pelo menos 5 caracteres ;)')
            } else {
                data.password = md5(data.password)
                const userExists = await models.users.findOne({
                    where: {email:{[op.eq]: data.email}}
                })
                if (userExists) {
                    throw new Error('Esse email já foi cadastrado!')
                } else {
                    await models.users.create(data)
                    const user = await models.users.findOne({
                        where: {
                            email:{[op.eq]: data.email}
                        }
                    })
                    delete user.dataValues.password
                    return user
                }
            }
        }
    }

    return {
        create
    }
}
