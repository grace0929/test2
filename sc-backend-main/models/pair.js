const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('pair', {
    pairId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    retailerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    currentTime: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      // defaultValue: Sequelize.Sequelize.fn('curdate')
    },
    ranking: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    creditLine: {
      type: DataTypes.STRING(40),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pair',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pairId" },
        ]
      },
      {
        name: "FK_pair_retailerId_user",
        using: "BTREE",
        fields: [
          { name: "retailerId" },
        ]
      },
      {
        name: "FK_pair_supplierId_user",
        using: "BTREE",
        fields: [
          { name: "supplierId" },
        ]
      },
    ]
  });
};
