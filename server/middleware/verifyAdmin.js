const jwt = require("jsonwebtoken");
require('dotenv').config();


const SECRET_KEY = process.env.SECRET_KEY;

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return res.status(401).json({ message: "Unauthorized admin" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid admin token" });
  }
};

module.exports = verifyAdmin;
