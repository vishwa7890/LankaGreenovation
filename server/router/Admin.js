const express = require('express');
const router = express.Router();
const Admin = require('../model/Admin');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const verifyAdmin = require('../middleware/verifyAdmin');
const Order = require('../model/Order');
const Product = require('../model/Product');
const mongoose = require('mongoose');
const Contact = require('../model/Contact');
const nodemailer = require('nodemailer');
const { cloudinary } = require('../cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const SECRET_KEY = process.env.SECRET_KEY;
const upload = require('../upload');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});


const { storage } = require('../cloudinaryConfig');



router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin || !(await bcrypt.compare(password, admin.password)))
        return res.status(401).json({ message: "Invalid Credentials" });
  
      const token = jwt.sign({ id: admin._id, username: admin.username }, SECRET_KEY, { expiresIn: "1h" });
      res.cookie("adminToken", token, {
        httpOnly: true, 
        secure: true, 
        sameSite: "None",
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
        secure: true, 
        sameSite: "None",
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


router.post("/add-product", upload, verifyAdmin, async (req, res) => {
  try {
    console.log("📝 Incoming request to /add-product");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const {
      name,
      brand,
      price,
      availablestock,
      shortDescription,
      detailedDescription,
      stockStatus,
      category,
      itemForm,
      productBenefits,
      scent,
      skinType,
      netQuantity,
      numberOfItems,
      recommendedUses,
      upc,
      manufacturer,
      countryOfOrigin,
      itemPartNumber,
      productDimensions,
      asin,
      itemWeight,
      itemDimensions,
      bestSellersRank,
      rankInFaceMasks
    } = req.body;

    // Directly use Multer-Cloudinary upload results
    const imageUploads = req.files?.images?.map(file => ({
      url: file.path,         // Cloudinary URL
      public_id: file.filename // Cloudinary public_id
    })) || [];

    let thumbnailUpload = null;
    if (req.files?.thumbnail?.[0]) {
      const file = req.files.thumbnail[0];
      thumbnailUpload = {
        url: file.path,
        public_id: file.filename
      };
    }

    // Create product document
    const newProduct = new Product({
      name,
      brand,
      price,
      availablestock,
      shortDescription,
      detailedDescription,
      stockStatus,
      category,
      images: imageUploads,
      thumbnail: thumbnailUpload,
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
        netQuantity,
        bestSellersRank,
        rankInFaceMasks
      }
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully!",
      product: newProduct
    });

  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});







router.get('/get-product', verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const formattedProducts = products.map(product => ({
      ...product.toObject(),
      images: product.images?.map(img => img.url),
      thumbnail: product.thumbnail || null
    }));

    res.status(200).json({
      message: "Products fetched successfully",
      products: formattedProducts
    });

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});



router.put("/edit-product/:id", upload, verifyAdmin, async (req, res) => { 
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle image replacement if new images uploaded
    let updatedImages = product.images;
    if (req.files?.images && req.files.images.length > 0) {
      // Delete old images from Cloudinary
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      // Use new uploaded images from multer/cloudinary middleware
      updatedImages = req.files.images.map(file => ({
        url: file.path,         // From your upload middleware, e.g. multer-cloudinary
        public_id: file.filename
      }));
    }

    // Handle thumbnail replacement if new thumbnail uploaded
    let updatedThumbnail = product.thumbnail;
    if (req.files?.thumbnail && req.files.thumbnail.length > 0) {
      if (product.thumbnail?.public_id) {
        await cloudinary.uploader.destroy(product.thumbnail.public_id);
      }
      const file = req.files.thumbnail[0];
      updatedThumbnail = {
        url: file.path,
        public_id: file.filename
      };
    }

    // Prepare the fields to update
    const {
      name,
      brand,
      price,
      availablestock,
      shortDescription,
      detailedDescription,
      stockStatus,
      category,
      itemForm,
      productBenefits,
      scent,
      skinType,
      netQuantity,
      numberOfItems,
      recommendedUses,
      upc,
      manufacturer,
      countryOfOrigin,
      itemPartNumber,
      productDimensions,
      asin,
      itemWeight,
      itemDimensions,
      bestSellersRank,
      rankInFaceMasks
    } = req.body;

    const updateFields = {
      name,
      brand,
      price,
      availablestock,
      shortDescription,
      detailedDescription,
      stockStatus,
      category,
      images: updatedImages,
      thumbnail: updatedThumbnail,
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
        netQuantity,
        bestSellersRank,
        rankInFaceMasks
      }
    };

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
});




