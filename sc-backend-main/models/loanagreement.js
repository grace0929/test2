const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('loanagreement', {
    loanAgreementId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    borrowerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    loanType: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    facilityAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    effectiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    maturityDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    loanStatus: {
      type: DataTypes.STRING(40),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'loanagreement',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "loanAgreementId" },
        ]
      },
      {
        name: "FK_loanAgreement_borrowerId_user",
        using: "BTREE",
        fields: [
          { name: "borrowerId" },
        ]
      },
    ]
  });
};
