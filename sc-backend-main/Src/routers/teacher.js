const express = require('express')
const auth = require('../middleware/auth')
const { sequelize } = require('../../models')
const initModels = require("../../models/init-models");
const models = initModels(sequelize);

const router = new express.Router()


//Teacher signup -> Create Teacher
router.post('/teachers', async (req, res) => {
    try {
        const teacher = await models.Teacher.create(req.body)
        res.cookie("sid", teacher.createRefreshToken(), { httpOnly: true })
        res.status(201).send({ teacher, accessToken: teacher.generateAuthToken() })
        // const token = await teacher.generateAuthToken()
        // res.status(201).send({ teacher, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})
//Teaher login
router.post('/teachers/login', async (req, res) => {
    try {
        const teacher = await models.Teacher.findByCredentials(req.body.email, req.body.password)
        res.cookie("sid", teacher.createRefreshToken(), { httpOnly: true })
        res.send({ teacher, accessToken: teacher.generateAuthToken() })
    } catch (e) {
        res.status(400).send(e.message)
        console.log(e.message)
    }

})
//Teacher logout
router.post('/teachers/logout', auth, async (req, res) => {
    try {
        res.cookie("sid", "", { httpOnly: true })
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//Teacher info -> Read user
router.get('/teachers/me', auth, async (req, res) => {
    res.send(req.teacher)
})

//Teacher update
router.patch('/teachers/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['account', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.teacher[update] = req.body[update])
        await req.teacher.save()
        res.send(req.teacher)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Teacher delete
router.delete('/teachers/me', auth, async (req, res) => {
    try {
        await req.teacher.destroy()
        res.send(req.teacher)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router