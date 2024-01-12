const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const token = req.cookies?.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password"); //655bab7828ea17ed0b3595f5"

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized, token failed");
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

};

module.exports = { protect };