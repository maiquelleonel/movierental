'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('movies', [
            {title: "Ninphomanic", director: "Lars Von Trier", copies: 3, available: 3},
            {title: "Deadpool 2", director: "David Leitch", copies: 2, available: 3},
            {title: "Interstellar", director: "Christopher Nolan", copies: 2, available: 2},
            {
                title: "Avengers: Infinity War",
                director: "Anthony Russo, Joe Russo",
                copies: 1,
                available: 1
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('movies', null, {});
    }
};
