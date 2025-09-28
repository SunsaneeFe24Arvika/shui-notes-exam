import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { authenticateUser } from '../../../middlewares/authenticateUser.mjs';
import { authorizeRole } from '../../../middlewares/authorizeRole.mjs';
import { throwError } from '../../../utils/throwError.mjs';
import { validateNote } from '../../../middlewares/validateNote.mjs';
import { addNote } from '../../../services/notes.mjs';
import { generateId } from '../../../utils/uuid.mjs';

export const handler = middy(async (event) => {
    // Get authenticated user from middleware
    const { username, role } = event.user;
    
    // Create note object with authenticated user's data
    const noteData = {
        ...event.body,
        id: generateId(6),
        username: username, // Use authenticated user's username
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const result = await addNote(noteData);
    
    if (!result.success) {
        throwError(result.message || 'Failed to create note', 400);
    }
    
    return sendResponse(201, {
        success: true,
        message: 'Note created successfully!',
        note: result.note
    });
}).use(httpJsonBodyParser())
  .use(authenticateUser())
  .use(authorizeRole(['GUEST', 'ADMIN'])) // Both GUEST and ADMIN can create notes
  .use(validateNote())
  .use(errorHandler());