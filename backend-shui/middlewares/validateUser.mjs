import { userSchema } from "../models/userSchema.mjs";
import { throwError } from "../utils/throwError.mjs";

// export const validateUser = () => ({
//     before : (handler) => {
//         if(!handler.event.body) {
//             throwError('No body provided', 400);
//         }

//         let data = handler.event.body;
//         // Om body är en sträng, parsa den
//         if (typeof data === 'string') {
//             try {
//                 data = JSON.parse(data);
//             } catch {
//                 throwError('Invalid JSON format in body', 400);
//             }
//         }

//         const { error, value } = userSchema.validate(data, { abortEarly: false });
//         if(error) {
//             const details = error.details.map((d) => d.message).join(', ');
//             throwError(`Validation error: ${details}`, 422);
//         }
//         handler.event.body = value;
//     }
// });

export const validateUser = () => ({
    before: (handler) => {
        if (!handler.event.body) throwError('No body provided');
        let data = handler.event.body;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        const { error, value } = userSchema.validate(data);
        if (error) throwError(error.details[0].message);
        handler.event.body = value;
    }
});