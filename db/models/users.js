/* istanbul ignore file */
'use strict'
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {primaryKey: true, type: DataTypes.INTEGER(11).UNSIGNED},
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        is_logged: DataTypes.BOOLEAN
    }, {
        underscored: true,
    });
    users.associate = function(models) {
        // associations can be defined here
    }
    return users
}
