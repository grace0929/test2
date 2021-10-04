const jwt = require('jsonwebtoken')
require('dotenv').config()
const { sequelize } = require('../../models')
const initModels = require("../../models/init-models")
const models = initModels(sequelize)
const { Op } = require("sequelize")
//attributes: [[Sequelize.fn('max', Sequelize.col('created_at')), 'max']],group: ['user']
//token authenticate
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (decode.type === "user") {
            const user = await models.User.findOne({
                where: { userId: decode.userId }, include: {
                    order: [['createdAt', 'DESC']],
                    separate: true, // <--- Run separate query
                    limit: 1,
                    association: 'flow',
                }
            })
            // const user = await models.User.findOne({
            //     where: { userId: decode.userId }
            // })
            // console.log(user)
            if (!user) { throw new Error() }
            //pass user property to route
            req.user = user
        } else if (decode.type === "teacher") {
            const teacher = await models.Teacher.findOne({ where: { teacherId: decode.teacherId } })
            if (!teacher) { throw new Error() }
            //pass teacher property to route
            req.teacher = teacher
        }
        //pass token property to route
        req.token = token
        next()
    } catch (e) {

        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth