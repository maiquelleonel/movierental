/* istanbul ignore file */
'use strict'
module.exports = (sequelize, DataTypes) => {
    const rents = sequelize.define('rents', {
        id: {primaryKey: true, type: DataTypes.INTEGER(11).UNSIGNED},
        user_id: DataTypes.INTEGER(11).UNSIGNED,
        movie_id: DataTypes.INTEGER(11).UNSIGNED,
        returned_at: DataTypes.DATE
    }, {
        underscored: true,
    });
    rents.associate = function(models) {
        // associations can be defined here
    }
    return rents
}
