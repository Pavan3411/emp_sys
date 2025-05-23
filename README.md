Employee Management System
Project Structure
Backend server in /server directory (Node.js/Express)

Frontend client in /client directory (React.js)

Prerequisites
Node.js version 14 or higher installed

npm or yarn package manager

MongoDB database connection

Configuration
Backend Setup
Create a .env file in the /server directory containing:

PORT=7001

DB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

Required backend dependencies to install:
express, mongoose, dotenv, cors, jsonwebtoken, bcryptjs

Frontend Setup
Create a .env file in the /client directory containing:

REACT_APP_API_URL=http://localhost:7001/api

Required frontend dependencies to install:
react-router-dom, axios, react-toastify, @mui/material, @emotion/react, @emotion/styled, @mui/icons-material

Running the Application
Backend Server
Install dependencies using npm install

Start the server using npm start (runs on port 7001)

Frontend Client
Install dependencies using npm install

Start the development server using npm start (runs on port 3000)

Key Features
Employee management with CRUD operations

JWT-based authentication system

Role-based access control (Admin/Employee)

Responsive user interface with Material-UI components

API Endpoints
POST /api/auth/register - User registration endpoint

POST /api/auth/login - User authentication endpoint

GET /api/employees/profile - Employee profile endpoint

GET /api/employees - Get all employees (Admin only)

POST /api/employees - Create new employee (Admin only)
