import { throwError } from "../utils/throwError.mjs";

export const authorizeRole = (allowedRoles = []) => ({
    before: (handler) => {
        // Den här middleware kommer att aktivera efter authenticateUser
        const user = handler.event.user;
        
        if (!user) {
            throwError('User not authenticated', 401);
        }

        if (!user.role) {
            throwError('User role not found', 403);
        }

        // Kolla om rollen är tillåtet. 
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            throwError(`Access denied. Required roles: ${allowedRoles.join(', ')}`, 403);
        }
    }
});