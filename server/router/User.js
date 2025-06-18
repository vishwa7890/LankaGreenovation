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
const Contact = require("../model/Contact");




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const logoUrl = 'https://i.ibb.co/cXx9GgZz/Logo.jpg';

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
  text: `Hello ${username}, your OTP is ${otp}. It is valid for 10 minutes.`,
  html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    
    <!-- Logo + Company Name in Table (Side by Side) -->
    <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
      <tr>
        <td style="width: 100px; padding-right: 10px;">
          <img src="https://i.ibb.co/cXx9GgZz/Logo.jpg" alt="Logo" style="width: 100px; height: auto; display: block;">
        </td>
        <td style="vertical-align: middle;">
          <div style="font-size: 22px; font-weight: bold; color: #4CAF50;">Lanka Greenovation</div>
        </td>
      </tr>
    </table>

    <!-- Title -->
    <h2 style="text-align: center; color: #333;">Verify Your Login</h2>

    <!-- Greeting -->
    <p style="text-align: center; color: #555;">Hello <strong>${username}</strong>,</p>
    <p style="text-align: center; color: #555;">
      To keep your account secure, use the One-Time Password (OTP) below:
    </p>

    <!-- OTP Code -->
    <div style="font-size: 28px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0;">
      ${otp}
    </div>

    <!-- OTP Validity -->
    <p style="text-align: center; color: #555;">
      This code is valid for the next <strong>10 minutes</strong>. Do not share your OTP with anyone.
    </p>

    <!-- Footer -->
    <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
      If you didn’t request this code, please ignore this email.
    </p>
    <p style="font-size: 12px; color: #888; text-align: center;">
      For assistance, contact us at <strong><a href="mailto:support@lankagreenovation.com" style="color: #4CAF50;">support@lankagreenovation.com</a></strong>.
    </p>

  </div>
