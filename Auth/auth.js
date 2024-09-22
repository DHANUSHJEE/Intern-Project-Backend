import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = verified; // Attach user details to request
        next(); // Move to next middleware
    } catch (error) {
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

export default verifyToken;
