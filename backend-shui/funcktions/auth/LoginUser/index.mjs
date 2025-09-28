import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { validateLogin } from '../../../middlewares/validateLogin.mjs';
import { throwError } from '../../../utils/throwError.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { getRegisteredUser } from '../../../services/users.mjs';
import { comparePasswords } from '../../../utils/bcrypt.mjs';
import { generateToken } from '../../../utils/jwt.mjs';

export const handler = middy(async (event) => {
  const response = await getRegisteredUser(event.body.username);
  
  if (!response) {
    throwError('User not found', 404);
  }
  
  const isPasswordValid = await comparePasswords(event.body.password, response.attributes.password);
  
  if (!isPasswordValid) {
    throwError('Wrong password!', 400);
  }
  
  const token = generateToken({ 
    username: response.attributes.username, 
    role: response.attributes.role 
  });

  return sendResponse(200, { 
    message: 'User logged in successfully',
    role: response.attributes.role, 
    token: `Bearer ${token}`
  });
}).use(httpJsonBodyParser())
  .use(validateLogin())
  .use(errorHandler());