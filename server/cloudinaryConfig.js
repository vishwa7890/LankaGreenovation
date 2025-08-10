const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage engine (optional if you upload via upload_stream)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'products';
    if (file.fieldname === 'thumbnail') folder = 'products/thumbnails';
    return {
      folder,
      resource_type: 'auto'
    };
  }
});

module.exports = {
  cloudinary,
  storage
};
