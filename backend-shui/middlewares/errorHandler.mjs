import { sendResponse } from "../responses/index.mjs";

export const errorHandler = () => ({
    onError : (handler) => {
        const statusCode = handler.error.statusCode || 500;
        handler.response = sendResponse(statusCode, { message : handler.error.nessage || 'Something went wrong' });
    },
});
