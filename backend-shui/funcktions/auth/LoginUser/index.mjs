import { throwError } from '../../../utils/throwError.mjs';
import { generateToken } from '../../../utils/jwt.mjs';
import { verifyPassword } from '../../../utils/bcrypt.mjs';

export const handler = middy(async (event) => {
    const response = await getUserfromRegister(event.body.username);
    if(response) {
        if(await verifyPassword(event.body.password, response.attributes.password)) {
            const token = generateToken({ username : response.attributes.username, role : response.attributes.role });

            return sendResponse(200, {
                message : 'User logged in successfully!',
                role : response.attributes.role,
                token : `Bearer ${token}`
            });
        } else {
            return throwError(400, { message : "Wrong password!" });
        } 
    } else {
        return throwError(404, { message : "User not found!" });
        }

    }).use(httpJsonBodyParser())
      .use(validateLogin())
      .use(errorHandler());