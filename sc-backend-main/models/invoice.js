const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('invoice', {
    invoiceId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    retailerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    deliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    payable: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    creditTerms: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    invoiceStatus: {
      type: DataTypes.STRING(40),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'invoice',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "invoiceId" },
        ]
      },
      {
        name: "FK_invoice_retailerId_user",
        using: "BTREE",
        fields: [
          { name: "retailerId" },
        ]
      },
      {
        name: "FK_invoice_supplierId_user",
        using: "BTREE",
        fields: [
          { name: "supplierId" },
        ]
      },
    ]
  });
};
