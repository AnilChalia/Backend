const express = require("express")
const {getPurchaseHistory,savePurchase} = require("../controllers/PurchaseController.js")
const {auth ,isStudent} = require("../middlewares/auth.js")

const router = express.Router();

router.get("/Paymenthistory", auth,isStudent,getPurchaseHistory);
router.post("/PaymentsavePurchase", auth,isStudent,savePurchase)

module.exports = router;

