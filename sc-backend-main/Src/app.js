const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const { sequelize } = require('../models')
const initModels = require("../models/init-models")
const models = initModels(sequelize)
const user = require('./routers/user')
const flow = require('./routers/flow')
const teacher = require('./routers/teacher')
const invoice = require('./routers/invoice')
const loanagreement = require('./routers/loanagreement')
const investment = require('./routers/investment')
const record = require('./routers/record')
const pair = require('./routers/pair')
// const auth = require('./middleware/auth')
const port = process.env.PORT || 3300
const app = express()
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})
require('dotenv').config()


io.on('connection', (socket) => {
    console.log('New websocket connection', socket.id)
    socket.on('match', async (userId, role, classroomId) => {
        let roles = { 'retailer': 'supplier', 'supplier': 'retailer' }
        socket.userId = userId
        room = role + classroomId
        otherroom = roles[role] + classroomId
        socket.join(room)
        let wait = ms => new Promise(resolve => setTimeout(resolve, ms))
        for (let i = 0; i < 60; ++i) {
            //matching timeout 5 mins
            if (socket.rooms.has(room)) {
                const sockets = await io.in(otherroom).fetchSockets()
                if (sockets.length > 0 && io.sockets.sockets.get(sockets[0].id).rooms.has(otherroom)) {
                    const teammate = io.sockets.sockets.get(sockets[0].id)
                    console.log(teammate.userId)
                    console.log(room, otherroom)
                    socket.leave(room)
                    teammate.leave(otherroom)
                    if (role == 'supplier') {
                        const pair = await models.Pair.create({ supplierId: userId, retailerId: teammate.userId, currentTime: new Date().toISOString().slice(0, 10) })
                        io.to(teammate.id).to(socket.id).emit('match-success', pair)
                        console.log('s', pair)
                        break
                    } else {
                        const pair = await models.Pair.create({ supplierId: teammate.userId, retailerId: userId, currentTime: new Date().toISOString().slice(0, 10) })
                        io.to(teammate.id).to(socket.id).emit('match-success', pair)
                        console.log('r', pair)
                        break
                    }
                }
                console.log(socket.id, i)
                //if no match, rematch every 5 seconds
                await wait(5000)
            } else {
                break
            }
        }
    })
    //join room by pairId or class+classroomId
    socket.on('join', (room) => {
        console.log('join' + room)
        socket.join(room)
    })
    //leave room
    socket.on('leave', (room, callback) => {
        socket.leave(room)
        callback()
    })
    socket.on('sendInvoiceSupplier', (invoice, pairId) => {
        io.to(pairId).emit('invoice-retailer', invoice)
        // console.log(invoice)
    })
    socket.on('sendInvoiceRetailer', (invoice, pairId) => {
        io.to(pairId).emit('invoice-supplier', invoice)
        // console.log(invoice)
    })
    socket.on('sendMessage', (message, pairId) => {
        io.to(pairId).emit('message', message)
        // console.log(message)
    })
    socket.on('disconnect', () => {
        //client has already been disconnected,so use io
        console.log("left")
        io.emit('message', 'A user has left!')
    })
})

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use(user)
app.use(flow)
app.use(teacher)
app.use(invoice)
app.use(loanagreement)
app.use(investment)
app.use(record)
app.use(pair)
app.get('/', (req, res) => {
    res.send('hey yall welcome to sc-backend')
})
app.post('/refresh_token', async (req, res) => {
    const refreshToken = req.cookies.sid
    if (!refreshToken) {
        return res.send({ accessToken: "" })
    }
    try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await models.User.findOne({ where: { userId: decode.userId } })
        if (!user) {
            throw new Error
        }
        res.cookie("sid", user.createRefreshToken(), { httpOnly: true })
        res.send({ accessToken: user.generateAuthToken() })
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})
app.post('/teacher_refresh_token', async (req, res) => {
    const refreshToken = req.cookies.sid
    // console.log(req.cookies)
    // res.clearCookie('tid', { path: '/teacher_refresh_token' })
    if (!refreshToken) {
        return res.send({ accessToken: "" })
    }
    try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const teacher = await models.Teacher.findOne({ where: { teacherId: decode.teacherId } })
        if (!teacher) {
            throw new Error
        }
        res.cookie("sid", teacher.createRefreshToken(), { httpOnly: true })
        res.send({ accessToken: teacher.generateAuthToken() })
    } catch (e) {
        res.cookie("sid", '', { httpOnly: true })
        res.status(400).send(e.message)
    }
})

httpServer.listen(port, async () => {
    console.log(`Server is up on port ${port} ٩(๑❛ᴗ❛๑)۶ ( °∀。) (๑•̀ω•́)ノ`)
    // sync database -> use it to sync datebase with models ->create table if new one exist
    // await sequelize.sync({})
    // console.log('Database synced!')
})

