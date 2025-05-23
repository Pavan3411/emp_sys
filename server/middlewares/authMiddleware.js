const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access Denied, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Now decoded contains id, role, and email
        console.log("req.user: ", req.user);
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        return res.status(403).json({ message: "Invalid or Expired Token" });
    }
}

module.exports = verifyToken;