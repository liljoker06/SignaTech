const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prediction = sequelize.define('Prediction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  image_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'images',
      key: 'id'
    }
  },
  model_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'models',
      key: 'id'
    }
  },
  predicted_class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id'
    }
  },
  confidence_score: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  predicted_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'predictions',
  timestamps: false
});

module.exports = Prediction;
