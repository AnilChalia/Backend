const mongoose = require("mongoose")

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Purchase", purchaseSchema)
