const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SchoolLevel = sequelize.define('SchoolLevel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  school_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'schools',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration_months: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'schools_levels',
  timestamps: false,
  getterMethods: {
    schoolId() {
      return this.getDataValue('school_id');
    },
    durationMonths() {
      return this.getDataValue('duration_months');
    }
  }
});

module.exports = SchoolLevel;
