const express = require('express');
const router = express.Router();
const Admin = require('../model/Admin');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const verifyAdmin = require('../middleware/verifyAdmin');
const Order = require('../model/Order');
const Product = require('../model/Product');
const mongoose = require('mongoose');
const Contact = require('../model/Contact');

const SECRET_KEY = process.env.SECRET_KEY;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "Upload/Images"); 
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
}).fields([
  { name: 'images', maxCount: 5 },   
  { name: 'thumbnail', maxCount: 1 } 
]);


router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin || !(await bcrypt.compare(password, admin.password)))
        return res.status(401).json({ message: "Invalid Credentials" });
  
      const token = jwt.sign({ id: admin._id, username: admin.username }, SECRET_KEY, { expiresIn: "1h" });
      res.cookie("adminToken", token, {
        httpOnly: true, 
        secure: false, 
        sameSite: "Strict",
     });
      res.json({ message: "Admin logged in successfully",token});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/logout", (req, res) => {
    try {
        res.clearCookie("adminToken", {
        httpOnly: true,
        secure: false, 
        sameSite: "Strict",
      });
  
      res.json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed", error: error.message });
    }
  });
  

router.get("/dashboard", verifyAdmin, async(req, res) => {
  console.log(req.admin);
  try{
    const admin = await Admin.findById(req.admin.id);
    res.json({ message: "Welcome Admin",data:req.admin,admin});
  }
  catch(err){
    res.status(401).json({message:err});
  }
});



router.post('/add-product', upload, verifyAdmin, async (req, res) => {
    try {
        // Image paths
        const imagePaths = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const thumbnailPath = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;

        // Destructure basic fields
        const {
            name,
            brand,
            price,
            availablestock,
            shortDescription,
            detailedDescription,
            stockStatus,

            // specs fields
            itemForm,
            productBenefits,
            scent,
            skinType,
            netQuantity,
            numberOfItems,
            recommendedUses,
            upc,


            // technical details
            manufacturer,
            countryOfOrigin,
            itemPartNumber,
            productDimensions,
            asin,

            // additional info
            itemWeight,
            itemDimensions,
            bestSellersRank,
            rankInFaceMasks,
        } = req.body;

        const newProduct = new Product({
            name,
            brand,
            price,
            availablestock,
            shortDescription,
            detailedDescription,
            stockStatus,
            images: imagePaths,
            thumbnail: thumbnailPath,

            specs: {
                itemForm,
                productBenefits,
                scent,
                skinType,
                netQuantity,
                numberOfItems,
                recommendedUses,
                upc
            },
            technicalDetails: {
                manufacturer,
                countryOfOrigin,
                itemPartNumber,
                productDimensions,
                asin
            },

            additionalInfo: {
                itemWeight,
                itemDimensions,
                netQuantity, // repeated field, optional
                bestSellersRank,
                rankInFaceMasks
            },
        });
        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});



router.get('/get-product', verifyAdmin, async (req, res) => {
  try {
      const products = await Product.find();

      if (!products || products.length === 0) {
          return res.status(404).json({ message: "No products found" });
      }

      res.status(200).json({
          message: "Products fetched successfully",
          products: products
      });

  } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

router.put('/edit-product/:id', verifyAdmin, async (req, res) => {
  try {
      const { name, brand, price, shortDescription, detailedDescription, stockStatus } = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          { name, brand, price, shortDescription, detailedDescription, stockStatus }, 
          { new: true, runValidators: true } 
      );

      if (!updatedProduct) {
          return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product", error: error.message });
  }
});


router.get("/get-product/:id",verifyAdmin,async(req,res)=>{
  try {
    const {id} = req.params;

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product Fetched successfully", product:product });
  } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});


router.delete("/delete-product/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/orders", verifyAdmin, async (req, res) => {
  try {
    const AdminId = req.admin.id;
    const existUser = await Admin.findById(AdminId);
    if (!existUser) {
      return res.status(401).json({ message: "User not found" });
    }

    
    const orders = await Order.find({})
      .populate({
        path: "products.productId",
        select: "name shortDescription price thumbnail", 
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


router.put('/update-order/:id', verifyAdmin, async (req, res) => {
  try {
    const AdminId = req.admin.id;
    const existUser = await Admin.findById(AdminId);
    if (!existUser) {
      return res.status(401).json({ message: "User not found" });
    }

    const { orderStatus } = req.body;

    // Find the order first
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If orderStatus is Processing, update product stock
    if (orderStatus === "Processing") {
      for (const productEntry of order.products) {
        const productId = productEntry.productId;
        const product = await Product.findById(productId);

        if (!product) {
          return res.status(404).json({ message: `Product ${productId} not found` });
        }

        // Decrement available stock by quantity ordered
        product.availablestock -= productEntry.quantity;

        // If stock drops to 0 or below, set stockstatus to "Out of Stock"
        if (product.availablestock <= 0) {
          product.availablestock = 0; // avoid negative stock
          product.stockstatus = "Out of Stock";
        }

        await product.save();
      }
    }

    // Update orderStatus in order
    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();

    // If status is Cancelled, send email to user and admin
    if (orderStatus === "Cancelled") {
      const user = await User.findById(updatedOrder.userId);
      const productDetails = updatedOrder.products
        .map(p => `- ${p.productId?.name || "Product"} (x${p.quantity})`)
        .join("\n");

      const userMailOptions = {
  from: process.env.EMAIL,
  to: user.email,
  subject: 'Your Order Has Been Cancelled',
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Order Cancelled</title>
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
              <span style="font-size: 22px; font-weight: bold; color: #f44336;">Order Cancelled</span>
            </td>
          </tr>
        </table>

        <!-- Title -->
        <h2 style="text-align: center; color: #333;">Your Order Has Been Cancelled</h2>

        <!-- Message -->
        <p style="text-align: center; color: #555;">Dear <strong>${user.name}</strong>,</p>
        <p style="text-align: center; color: #555;">
          Your order has been cancelled. Below are the order details:
        </p>

        <!-- Order Info -->
        <div style="margin: 20px 0; color: #333; font-size: 16px;">
          <p><strong>Order ID:</strong> ${updatedOrder._id}</p>
          <p><strong>Products:</strong></p>
          <pre style="background-color: #f0f0f0; padding: 10px; border-radius: 6px; white-space: pre-wrap;">${productDetails}</pre>
          <p><strong>Total Price:</strong> ₹${updatedOrder.totalPrice}</p>
        </div>

        <!-- Apology -->
        <p style="text-align: center; color: #777;">
          We’re sorry for the inconvenience.
        </p>

        <!-- Footer -->
        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
          For any questions, contact us at <strong>support@lankagreenovation.com</strong>.
        </p>
      </div>
    </body>
    </html>
  `
};
      transporter.sendMail(userMailOptions, (err) => {
        if (err) console.error("Failed to send cancellation email to user:", err);
      });
    }

    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
});




router.get("/orders/:id", verifyAdmin, async (req, res) => {
  try {
    const {id} = req.params;
    const AdminId = req.admin.id;
    const existUser = await Admin.findById(AdminId);
    if (!existUser) {
      return res.status(401).json({ message: "User not found" });
    }

    
    const orders = await Order.findById(id)
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


router.get('/contactdetails',verifyAdmin,async(req,res)=>{
  try{
    const contactDetails = await Contact.find();
    res.status(200).json({ message: "Contact details fetched successfully", contactDetails });
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"Internal Error"});
  }
})

module.exports=router;
