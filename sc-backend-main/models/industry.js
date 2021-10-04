const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('industry', {
    industryId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    leadTime: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    product: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'industry',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "industryId" },
        ]
      },
    ]
  });
};
