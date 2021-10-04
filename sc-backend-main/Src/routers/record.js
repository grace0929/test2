const express = require('express')
// code below get models directly from files -> but I wrote some methods in init-models,so get models from init-models instead:)
// const User = require('../../models').user
const auth = require('../middleware/auth')
const { sequelize } = require('../../models')
const initModels = require("../../models/init-models")
const models = initModels(sequelize)
const { Op } = require("sequelize")
const router = new express.Router()






//Create record
router.post('/records', auth, async (req, res) => {
    try {
        const record = await models.Record.create(req.body)
        res.status(201).send({ record })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

//Get all records by userId
router.get('/records/me', auth, async (req, res) => {
    try {
        const records = await models.Record.findAll({
            where: { userId: req.user.userId, createdAt: { [Op.gte]: req.user.flow[0].createdAt } }, order: [['recordDate', 'DESC']],
        })
        res.send({ records })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Get all records 
// router.get('/records/', auth, async (req, res) => {
//     try {
//         const records = await models.Record.findAll({
//             where: { userId: req.user.userId, createdAt: { [Op.gte]: req.user.flow[0].createdAt } }, order: [['recordDate', 'DESC']],
//         })
//         res.send({ records })
//     } catch (e) {
//         res.status(400).send(e.message)
//     }
// })









module.exports = router