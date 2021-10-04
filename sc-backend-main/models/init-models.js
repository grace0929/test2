var DataTypes = require("sequelize").DataTypes
const bcrpyt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
var _user = require("./user")
var _teacher = require("./teacher")
var _classroom = require("./classroom")
var _flow = require("./flow")
var _historicalorder = require("./historicalorder")
var _investment = require("./investment")
var _industry = require("./industry")
var _invoice = require("./invoice")
var _loanagreement = require("./loanagreement")
var _pair = require("./pair")
var _record = require("./record")
var _stock = require("./stock")



function initModels(sequelize) {
  var User = _user(sequelize, DataTypes)
  var Teacher = _teacher(sequelize, DataTypes)
  var Classroom = _classroom(sequelize, DataTypes)
  var Flow = _flow(sequelize, DataTypes)
  var Historicalorder = _historicalorder(sequelize, DataTypes)
  var Investment = _investment(sequelize, DataTypes)
  var Industry = _industry(sequelize, DataTypes)
  var Invoice = _invoice(sequelize, DataTypes)
  var Loanagreement = _loanagreement(sequelize, DataTypes)
  var Pair = _pair(sequelize, DataTypes)
  var Record = _record(sequelize, DataTypes)
  var Stock = _stock(sequelize, DataTypes)

  User.belongsTo(Classroom, { as: "classroom", foreignKey: "classroomId" })
  Classroom.hasMany(User, { as: "user", foreignKey: "classroomId" })
  User.belongsTo(Industry, { as: "industry", foreignKey: "industryId" })
  Industry.hasMany(User, { as: "user", foreignKey: "industryId" })
  Loanagreement.belongsTo(User, { as: "user", foreignKey: 'borrowerId' })
  Pair.belongsTo(User, { as: "user", foreignKey: 'retailerId' })
  Pair.belongsTo(User, { as: "user2", foreignKey: 'supplierId' })
  User.hasMany(Pair, { as: "pair", foreignKey: 'retailerId' })
  User.hasMany(Pair, { as: "pair2", foreignKey: 'supplierId' })
  User.hasMany(Loanagreement, { as: "loanagreement", foreignKey: 'borrowerId' })
  Flow.belongsTo(User, { as: "user", foreignKey: 'userId' })
  User.hasMany(Flow, { as: "flow", foreignKey: 'userId' })
  Investment.belongsTo(Stock, { as: "stock", foreignKey: "stockId" })
  Stock.hasMany(Investment, { as: "investment", foreignKey: "stockId" })
  //Hash password before using squelize save()
  User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      user.password = await bcrpyt.hash(user.password, 8)
    }
  })
  Teacher.beforeSave(async (teacher, options) => {
    if (teacher.changed('password')) {
      teacher.password = await bcrpyt.hash(teacher.password, 8)
    }
  })
  //Check user creditRating before creating a loanagreement
  // Loanagreement.beforeSave(async (loanagreement, options) => {
  // if (teacher.changed('password')) {
  //   teacher.password = await bcrpyt.hash(teacher.password, 8)
  // }
  // if (loanagreement.) {

  // }
  // })
  //check if email, password and classroom match in database
  User.findByCredentials = async (email, password, classNum, classroomPassword) => {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw new Error('Unable to login')
    }
    const isMatch = await bcrpyt.compare(password, user.password)
    const classroom = await Classroom.findOne({ where: { classNum, classroomPassword } })
    if (!isMatch || !classroom) {
      throw new Error('Unable to login')
    }
    user.classroomId = classroom.classroomId
    await user.save()
    return user
  }
  //check if email, password match in database
  Teacher.findByCredentials = async (email, password) => {
    const teacher = await Teacher.findOne({ where: { email } })
    if (!teacher) {
      throw new Error('Unable to login')
    }
    const isMatch = await bcrpyt.compare(password, teacher.password)
    if (!isMatch) {
      throw new Error('Unable to login')
    }
    return teacher
  }
  // Generate a jwt for user (Adding an instance level methods.)
  User.prototype.generateAuthToken = function () {
    const user = this
    const token = jwt.sign({ userId: user.userId, type: "user" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
    return token
  }
  // Generate a jwt for teacher (Adding an instance level methods.)
  Teacher.prototype.generateAuthToken = function () {
    const teacher = this
    const token = jwt.sign({ teacherId: teacher.teacherId, type: "teacher" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
    return token
  }
  // Generate a jwt for user (Adding an instance level methods.)
  User.prototype.createRefreshToken = function () {
    const user = this
    const token = jwt.sign({ userId: user.userId, type: "user" }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
    return token
  }
  // Generate a jwt for teacher (Adding an instance level methods.)
  Teacher.prototype.createRefreshToken = function () {
    const teacher = this
    const token = jwt.sign({ teacherId: teacher.teacherId, type: "teacher" }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
    return token
  }
  //Object with just user data
  User.prototype.toJSON = function () {
    var values = Object.assign({}, this.get())
    //to not to expose password to client
    delete values.password
    return values
  }
  //Object with just user data
  Teacher.prototype.toJSON = function () {
    var values = Object.assign({}, this.get())
    //to not to expose password to client
    delete values.password
    return values
  }

  return {
    User,
    Teacher,
    Classroom,
    Flow,
    Historicalorder,
    Industry,
    Investment,
    Invoice,
    Loanagreement,
    Pair,
    Record,
    Stock,
  }
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels
