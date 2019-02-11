
module.exports = (models) => {

    const op = models.sequelize.Op

    const all = async (filter) => {
        let conditions = {}
        if (filter) {
            conditions = {
                where: {
                    title: {[op.like]: `%${filter}%`}
                }
            }
        }
        const movies = await models.movies.findAll(conditions)
        return movies
    }

    return {
        all
    }
}
