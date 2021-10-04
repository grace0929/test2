// const db = require("../database/db");
// var express = require("express");
// const cors = require("cors");
// const { json } = require("body-parser");
// const { randomBytes } = require("node:crypto");
// var router = express.Router();
// router.use(cors());
// router.use(express.json());

const express = require('express')
// code below get models directly from files -> but I wrote some methods in init-models,so get models from init-models instead:)
// const User = require('../../models').user
const auth = require('../middleware/auth')
const { sequelize } = require('../../models')
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const { Op } = require("sequelize")
const router = new express.Router()


//Create stock
router.post('/stocks', auth, async (req, res) => {
    try {
        const stock = await models.Stock.create(req.body)
        res.status(201).send({ stock })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Get  all stocks
router.get('/stocks', auth, async (req, res) => {
    try {
        const stocks = await models.Stock.findAll()
        res.send({ stocks })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Create investment or update
router.post('/investments', auth, async (req, res) => {
    try {
        //update cash flow  
        console.log(typeof (req.body['investmentAmount']), typeof (req.body.shareAmount), typeof (req.body.investmentAmount))
        req.user.flow[0]['cash'] = req.user.flow[0]['cash'] - req.body['investmentAmount']
        const investment = await models.Investment.findOne({
            where: { investorId: req.user.userId, stockId: req.body.stockId, investmentDate: { [Op.gte]: req.user.flow[0].createdAt } }, shareAmount: { [Op.gte]: 1 }, include: {
                association: 'stock',
            }, order: [['createdAt', 'DESC']],
        })
        if (!investment) {
            result = await Promise.all([models.Investment.create(req.body), req.user.flow[0].save()])
            const investment = result[0]
            return res.status(201).send({ investment })
        }
        investment.shareAmount += parseInt(req.body.shareAmount)
        investment.investmentAmount += parseInt(req.body.investmentAmount)
        result = await Promise.all([investment.save(), req.user.flow[0].save()])
        res.status(200).send({ investment })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

//Update certain investment and update user cash flow (sell user's stock)
router.patch('/investments/me', auth, async (req, res) => {
    try {
        // let expectedMin = req.body.expectedReturn * (1 - req.body.riskFactor)
        // let expectedMax = req.body.expectedReturn * (1 + req.body.riskFactor)
        // const expectedReturn = getRandom(expectedMin, expectedMax)
        console.log(typeof (req.body['investmentAmount']), typeof (req.body.shareAmount), typeof (req.body.investmentAmount))

        // const sellreturn = req.body.shareAmount * expectedReturn
        // req.user.flow[0]['cash'] = req.user.flow[0]['cash'] + sellreturn
        req.user.flow[0]['cash'] = req.user.flow[0]['cash'] + req.body['sellPrice']
        result = await Promise.all([models.Investment.update({ shareAmount: req.body.lastShareAmount, investmentAmount: req.body.lastAmount }, { where: { investmentId: req.body.investmentId } }), req.user.flow[0].save()])
        res.status(200).send()
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})
//Get user's investment
router.get('/investments/me', auth, async (req, res) => {
    try {
        const investments = await models.Investment.findAll({
            where: { investorId: req.user.userId, investmentDate: { [Op.gte]: req.user.flow[0].createdAt }, shareAmount: { [Op.gte]: 1 } }, include: {
                association: 'stock',
            }, order: [['createdAt', 'DESC']],
        })
        //way 2: order by updatedAt
        // const investments = await models.Investment.findAll({
        //     where: { investorId: req.user.userId, investmentDate: { [Op.gte]: req.user.flow[0].createdAt } }, include: {
        //         association: 'stock',
        //     }, order: [['updatedAt', 'DESC']],
        // })
        res.send({ investments })
    } catch (e) {
        res.status(400).send(e.message)
    }
})


//Delete certain investment and update user cash flow (sell user's stock)
router.delete('/investments/me', auth, async (req, res) => {
    try {
        //賣出我的股票,隨機風險因子，會生出獲/損益   ***須加時間
        // let expectedMin = req.body.expectedReturn * (1 - req.body.riskFactor)
        // let expectedMax = req.body.expectedReturn * (1 + req.body.riskFactor)
        // const expectedReturn = getRandom(expectedMin, expectedMax)
        const sellreturn = req.body.shareAmount * expectedReturn
        req.user.flow[0]['cash'] = req.user.flow[0]['cash'] + sellreturn
        console.log('this is ', sellreturn)
        await req.user.flow[0].save()
        const investment = await models.Investment.destroy({ where: { investmentId: req.body.investmentId } })
        res.send({ investment })
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

// 呈現所有投資選項
// const findstock = "Select * From stock";
// router.post('/allstocks', async (req, res) => {
//     await db.query(findstock, (err, result) => {
//         if (err) throw err;
//         let stockId = [];
//         let stockName = [];
//         let sharePrice = [];
//         let expectedReturn = [];
//         let riskFactor = [];

//         for (let i = 0; i < result.length; i++) {
//             stockId.push(result[i].stockId);
//             stockName.push(result[i].stockName);
//             sharePrice.push(result[i].sharePrice);
//             expectedReturn.push(result[i].expectedReturn);
//             riskFactor.push(result[i].riskFactor);
//         }

//         res.status(200).json({
//             stockId: stockId,
//             stockName: stockName,
//             sharePrice: sharePrice,
//             expectedReturn: expectedReturn,
//             riskFactor: riskFactor,
//         });

//     });
// });



// const addstock = "INSERT INTO investment (investment , investorId , stockId , investmentAmount , shareAmount,investmentDate) VALUES (?);";
// const enteramount = "Select * From stock Where stockId=?";

// //點擊add,進入股票確認投資畫面,輸入買進股數，自動跑出價錢
// router.post('/enteramount', async (req, res) => {
//     await db.query(enteramount, [req.body.stockId], (err, result) => {
//         const price = result.sharePrice;
//         const totalamount = req.body.amount * price;

//         res.status(200).json({
//             sharePrice: sharePrice,
//             totalamount: totalamount,
//         });
//     })
// })


// //投資成功
// router.post('/add', async (req, res) => {
//     await db.query(addstock, [req.body.investment, req.body.investorId, req.body.stockId, req.body.investmentAmount, req.body.shareAmount, req.body.investmentDate],
//         (err, result) => {
//             console.log(req.body.values);
//             if (err) throw err;
//             res.json("投資成功!");

//         });
// });





// //呈現我的投資  ***須加時間
// const showmine = "Select * From investment WHERE stockId = ? And investmentDate = (SELECT MAX(investmentDate) FROM investment);";
// router.post('/showmine', async (req, res) => {
//     await db.query(showmine, (err, result) => {
//         if (err) throw err;
//         let investment = [];
//         let investorId = [];
//         let stockId = [];
//         let investmentAmount = [];
//         let shareAmount = [];
//         let investmentDate = [];

//         for (let i = 0; i < result.length; i++) {
//             investment.push(result[i].investment);
//             investorId.push(result[i].investorId);
//             stockId.push(result[i].stockId);
//             investmentAmount.push(result[i].investmentAmount);
//             shareAmount.push(result[i].shareAmount);
//             investmentDate.push(result[i].investmentDate);
//         }

//         res.status(200).json({
//             investment: investment,
//             investorId: investorId,
//             stockId: stockId,
//             investmentAmount: investmentAmount,
//             shareAmount: shareAmount,
//             investmentDate: investmentDate,
//         });

//     });
// });


//產生min到max之間的亂數
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//賣出我的股票,隨機風險因子，會生出獲/損益   ***須加時間
// const moneyin = "Update flow Set cash =? Where userId = ?";
// const sellshare = "Delete From investment Where stockId = ?";
// router.post('/sell', async (req, res) => {
//     const investment = await models.investment.findall({ where: { investorId: req.body.investorId, stockId: req.body.stockId } });
//     const stock = await models.stock.findall({ where: { stockId: req.body.stockId } });
//     const flow = await models.flow.findall({ where: { userId: req.body.userId } });

//     let expectedMin = stock.expectedReturn - stock.riskFactor;
//     let expectedMax = stock.expectedReturn - stock.riskFactor;
//     const expectedReturn = getRandom(expectedMin, expectedMax);

//     const sellreturn = stock.sharePrice * investment.shareAmount * expectedReturn;
//     const cash = flow.cash + sellreturn;

//     await db.query(moneyin, [cash], [req.body.userId], (err, result) => {
//         if (err) throw err;
//     })

//     await db.query(sellshare, [req.body.stockId], (err, result1) => {
//         if (err) throw err;
//         console.log("股票已賣出!");
//     })

// })
module.exports = router




