import { loginSchema } from "../models/loginSchema.mjs";
import { throwError } from "../utils/throwError.mjs";

export const validateLogin = () => ({
    before : (handler) => {
        if(!handler.event.body)
            throwError('No body provided!');
        
        const { error, value } = loginSchema.validate(handler.event.body);
        if(error) throwError(error.details[0].message);
        return;
    }
});