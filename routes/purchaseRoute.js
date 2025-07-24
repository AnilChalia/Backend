const express = require("express")
const {getPurchaseHistory,savePurchase} = require("../controllers/PurchaseController.js")
const {auth ,isStudent} = require("../middlewares/auth.js")

const router = express.Router();

router.get("/history", auth,isStudent,getPurchaseHistory);
router.post("/savePurchase", auth,isStudent,savePurchase)

module.exports = router;

