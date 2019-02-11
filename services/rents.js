module.exports = (models) => {
    const op = models.sequelize.Op

    const rentOut = async (params) => {
        if (!params.movie_id) {
            throw new Error('É preciso informar um filme!')
        }

        let movie = await models.movies.findOne({
            where: {
                id: {[op.eq]: params.movie_id}
            }
        })

        if (movie) {
            if (movie.available > 0) {
                movie.available = movie.available - 1
                await movie.save()
                const rent = await models.rents.create(params)
                return rent
            } else {
                throw new Error('Não é possível alugar esse filme no momento.')
            }
        } else {
            throw new Error('Filme não encontrado.')
        }
    }

    const returnBack = async (params) => {
        if (!params.movie_id) {
            throw new Error('É preciso informar um filme!')
        }
        const rent = await models.rents.findOne({
            where: {
                user_id: {[op.eq]: params.user_id},
                movie_id: {[op.eq]: params.movie_id}
            }
        })
        if (rent && rent.returned_at === null) {
            let movie = await models.movies.findOne({
                where: {
                    id: {[op.eq]: params.movie_id}
                }
            })
            rent.returned_at = new Date()
            await rent.save()
            let available = movie.available + 1
            /* istanbul ignore else */
            if (available <= movie.copies) {
                movie.available = available
                await movie.save()
                return rent
            }
        } else {
            throw new Error('O usuário não possui devoluções pendentes.')
        }
    }

    return {
        rentOut,
        returnBack
    }
}
