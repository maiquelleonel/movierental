'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('movies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER(11).UNSIGNED
            },
            title: {
                type: Sequelize.STRING
            },
            director: {
                type: Sequelize.STRING
            },
            copies: {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.INTEGER(3).UNSIGNED
            },
            available: {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.INTEGER(3).UNSIGNED
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('movies');
    }
};
