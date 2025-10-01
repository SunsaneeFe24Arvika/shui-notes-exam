import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { authenticateUser } from '../../../middlewares/authenticateUser.mjs';
import { throwError } from '../../../utils/throwError.mjs';
import { validateNote } from '../../../middlewares/validateNote.mjs';
import { addNote } from '../../../services/notes.mjs';
import { generateId } from '../../../utils/uuid.mjs';
import { formatDateForResponse } from '../../../utils/dateFormat.mjs';

export const handler = middy(async (event) => {
    // Get authenticated user from middleware (no more roles)
    const { username } = event.user;
    
    // Create complete note data object
    const noteData = {
        id: generateId(4), // Generate unique ID
        title: event.body.title,
        content: event.body.content,
        username: username,
        createdAt: formatDateForResponse(new Date()), // YYYY-MM-DD format
        updatedAt: formatDateForResponse(new Date())  // YYYY-MM-DD format
    };
    
    // Call addNote with complete note data
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
  .use(validateNote())
  .use(errorHandler());