const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  amount: Number,
  status: String, 
  createdAt: { type: Date, default: Date.now },
});

const Payment  = mongoose.model("Payment",PaymentSchema);

module.exports = Payment;
