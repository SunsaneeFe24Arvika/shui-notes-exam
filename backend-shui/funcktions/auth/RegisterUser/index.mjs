import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { validateUser } from '../../../middlewares/validateUser.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { throwError } from '../../../utils/throwError.mjs';
import { registeredUser } from '../../../services/users.mjs';

export const handler = middy(async (event) => {
  const response = await registeredUser(event.body);
  if(response) {
    return sendResponse(201, { message : 'User created successfully' });
  } else {
    return throwError(response.message || 'User could not be created', 400);
  }
}).use(httpJsonBodyParser())
  .use(validateUser())
  .use(errorHandler());