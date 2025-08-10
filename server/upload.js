const multer = require('multer');
const { storage } = require('./cloudinaryConfig');

const upload = multer({ storage }).fields([
  { name: 'images', maxCount: 5 },
  { name: 'thumbnail', maxCount: 1 }
]);

module.exports = upload;
