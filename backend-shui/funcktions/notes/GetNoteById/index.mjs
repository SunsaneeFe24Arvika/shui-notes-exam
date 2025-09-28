import middy from '@middy/core';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { authenticateUser } from '../../../middlewares/authenticateUser.mjs';
import { throwError } from '../../../utils/throwError.mjs';
import { findNoteById } from '../../../services/notes.mjs';

export const handler = middy(async (event) => {
    // Get the note ID from path parameters
    const { id } = event.pathParameters || {};

    if (!id) {
        throwError('Note ID is required', 400);
    }

    // Get the note from database using findNoteById (works with just ID)
    const result = await findNoteById(id);

    if (!result.success) {
        if (result.message === 'Note not found') {
            return sendResponse(404, {
                success: false,
                message: `Note with ID ${id} not found`
            });
        }
        throwError(result.message || 'Failed to retrieve note', 500);
    }

    return sendResponse(200, {
        success: true,
        message: 'Note retrieved successfully',
        note: result.note
    });

}).use(authenticateUser())
  .use(errorHandler());