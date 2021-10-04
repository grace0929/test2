const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('investment', {
    investmentId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    investorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    stockId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stock',
        key: 'stockId'
      }
    },
    investmentAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    shareAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    investmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'investment',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "investmentId" },
        ]
      },
      {
        name: "FK_investment_investorId_user",
        using: "BTREE",
        fields: [
          { name: "investorId" },
        ]
      },
      {
        name: "FK_investment_stockId_stock",
        using: "BTREE",
        fields: [
          { name: "stockId" },
        ]
      },
    ]
  });
};
