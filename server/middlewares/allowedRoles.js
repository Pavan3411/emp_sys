// middleware/allowedRoles.js
const allowedRoles = (...roles) => {
    return (req, res, next) => {
        // Check if user exists
        if (!req.user) {
            return res.status(401).json({
                message: "Access Denied. User not authenticated."
            });
        }

        // Check if user has required role
        if (!req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access Denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role || 'none'}`,
                userRole: req.user.role,
                requiredRoles: roles
            });
        }

        next();
    }
}

module.exports = allowedRoles;