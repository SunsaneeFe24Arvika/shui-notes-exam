import { verifyToken } from '../utils/jwt.mjs';
import { throwError } from '../utils/throwError.mjs';

export const authenticateUser = () => ({
    before : (handler) => {
        const authHeader = handler.event.headers?.Authorization || handler.event.headers?.authorization;
        if(!authHeader) {
            throwError('No token provided');
        }
        // Förväntar format: "Bearer <token>"
        const token = authHeader.split(' ')[1];
        try {
            const user = verifyToken(token);
            if(!user) throwError('Unauthorized!');
            handler.event.user = user;
        } catch (error) {
            throwError('Unauthorized!');
        }
    }
});