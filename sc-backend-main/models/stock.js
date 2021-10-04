const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock', {
    stockId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    stockName: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    sharePrice: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    expectedReturn: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    riskFactor: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'stock',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "stockId" },
        ]
      },
    ]
  });
};
