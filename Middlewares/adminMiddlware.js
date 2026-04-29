require("dotenv").config();
const adminOnly = (req, res, next) => {
    const adminKey = req.headers["x-admin-key"];

    if (!adminKey) {
        return res.status(401).json({
            status: "ERROR",
            message: "Admin key required"
        });
    }

    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(401).json({
            status: "ERROR",
            message: "Access denied: Admin only endpoint"
        });
    }

    next();
};

module.exports = { adminOnly };

