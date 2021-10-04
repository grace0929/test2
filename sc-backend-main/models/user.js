const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    userId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    industryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'industry',
        key: 'industryId'
      }
    },
    classroomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'classroom',
        key: 'classroomId'
      }
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: "email_UNIQUE"
    },
    paired: {
      type: DataTypes.CHAR(25),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "email_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "FK_user_classroomId_classroom",
        using: "BTREE",
        fields: [
          { name: "classroomId" },
        ]
      },
      {
        name: "FK_user_industryId_industry",
        using: "BTREE",
        fields: [
          { name: "industryId" },
        ]
      },
    ]
  });
};
