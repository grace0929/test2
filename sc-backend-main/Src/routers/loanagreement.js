const express = require('express')
const auth = require('../middleware/auth')
const { sequelize } = require('../../models')
const initModels = require("../../models/init-models")
const models = initModels(sequelize)
const { Op } = require("sequelize")
const router = new express.Router()

// Create loanagreement
router.post('/loangreement', auth, async (req, res) => {
    try {
        let message = ' 借貸成功！'
        if (req.body.loanType === 'normal') {
            let Rating = { "高": 1000000, "中": 500000, "低": 100000 }
            if (req.body.facilityAmount > Rating[req.user.flow[0].creditRating]) {
                req.body.facilityAmount = Rating[req.user.flow[0].creditRating]
                message = '信用不足,批准借貸金額'
            }
        } else if (req.body.loanType === 'financing') {
            const loanagreement = await models.Loanagreement.findOne({ where: { loanAgreementId: req.body.loanAgreementId } })
            if (req.body.facilityAmount > loanagreement.facilityAmount) {
                console.log(loanagreement.facilityAmount)
                req.body.facilityAmount = loanagreement.facilityAmount
                message = '信用不足,批准借貸金額'
            }
            delete req.body.loanAgreementId
            // if (req.body.facilityAmount > req.body.loanagreementFacilityAmount)
            //req.body.facilityAmount = req.body.loanagreementFacilityAmount
            //delete req.body.loanagreementFacilityAmount
        }
        const loanagreement = await models.Loanagreement.create(req.body)
        req.user.flow[0]['cash'] = req.user.flow[0]['cash'] + parseInt(req.body.facilityAmount)
        await req.user.flow[0].save()
        /*another way to update flow
        await models.Flow.increment('cash', { by: parseInt(req.body.facilityAmount), where: { userId: req.body.borrowerId, createdAt: { [Op.gte]: req.user.flow[0].createdAt } } })
        */
        res.status(201).send({ loanagreement, message })
    } catch (e) {
        res.status(400).send(e.message)
    }
})


// Get users's loanagreements
router.get('/loangreement/me', auth, async (req, res) => {
    try {
        if (req.body.loanType === 'normal') {
            const loanagreements = await models.Loanagreement.findAll({ where: { borrowerId: req.user.userId, loanType: req.user.loanType, createdAt: { [Op.gte]: req.user.flow[0].createdAt } } })
            res.send({ loanagreements })
        } else if (req.body.loanType === 'financing') {
            const loanagreements = await models.Loanagreement.findAll({ where: { borrowerId: req.user.userId, loanType: req.user.loanType, createdAt: { [Op.gte]: req.user.flow[0].createdAt } } })
            res.send({ loanagreements })
        } else {
            const loanagreements = await models.Loanagreement.findAll({ where: { borrowerId: req.user.userId, createdAt: { [Op.gte]: req.user.flow[0].createdAt } } })
            res.send({ loanagreements })
        }
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Delete certain loanagreement
router.delete('/loangreement/me', auth, async (req, res) => {
    try {
        const loanagreements = await models.Loanagreement.destroy({ where: { borrowerId: req.user.userId } })
        res.send({ loanagreements })
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router