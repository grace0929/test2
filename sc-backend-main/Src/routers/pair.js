const express = require('express')
// code below get models directly from files -> but I wrote some methods in init-models,so get models from init-models instead:)
// const User = require('../../models').user
const auth = require('../middleware/auth')
const { sequelize } = require('../../models')
const initModels = require("../../models/init-models");
const models = initModels(sequelize);

const router = new express.Router()
//User update
router.patch('/pairs/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['pairId', 'supplierId', 'retailerId', 'currentTime', 'ranking', 'creditLine', 'createdAt']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const pair = await models.Pair.findOne({ where: { pairId: req.body.pairId } })
        updates.forEach((update) => pair[update] = req.body[update])
        const test = await pair.save()
        res.send({ test })
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router