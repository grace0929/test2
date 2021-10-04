const express = require('express')
// code below get models directly from files -> but I wrote some methods in init-models,so get models from init-models instead:)
// const User = require('../../models').user
const auth = require('../middleware/auth')
const { sequelize } = require('../../models')
const initModels = require("../../models/init-models");
const models = initModels(sequelize);

const router = new express.Router()


//User signup -> Create user
router.post('/users', async (req, res) => {
    try {
        const user = await models.User.create(req.body)
        res.status(201).send({ user })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//User login
router.post('/users/login', async (req, res) => {
    try {
        const user = await models.User.findByCredentials(req.body.email, req.body.password, req.body.classNum, req.body.classroomPassword)
        res.cookie("sid", user.createRefreshToken(), { httpOnly: true })
        res.send({ user, accessToken: user.generateAuthToken() })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)

    }

})
//User logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        res.cookie("sid", '', { httpOnly: true })
        res.send({ accessToken: "" })
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//User info -> Read user
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//User update
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'suppliers', 'classroomId', 'industryId', 'role']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//User delete
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.destroy()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router