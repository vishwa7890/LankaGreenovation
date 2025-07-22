const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

dotenv.config();

const User = require('./router/User');
const Admin = require('./router/Admin');

const app = express();

// Serve static files
app.use('/upload', express.static(path.join(__dirname, 'Upload')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup for both local and production
app.use(
  cors({
    origin: [
      "http://localhost:3000",                      // Local frontend
      "https://lankagreenovation.netlify.app",      // Netlify preview domain
      "https://lankagreenovation.com"               // Custom domain (if added)
    ],
    credentials: true
  })
);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/user', User);
app.use('/admin', Admin);

// ✅ Dynamic port for Render / 5000 for local
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));
