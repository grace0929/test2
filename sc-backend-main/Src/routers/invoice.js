const express = require('express')
const auth = require('../middleware/auth')
const { sequelize } = require('../../models')
const initModels = require("../../models/init-models")
const models = initModels(sequelize)
const { Op } = require("sequelize")
const router = new express.Router()

//Create invoice
router.post('/invoice', auth, async (req, res) => {
    try {
        const invoice = await models.Invoice.create(req.body)
        res.status(201).send({ invoice })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Get user's invoices
router.get('/invoice/me', auth, async (req, res) => {
    try {
        if (req.user.role === 'supplier') {
            const invoices = await models.Invoice.findAll({ where: { supplierId: req.user.userId, createdAt: { [Op.gte]: req.user.flow[0].createdAt } } })
            res.send({ invoices })
        } else if (req.user.role === 'retailer') {
            const invoices = await models.Invoice.findAll({ where: { retailerId: req.user.userId, createdAt: { [Op.gte]: req.user.flow[0].createdAt } } })
            res.send({ invoices })
        }
    } catch (e) {
        res.status(400).send(e.message)
    }
})


//Delete user invoices by invoiceId
router.delete('/invoice/me', auth, async (req, res) => {
    try {
        // if (req.user.role === 'supplier') {
        //     const invoices = await models.Invoice.destroy({ where: { supplierId: req.user.userId } })
        //     res.send({ invoices })
        // } else if (req.user.role === 'retailer') {
        //     const invoices = await models.Invoice.destroy({ where: { retailerId: req.user.userId } })
        //     res.send({ invoices })
        // }
        const invoice = await models.Invoice.destroy({ where: { invoiceId: req.body.invoiceId } })
        res.send({ invoice })
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router