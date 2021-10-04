const express = require('express')
// code below get models directly from files -> but I wrote some methods in init-models,so get models from init-models instead:)
// const User = require('../../models').user
const auth = require('../middleware/auth')
const { sequelize } = require('../../models')
const initModels = require("../../models/init-models")
const models = initModels(sequelize)
const { Op } = require("sequelize")
const router = new express.Router()


// Create user flow
router.post('/flows', auth, async (req, res) => {
    try {
        const flow = await models.Flow.create(req.body)
        res.status(201).send({ flow })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Get Current Flow 
router.get('/flows/me', auth, async (req, res) => {
    try {
        res.send({ flow: req.user.flow[0] })
    } catch (e) {
        res.status(400).send(e.message)
    }
})
//Increase or decrease user and teammate's flow cash
router.patch('/flows/cash', auth, async (req, res) => {
    try {
        console.log(req.body.cash, req.user.userId)
        if (!req.body.type) { throw new Error() }
        if (req.body.type === 'payment') {
            //賣方交貨款,credit line,雙方協定好數目,(賣方)可選擇交不交錢,超過額度需要現金交款   ***情境為交錢的前提下
            await Promise.all([models.Flow.decrement('cash', { by: req.body.cash, where: { userId: req.user.userId, createdAt: { [Op.gte]: req.body.pairCreatedAt } } }), models.Flow.increment('cash', { by: req.body.cash, where: { userId: req.body.supplierId, createdAt: { [Op.gte]: req.body.pairCreatedAt } } }), models.Invoice.update({ invoiceStatus: 'paid' }, { where: { invoiceId: req.body.invoiceId } })])
        } else if (req.body.type === 'loanrepayment') {
            //向銀行還款
            await Promise.all([models.Flow.decrement('cash', { by: req.body.cash, where: { userId: req.user.userId, createdAt: { [Op.gte]: req.body.pairCreatedAt } } }), models.Loanagreement.update({ loanStatus: 'paid' }, { where: { loanAgreementId: req.body.loanAgreementId } })])
        } else if (req.body.type === 'sellproduct') {
            //販賣商品
            await models.Flow.increment('cash', { by: req.body.cash, where: { userId: req.user.userId, createdAt: { [Op.gte]: req.body.pairCreatedAt } } })
        }
        res.status(200).send()
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})
//Flow update
router.patch('/flows/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['creditRating', 'cash', 'inventory', 'liability']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.user.flow[0][update] = req.body[update])
        await req.user.flow[0].save()
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
module.exports = router