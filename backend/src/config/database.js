// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
//     host: 'localhost',
//     dialect: 'mysql',
// });

// module.exports = sequelize;

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    }
);

module.exports = sequelize;
