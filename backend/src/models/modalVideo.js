const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  titre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
}, {
  tableName: 'videos',
  timestamps: false
});

module.exports = Video;
