const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const Product = require("../model/Product");
const Cart = require('../model/Cart');
const Address = require('../model/Address');
const Order = require('../model/Order');
const verifyUser = require('../middleware/verifyUser');
require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Comment =require("../model/Comment");




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


router.post('/register', async (req, res) => {
  const { username, phone, email } = req.body;
  console.log({username,phone,email});

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "User already exists" });

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

  user = new User({ username, phone, email, otp, otpExpires });
  await user.save();

  
  const mailOptions = {
  from: process.env.EMAIL,
  to: email,
  subject: 'Your OTP Code',
  html: `
    <div style="font-family: Arial, sans-serif; background-color:rgb(255, 255, 255); padding: 30px;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #a5d6a7; padding: 20px; display: flex; align-items: center;">
      <img src="https://yourcompany.com/logo.png" alt="Company Logo" style="width: 60px; height: auto; margin-right: 15px;">
      <h2 style="margin: 0; color: #1b5e20;">Your Company Name</h2>
    </div>
    <div style="padding: 30px; text-align: center;">
      <p style="font-size: 16px; color: #333;">Hello, ${username}</p>
      <p style="font-size: 16px; color: #333;">Your One-Time Password (OTP) is:</p>
      <p style="font-size: 28px; font-weight: bold; color: #1b5e20; margin: 20px 0;">${otp}</p>
      <p style="font-size: 16px; color: #555;">This code is valid for 10 minutes.</p>
      <p style="font-size: 16px; color: #555;">If you didn’t request this code, please ignore this email.</p>
    </div>
    <div style="background-color: #c8e6c9; padding: 15px; text-align: center; font-size: 14px; color: #2e7d32;">
      © ${new Date().getFullYear()} Lanka Greenovation. All rights reserved.
    </div>
  </div>
</div>

  `
};



  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Failed to send OTP" });
      
    }
    res.json({ message: "OTP sent to email" });
  });
});


router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.otp !== otp || new Date() > user.otpExpires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.verified = true;
  user.otp = null; 
  user.otpExpires = null;
  await user.save();

  res.json({ message: "OTP verified. Proceed to set password." });
});


router.post('/set-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    

    const user = await User.findOne({ email, verified: true });

    if (!user) {
      return res.status(400).json({ message: "User not verified or not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isUpdate = !!user.password; // true if password already exists

    user.password = hashedPassword;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: isUpdate ? 'Your Password Was Updated' : 'Your Account Was Created Successfully',
      text: `Hello ${user.username || "User"},\n\nYour password has been ${isUpdate ? 'updated' : 'set successfully'}. You can now log in using your email and password.\n\nThank you!`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Email error:", err);
        return res.status(500).json({ message: "Failed to send confirmation email" });
      }

      res.json({
        message: isUpdate
          ? "Password updated successfully and confirmation email sent"
          : "Password set successfully and confirmation email sent"
      });
    });

  } catch (error) {
    console.error("Set password error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


const SECRET_KEY = process.env.SECRET_KEY;


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
    });

    console.log("User Token Set:", token);
    res.json({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
});


router.get("/dashboard", verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Welcome to the dashboard!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


router.get("/get-product", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "Details fetched successfully",
      products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      message: "Error fetching products",
      error: err.message,
    });
  }
});

router.get("/get-product/:id",async(req,res)=>{
  const {id} = req.params;
  try{
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Details fetched successfully", product });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({
      message: "Error fetching product",
      error: err.message,
    });
  }
});



router.post("/add", verifyUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; 

    let cart = await Cart.findOne({ userId });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity,price:product.price });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * product.price, 0);

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
});


router.get("/cart", verifyUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    res.status(200).json({message:"details fetched Successfully",cart});
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
});


router.delete("/remove/:productId", verifyUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId"); // Populate product details

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    
    cart.items = cart.items.filter((item) => item.productId._id.toString() !== productId);

    
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * (item.productId.price || 0); 
    }, 0);

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error removing item", error: error.message });
  }
});



router.put("/update/:productId", verifyUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * (item.productId.price || 0);
    }, 0);

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
});



router.post("/addadress", verifyUser, async (req, res) => {
  try {
    const userId = req.user.id; 
    console.log("User ID:", userId); 

    const { fullName, phone, addressLine1, addressLine2, city, state, country, postalCode, landmark } = req.body;

    
    const userExists = await User.findOne({ _id: userId }); 
    console.log("User Exists:", userExists); 

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAddress = new Address({
      userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      landmark
    });

    await newAddress.save();

    res.status(201).json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Error adding address", error: error.message });
  }
});





router.put("/updateaddress/:addressId", verifyUser, async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id; 
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      landmark
    } = req.body;

    
    if (!fullName || !phone || !addressLine1 || !city || !state || !country || !postalCode) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    
    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized! You can only update your own addresses." });
    }

    
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        postalCode,
        landmark
      },
      { new: true } 
    );

    res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error: error.message });
  }
});

router.get('/get-address', verifyUser, async (req, res) => {
  const userId = req.user.id;
  try {
    const addresses = await Address.find({ userId: userId }); 
    res.status(200).json({ message: "Details fetched Successfully", addresses });
    
  } catch (err) {
    res.status(500).json({ message: "Error fetching addresses", error: err.message });
    console.log(err);
  }
});