</body>
</html>
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
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Generate new OTP & update expiry
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 min

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // 3. Resend email (reuse same template)
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your New OTP Code',
      text: `Hello ${user.username}, your new OTP is ${otp}. It is valid for 10 minutes.`,
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>OTP Verification</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                  <tr>
                    <td style="width: 100px; padding-right: 10px;">
                      <img src="https://i.ibb.co/cXx9GgZz/Logo.jpg" alt="Logo" style="width: 100px; height: auto; display: block;">
                    </td>
                    <td style="vertical-align: middle;">
                      <div style="font-size: 22px; font-weight: bold; color: #4CAF50;">Lanka Greenovation</div>
                    </td>
                  </tr>
                </table>
                <h2 style="text-align: center; color: #333;">Resend OTP</h2>
                <p style="text-align: center; color: #555;">Hello <strong>${user.username}</strong>,</p>
                <p style="text-align: center; color: #555;">Here is your new One-Time Password (OTP):</p>
                <div style="font-size: 28px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="text-align: center; color: #555;">This code is valid for the next <strong>10 minutes</strong>. Do not share your OTP with anyone.</p>
                <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
                  If you didn’t request this code, please ignore this email.
                </p>
                <p style="font-size: 12px; color: #888; text-align: center;">
                  For assistance, contact us at <strong><a href="mailto:support@lankagreenovation.com" style="color: #4CAF50;">support@lankagreenovation.com</a></strong>.
                </p>
              </div>
            </body>
            </html>`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }

      return res.json({ message: "New OTP sent to your email" });
    });

  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ message: "Server error while resending OTP" });
  }
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
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${isUpdate ? 'Password Updated' : 'Account Created'}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      
       <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="width: 100px;">
              <img src="https://i.ibb.co/cXx9GgZz/Logo.jpg" alt="Logo" style="width: 100px; height: 100px;" />
            </td>
            <td style="text-align: left; vertical-align: middle;">
              <span style="font-size: 22px; font-weight: bold; color: #4CAF50;">Order Placed</span>
            </td>
          </tr>
        </table>

        <!-- Title -->
        <h2 style="text-align: center; color: #333;">${isUpdate ? 'Your Password Was Successfully Updated' : 'Welcome to Lanka Greenovation'}</h2>

        <!-- Greeting and Message -->
        <p style="text-align: center; color: #555;">Hello <strong>${user.username || "User"}</strong>,</p>
        <p style="text-align: center; color: #555;">
          Your password has been <strong>${isUpdate ? 'updated' : 'set successfully'}</strong>.
          You can now log in using your registered email and password.
        </p>

        <!-- Button -->
        <div style="text-align: center; margin-top: 20px;">
          <a href="your-login-page-url" style="display: inline-block; padding: 12px 24px; font-size: 16px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">
            ${isUpdate ? 'Log In Now' : 'Get Started'}
          </a>
        </div>

        <!-- Footer -->
        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
          If you did not perform this action, please contact our support team immediately.
        </p>
        <p style="font-size: 12px; color: #888; text-align: center;">
          For assistance, contact us at <strong>support@lankagreenovation.com</strong>.
        </p>
      </div>
    </body>
    </html>
  `
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
    console.log(products);
    
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
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Order Placed</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

        <!-- Logo and Function Name in Table -->
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="width: 100px;">
              <img src="https://i.ibb.co/cXx9GgZz/Logo.jpg" alt="Logo" style="width: 100px; height: 100px;" />
            </td>
            <td style="text-align: left; vertical-align: middle;">
              <span style="font-size: 22px; font-weight: bold; color: #4CAF50;">Order Placed</span>
            </td>
          </tr>
        </table>

        <!-- Title -->
        <h2 style="text-align: center; color: #333;">Order Confirmation</h2>

        <!-- Greeting -->
        <p style="text-align: center; color: #555;">Hello <strong>${user.name}</strong>,</p>
        <p style="text-align: center; color: #555;">
          Your order has been successfully placed. Here are your order details:
        </p>

        <!-- Order Summary -->
        <div style="margin: 20px 0; color: #333;">
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
          <p><strong>Total Price:</strong> ₹${totalPrice}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        </div>

        <!-- Product Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Product</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${newOrder.products.map(product => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${product.productId.name}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${product.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">₹${product.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Thank You -->
        <p style="text-align: center; color: #555; margin-top: 30px;">
          Thank you for shopping with us!
        </p>

        <!-- Footer -->
        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
          For any help, contact us at <strong>support@lankagreenovation.com</strong>.
        </p>
      </div>
    </body>
    </html>
  `
};


  const mailOptions2 = {
  from: process.env.EMAIL,
  to: "aathi22004@gmail.com",
  subject: 'Your User Placed Order',
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>User Order Alert</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

        <!-- Logo and Function Name in Table -->
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="width: 100px;">
              <img src="https://i.ibb.co/cXx9GgZz/Logo.jpg" alt="Logo" style="width: 100px; height: 100px;" />
            </td>
            <td style="text-align: left; vertical-align: middle;">
              <span style="font-size: 22px; font-weight: bold; color: #4CAF50;">User Order Alert</span>
            </td>
          </tr>
        </table>

        <!-- Admin Alert -->
        <h2 style="text-align: center; color: #333;">New Order Placed</h2>
        <p style="text-align: center; color: #555;">
          Your user <strong>${user.username}</strong> has placed a new order.
        </p>

        <!-- Order Summary -->
        <div style="margin: 20px 0; color: #333;">
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
          <p><strong>Total Price:</strong> ₹${totalPrice}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        </div>

        <!-- Product Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Product</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${newOrder.products.map(product => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${product.name}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${product.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">₹${product.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Footer -->
        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
          This is an automated notification. No action is required.
        </p>
      </div>
    </body>
    </html>
  `
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
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

        <!-- Header with logo and function name -->
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="width: 100px;">
              <img src="https://i.ibb.co/cXx9GgZz/Logo.jpg" alt="Logo" style="width: 100px; height: 100px;" />
            </td>
            <td style="text-align: left; vertical-align: middle;">
              <span style="font-size: 22px; font-weight: bold; color: #4CAF50;">Payment Confirmation</span>
            </td>
          </tr>
        </table>

        <!-- Greeting & Confirmation -->
        <h2 style="text-align: center; color: #333;">Payment Successful!</h2>
        <p style="text-align: center; color: #555;">Dear <strong>${user.name}</strong>,</p>
        <p style="text-align: center; color: #555;">We’ve received your payment and your order has been confirmed.</p>

        <!-- Order Summary -->
        <div style="margin: 20px 0; color: #333;">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total Price:</strong> ₹${order.totalPrice}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>

        <!-- Product Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Product</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.products.map(product => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${product.name}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${product.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">₹${product.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Footer -->
        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
          Thank you for shopping with us!  
        </p>
        <p style="font-size: 12px; color: #888; text-align: center;">
          For help, contact <strong>support@lankagreenovation.com</strong>.
        </p>
      </div>
    </body>
    </html>
  `
};
    const mailOptions2 = {
  from: process.env.EMAIL,
  to: "aathi22004@gmail.com",
  subject: 'Your User Placed Order',
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>User Order Alert</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

        <!-- Logo and Function Name in Table -->
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="width: 100px;">
              <img src="https://i.ibb.co/cXx9GgZz/Logo.jpg" alt="Logo" style="width: 100px; height: 100px;" />
            </td>
            <td style="text-align: left; vertical-align: middle;">
              <span style="font-size: 22px; font-weight: bold; color: #4CAF50;">User Order Alert</span>
            </td>
          </tr>
        </table>

        <!-- Admin Alert -->
        <h2 style="text-align: center; color: #333;">New Order Placed</h2>
        <p style="text-align: center; color: #555;">
          Your user <strong>${user.username}</strong> has placed a new order.
        </p>

        <!-- Order Summary -->
        <div style="margin: 20px 0; color: #333;">
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
          <p><strong>Total Price:</strong> ₹${totalPrice}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        </div>

        <!-- Product Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Product</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${newOrder.products.map(product => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${product.name}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${product.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">₹${product.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Footer -->
        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
          This is an automated notification. No action is required.
        </p>
      </div>
    </body>
    </html>
  `
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
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OTP Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

        <!-- Header with logo and title -->
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="width: 100px;">
              <img src="https://i.ibb.co/cXx9GgZz/Logo.jpg" alt="Logo" style="width: 100px; height: 100px;" />
            </td>
            <td style="text-align: left; vertical-align: middle;">
              <span style="font-size: 22px; font-weight: bold; color: #4CAF50;">Verify OTP</span>
            </td>
          </tr>
        </table>

        <!-- Title -->
        <h2 style="text-align: center; color: #333;">Your One-Time Password</h2>
        <p style="text-align: center; color: #555;">Please use the OTP below to proceed:</p>

        <!-- OTP Code -->
        <div style="font-size: 28px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0;">
          ${otp}
        </div>

        <!-- Expiry Note -->
        <p style="text-align: center; color: #555;">This code is valid for <strong>10 minutes</strong>.</p>
        <p style="text-align: center; color: #888; font-size: 12px;">Do not share this OTP with anyone.</p>

        <!-- Footer -->
        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
          If you didn’t request this OTP, you can safely ignore this message.
        </p>
        <p style="font-size: 12px; color: #888; text-align: center;">
          Need help? Contact <strong>support@lankagreenovation.com</strong>.
        </p>
      </div>
    </body>
    </html>
  `
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


router.post('/contact',async (req, res) => {
  const { name, email, message } = req.body;
  

  try {
    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();

    const mailOptions = {
      from:process.env.EMAIL ,
      to: process.env.EMAIL,
      subject: 'New Contact Message',
      text:  `You received a new message from ${name} (${email}):\n\n${message}`,
    };
    
    await transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to Submit Contact" });
      }
      res.status(200).json({ message: "Contact form submitted and email sent!" });
    });
    

    

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});
module.exports=router;