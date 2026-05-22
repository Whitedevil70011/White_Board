const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const SECRET_KEY = 'your_jwt_secret'; // Keep consistent with userController

const authenticationMiddleware = async (req, res, next) => {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        req.email = decoded.email;

        next();

    } catch (error) {

        return res.status(401).json({
            message: 'Invalid or expired token',
            error: error.message
        });

    }
};

module.exports = authenticationMiddleware;