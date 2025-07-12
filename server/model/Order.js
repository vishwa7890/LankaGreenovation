const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  _id: { type: String },  // e.g., "INV-2025-07-001"

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  razorpayOrderId: { type: String },

  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      _id: false
    }
  ],

  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
  totalPrice: { type: Number, required: true },

  productTotal: { type: Number, required: true },
  gst: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  handlingFee: { type: Number, required: true },

  paymentMethod: { type: String, enum: ["COD", "Online"], required: true },
  paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },

  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "User Cancelled"],
    default: "Pending"
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
