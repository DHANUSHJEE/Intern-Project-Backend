import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = {
    verifyToken: async (req, res, next) => {
        try {
            // Get the token from cookies or Authorization header
            const token = req.cookies.token 

            // If token is not present, return an error
            if (!token) {
                return res.status(401).json({ message: "Token is missing" });
            }

            // If token is present, verify the token
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

                // Add the decoded token to the request object
                req.id = decodedToken.id;

                next();
            } catch (error) {
                console.error("Token verification error:", error);
                return res.status(401).json({ message: "Token is not valid" });
            }
        } catch (error) {
            console.error("Internal Server Error in verifying token:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export default auth;
