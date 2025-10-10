import { sendResponse } from "../responses/index.mjs";

export const errorHandler = () => ({
    onError : (handler) => {        
        handler.response = sendResponse(400, { message : handler.error.message });
    }
});