// const db = require("../database/db");
// var express = require("express");
// const cors = require("cors");
// const { json } = require("body-parser");
// var router = express.Router();
// router.use(cors());
// router.use(express.json());


//做商品(供應商) =>動畫
// router.post('/doproduct', async (req, res) => {


// })

// //交貨(供應商) =>動畫
// router.post('/producttransfer', async (req, res) => {



// })

// //收貨(賣方) =>動畫
// router.post('/getmoney', async (req, res) => {


// })



//賣商品(賣方),錢增加  
// const data = "";
// const nowmoney = "Select cash From flow Where flowId =?";
// const moneyupdate = "Update flow Set cash =? Where userId = ?";
// router.post('/moneyupdate', async (req, res) => {
//     const data = ''//這裡需要賣出的供需表決定數量售價間的聯繫
//     const moneyadd ;

//     const nowmoney = await models.flow.findOne({ where: { userId: req.body.userId } })
//     const newcash = nowmoney+moneyadd;

//     await db.query(moneyupdate, [req.body.userID],(err, result) => {
//         if (err) throw err;
//             console.log("物品已賣出!");    
//         }) 
//     // req=>找出賣方交易資料(議價裡面說好的數量與價錢，藉此供需找出賣出的錢)
//     //推測 頁面按下(賣出) => 錢匯入賣方戶頭

// })


//賣方交貨款,credit line,雙方協定好數目,(賣方)可選擇交不交錢,超過額度需要現金交款   ***情境為交錢的前提下
// router.post('/getmoney', async (req, res) => {
//     // req => 找出賣方交易資料(議價裡面說好的credit line)
//     const transactiondata = await models.pair.findOne({ where: { pairId: req.body.pairId } })
//     const nowmoney = await models.fiow.findOne({ where: { userId: req.body.userId } })
//         //用if 去看有無超過
//         if(req.body.payable > transaction.creditLine){
//             let payable = req.body.payable - transaction.creditLine;
//             let newmoney = nowmoney - payable;

//             const updateRetailer = "Update flow Set cash =? Where userId = ?" ;
//             await db.query(updateRetailer, [newmoney],[req.body.userId],(err, result) => {
//                 if (err) throw err;
//             })

//         }
//         else {
//             let newmoney = nowmoney - payable;

//             const updateRetailer = "Update flow Set cash =? Where userId = ?" ;
//             await db.query(updateRetailer, [newmoney],[req.body.userId],(err, result) => {
//                 if (err) throw err;
//             })
//         }
// })




