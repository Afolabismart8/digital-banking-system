const { getAuthenticatedApi } = require("../configs/nibssbyPhoenix");
const { nibssApi } = require("../configs/nibssbyPhoenix");


// Middleware to validate bearer token format and attach NIBSS auth client
const getNIBSSApi = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: "ERROR",
                Message: "Authorization token required"
            });}

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(400).json({
                status: "ERROR",
                Message: "No token, Not authorized"
            });
        }
        req.nibssApi = getAuthenticatedApi(token);
        next();


    } catch (error) {
        console.error('Auth middleware error:', error.message || error);
        return res.status(401).json({
            status: "ERROR",
            Message: "Invalid token"
        });
    }
};
module.exports = {getNIBSSApi}