router.get("/get-product/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Transform for frontend compatibility
    const transformedProduct = {
      ...product.toObject(),
      images: product.images.map(img => img.url),
      thumbnail: product.thumbnail ? product.thumbnail.url : null
    };

    res.status(200).json({
      message: "Product fetched successfully",
      product: transformedProduct
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});



router.delete("/delete-product/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete all product images from Cloudinary in parallel
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images
          .filter(img => img.public_id)
          .map(img => cloudinary.uploader.destroy(img.public_id))
      );
    }

    // Delete product thumbnail from Cloudinary
    if (product.thumbnail?.public_id) {
      await cloudinary.uploader.destroy(product.thumbnail.public_id);
    }

    // Delete product from DB
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });

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
      return res.status(401).json({ message: "Admin not found" });
    }

    const { orderStatus } = req.body;
    console.log("Updating order to:", orderStatus);

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ If status is "Processing", update stock
    if (orderStatus === "Processing") {
      for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.productId} not found` });
        }

        product.availablestock -= item.quantity;

        if (product.availablestock <= 0) {
          product.availablestock = 0;
          product.stockStatus = "Out of Stock";
        }

        await product.save();
      }
    }

    // ✅ Update status and COD payment
    order.orderStatus = orderStatus;

    if (order.paymentMethod === "COD" && orderStatus === "Delivered") {
      order.paymentStatus = "Paid";
    }

    const updatedOrder = await order.save();
    await updatedOrder.populate("products.productId");

    const user = await User.findById(updatedOrder.userId);

    const productDetails = updatedOrder.products.map(item => {
      return `
        <p>
          <strong>Product:</strong> ${item.productId.name}<br />
          <strong>Quantity:</strong> ${item.quantity}<br />
          <strong>Price:</strong> ₹${item.price}
        </p>
        <hr />
      `;
    }).join("");

    const subjectMap = {
      "Pending": "Order Placed",
      "Processing": "Order is Processing",
      "Shipped": "Order Shipped",
      "Delivered": "Order Delivered",
      "Cancelled": "Order Cancelled"
    };

    const userMailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: `Your Order Status: ${subjectMap[orderStatus] || "Updated"}`,
      html: `
        <div style="max-width:600px;margin:auto;background:#ffffff;padding:30px;border-radius:12px;border:1px solid #e0e0e0;
            font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.07);">
  
  <h2 style="text-align:center;color:#2c3e50;margin-bottom:24px;">
    ${subjectMap[orderStatus] || "Order Update"}
  </h2>

  <p style="font-size:16px;color:#444;margin-bottom:12px;">
    Hello <strong>${user.username}</strong>,
  </p>

  <p style="font-size:15px;color:#555;margin-bottom:20px;">
    Your order <strong>#${updatedOrder._id}</strong> status has been updated to 
    <strong style="color:#27ae60">${orderStatus}</strong>.
  </p>

  <div style="background:#f4f6f8;border-radius:8px;padding:15px;margin-bottom:20px;">
    <p style="margin:0 0 8px;"><strong>Total Price:</strong> ₹${updatedOrder.totalPrice}</p>
    <p style="margin:0 0 8px;"><strong>Payment:</strong> ${updatedOrder.paymentMethod} - ${updatedOrder.paymentStatus}</p>
  </div>

  <h4 style="color:#2c3e50;margin-top:30px;margin-bottom:12px;">🛒 Products</h4>
  <div style="background:#fafafa;padding:15px;border-left:4px solid #3498db;border-radius:6px;
              font-size:14px;line-height:1.6;color:#333;">
    ${productDetails}
  </div>

  <p style="margin-top:30px;font-size:13px;color:#888;text-align:center;">
    If you have any questions, feel free to reach out to us at 
    <a href="mailto:lankagreenovation@gmail.com" style="color:#3498db;text-decoration:none;">
      lankagreenovation@gmail.com
    </a>
  </p>
</div>

      `
    };

    transporter.sendMail(userMailOptions, (err) => {
      if (err) {
        console.error("Email send failed:", err);
      } else {
        console.log("Status update email sent to", user.email);
      }
    });

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
