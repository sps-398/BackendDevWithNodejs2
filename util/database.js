const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', 'root', 'server@Shashank', {
    dialect: 'mysql', host: 'localhost'
});

module.exports = sequelize;