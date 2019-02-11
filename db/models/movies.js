/* istanbul ignore file */
'use strict'
module.exports = (sequelize, DataTypes) => {
    const movies = sequelize.define('movies', {
        id: {primaryKey: true, type: DataTypes.INTEGER(11).UNSIGNED},
        title: DataTypes.STRING,
        director: DataTypes.STRING,
        copies: DataTypes.INTEGER(3).UNSIGNED,
        available: DataTypes.INTEGER(3).UNSIGNED
    }, {
        underscored: true,
    })
    movies.associate = function(models) {
        // associations can be defined here
    }
    return movies
}
