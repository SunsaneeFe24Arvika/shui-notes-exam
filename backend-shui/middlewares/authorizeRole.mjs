import { throwError } from "../utils/throwError.mjs";

export const authorizeRole = (allowedRoles) => ({
    before: (handler) => {
        const user = handler.event.user;
        if (!user || !allowedRoles.includes(user.role)) {
            throwError('Not Allow it');
        }
    }
});