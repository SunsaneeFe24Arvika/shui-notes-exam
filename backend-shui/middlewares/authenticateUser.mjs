import { verifyToken } from '../utils/jwt.mjs';
import { throwError } from '../utils/throwError.mjs';

export const authenticateUser = () => ({
    before: (handler) => {
        const authHeader = handler.event.headers?.authorization || handler.event.headers?.Authorization;
        
        if (!authHeader) {
            throwError('Authorization header is required', 401);
        }

        // Extract token from "Bearer TOKEN"
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : authHeader;

        if (!token) {
            throwError('Token is required', 401);
        }

        try {
            // Verify and decode the token
            const decoded = verifyToken(token);
            
            if (!decoded) {
                throwError('Invalid token', 401);
            }

            // Add user info to event context
            handler.event.user = {
                username: decoded.username,
                role: decoded.role
            };

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throwError('Token has expired', 401);
            } else if (error.name === 'JsonWebTokenError') {
                throwError('Invalid token format', 401);
            } else {
                throwError('Authentication failed', 401);
            }
        }
    }
});