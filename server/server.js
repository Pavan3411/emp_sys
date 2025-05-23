const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDb = require('./config/db');
const app = express();
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const adminRoutes = require('./routes/adminRoutes');

// DB Connection
connectDb();

// ✅ CORS Setup
app.use(cors({
  origin: 'https://emp-sys-client.onrender.com', // your frontend URL
  credentials: true
}));

app.options('*', cors());

// Body parser
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
