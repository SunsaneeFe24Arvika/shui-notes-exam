import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { throwError } from '../../../utils/throwError.mjs';
import { validateUser } from '../../../middlewares/validateUser.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { addUserfromRegister } from '../../../services/user.mjs';

export const handler = middy(async (event) => {
    const response = await addUserfromRegister(event.body);
    if(!response.success) {
        throwError(response.message || 'User could not be registered');
    }
        return sendResponse(202, {
            success: true,
            message: 'User registered successfully!',
        })
}).use(httpJsonBodyParser())
  .use(validateUser())
  .use(errorHandler());

// export const handler = middy(async (event) => {
//     const response = await addUserfromRegister(event.body);
//     if(response) {
//         return sendResponse(201, { message: 'User registered successfully!' });
//     } else {
//         return sendResponse(404, { message : 'User could not be registered!' });
//     }
// }).use(httpJsonBodyParser())
//   .use(validateUser())
//   .use(errorHandler());