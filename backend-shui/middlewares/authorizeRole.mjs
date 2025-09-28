import { throwError } from "../utils/throwError.mjs";

export const authorizeRole = (allowedRoles = []) => ({
    before: (handler) => {
        // This middleware should run after authenticateUser
        const user = handler.event.user;
        
        if (!user) {
            throwError('User not authenticated', 401);
        }

        if (!user.role) {
            throwError('User role not found', 403);
        }

        // Check if user's role is in allowed roles
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            throwError(`Access denied. Required roles: ${allowedRoles.join(', ')}`, 403);
        }
    }
});