router.get('/get-address/:id', verifyUser, async (req, res) => {
  const { id: addressId } = req.params;  
  const userId = req.user.id;

  try {
    // Check if user exists
    const existsUser = await User.findById(userId);
    if (!existsUser) {
      return res.status(401).json({ message: "User doesn't exist" });
    }

    // Fetch the specific address
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Details fetched successfully", address });

  } catch (err) {
    res.status(500).json({ message: "Error fetching address", error: err.message });
    console.log(err);
  }
});

router.delete('/delete-address/:id', verifyUser, async (req, res) => {
  const { id: addressId } = req.params;  
  const userId = req.user.id;

  try {
    
    const existsUser = await User.findById(userId);
    if (!existsUser) {
      return res.status(401).json({ message: "User doesn't exist" });
    }

    
    const address = await Address.findByIdAndDelete(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully", address });

  } catch (err) {
    res.status(500).json({ message: "Error deleting address", error: err.message });
    console.error(err);
  }
});






const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});


router.post("/place-order", verifyUser, async (req, res) => {
  try {
    const { products, paymentMethod, totalPrice, addressId } = req.body;
    const userId = req.user.id;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products selected" });
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    if (!paymentMethod || !["COD", "Online"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const newOrder = new Order({
      userId,
      products,
      address: address._id,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "Online" ? "Pending" : "Pending",
    });

    await newOrder.save();

    
    if (paymentMethod === "Online") {
      const razorpayOrder = await razorpay.orders.create({
        amount: totalPrice * 100,
        currency: "INR",
        receipt: newOrder._id.toString(),
        payment_capture: 1,
      });

      newOrder.razorpayOrderId = razorpayOrder.id;
      await newOrder.save();

      return res.status(201).json({
        message: "Order placed, awaiting payment",
        order: newOrder,
        razorpayOrder,
      });
    }


    const productDetails = products.map(p => `- ${p.productId?.name} (x${p.quantity})`).join("\n");

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Your Order Placed Successfully',
      text: `Dear ${user.name},\n\nYour order has been placed successfully!\n\nOrder ID: ${newOrder._id}\nTotal Price: ₹${totalPrice}\nPayment Method: ${paymentMethod}\n\nProducts:\n${productDetails}\n\nThank you for shopping with us!`
    };

    const mailOptions2 = {
      from: process.env.EMAIL,
      to: "aathi22004@gmail.com",
      subject: 'Your User Placed Order',
      text: `Your user ${user.username},\n\nPlaced an order successfully!\n\nOrder ID: ${newOrder._id}\nTotal Price: ₹${totalPrice}\nPayment Method: ${paymentMethod}\n\nProducts:\n${productDetails}`
    };

    transporter.sendMail(mailOptions);
    transporter.sendMail(mailOptions2);

    await Cart.deleteMany({ userId:userId });
    res.status(201).json({ message: "Order placed successfully", order: newOrder });

  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
});




router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId },
      { paymentStatus: "Paid" },
      { new: true }
    );

    const user = await User.findById(order.userId);
    const productDetails = order.products.map(p => `- ${p.productId?.name} (x${p.quantity})`).join("\n");

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Payment Successful – Order Confirmed!',
      text: `Dear ${user.name},\n\nYour payment was successful.\n\nOrder ID: ${order._id}\nTotal Price: ₹${order.totalPrice}\nPayment Method: ${order.paymentMethod}\n\nProducts:\n${productDetails}\n\nThank you for shopping with us!`
    };

    const adminMailOptions = {
      from: process.env.EMAIL,
      to: "aathi22004@gmail.com",
      subject: 'New Paid Order Received',
      text: `User: ${user.username}\nOrder ID: ${order._id}\nTotal Price: ₹${order.totalPrice}\nPayment Method: ${order.paymentMethod}\n\nProducts:\n${productDetails}`
    };

    transporter.sendMail(mailOptions);
    transporter.sendMail(adminMailOptions);

    await Cart.deleteMany({ userId: order.userId });

    res.status(200).json({ message: "Payment verified", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify payment", error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      res.json({ message: "OTP sent to email" });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/orders", verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    
    const existUser = await User.findById(userId);
    if (!existUser) {
      return res.status(401).json({ message: "User not found" });
    }

    
    const orders = await Order.find({ userId })
      .populate({
        path: "products.productId",
        select: "name description price thumbnail", 
      })
      .populate({
        path: "address",
        select: "fullName phone addressLine1 city state postalCode country", 
      });
      
      
    res.status(200).json({ message: "Details fetched successfully", orders });
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
    console.log(err);
  }
});


router.post('/products/:id/comments', verifyUser, async (req, res) => {
  try {
    const { text, rating } = req.body;
    const userId = req.user.id; 
    const productId = req.params.id;

    
    const hasBought = await Order.findOne({
      userId: userId,
      'products.productId': productId,
      orderStatus: { $nin: ['Cancelled'] },
    });

    if (!hasBought) {
      return res.status(403).json({ message: 'You can only comment on products you have purchased.' });
    }

    
    const existingComment = await Comment.findOne({ product: productId, user: userId });
    if (existingComment) {
      return res.status(400).json({ message: 'You have already commented on this product.' });
    }

    
    const comment = await Comment.create({
      product: productId,
      user: userId,
      text,
      rating
    });

    res.status(201).json({ message: 'Comment added successfully!', comment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/products/:id/comments', async (req, res) => {
  try {
    const productId = req.params.id;

    const comments = await Comment.find({ product: productId })
      .populate('user', 'username') 
      .sort({ createdAt: -1 }); 

    res.json(comments);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});















module.exports=router;