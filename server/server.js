const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDb = require('./config/db');
const app = express();
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middlewares
app.use(cors());
app.use(express.json());

// DB Connection
connectDb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes)
app.use('/api/admin', adminRoutes)


const PORT = process.env.PORT || 7002

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
