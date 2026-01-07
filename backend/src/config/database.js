const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('signatech', 'postgres', 'root', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false
});

module.exports = { sequelize };
