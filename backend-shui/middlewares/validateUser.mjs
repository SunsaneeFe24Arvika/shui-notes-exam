import { userSchema } from "../models/userSchema.mjs";
import { throwError } from "../utils/throwError.mjs";

export const validateUser = () => ({
    before : (handler) => {
        if(!handler.event.body) throwError('No body provided');
        const { error, value } = userSchema.validate(handler.event.body);
        if(error) throwError(error.details[0].message);
        return;
    }
});