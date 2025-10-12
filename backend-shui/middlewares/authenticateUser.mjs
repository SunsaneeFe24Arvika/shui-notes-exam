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
                console.log('Token verification failed - decoded is null');
                throwError('Invalid or expired token', 401);
            }

            console.log('Token verified successfully for user:', decoded.username);

            // Add user info to event context (no roles anymore)
            handler.event.user = {
                username: decoded.username
            };

        } catch (error) {
            console.log('Authentication error:', error.message);
            if (error.name === 'TokenExpiredError') {
                throwError('Token has expired - please login again', 401);
            } else if (error.name === 'JsonWebTokenError') {
                throwError('Invalid token format', 401);
            } else {
                throwError('Authentication failed', 401);
            }
        }
    }
});