require('dotenv').config();
const Sequilize = require('sequelize');

module.exports = new Sequilize('node_db', 'postgres', process.env.PASS, {
  host: process.env.POSTGRES_HOST,
  dialect: 'postgres',
  operatorsAliases: 0,
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 10000
  }
});