const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config();
const User = require('./router/User');
const Admin = require('./router/Admin');
const path = require('path');

const app = express();
app.use('/upload', express.static(path.join(__dirname, 'Upload')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


app.use('/user',User);
app.use('/admin',Admin);







app.listen(5000, () => console.log("Server running on port 5000"));
