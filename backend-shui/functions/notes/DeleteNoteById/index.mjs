import middy from '@middy/core';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { authenticateUser } from '../../../middlewares/authenticateUser.mjs';
import { throwError } from '../../../utils/throwError.mjs';
import { deleteNoteById } from '../../../services/notes.mjs';

export const handler = middy(async (event) => {
    // Get noteId from path parameters
    const { id } = event.pathParameters || {};

    if (!id) {
        throwError('Note ID is required', 400);
    }

    // Get authenticated user information
    const { username } = event.user;

    // Delete note with ownership check
    const result = await deleteNoteById(id, username);

    if (!result.success) {
        if (result.message === 'Note not found') {
            return sendResponse(404, {
                success: false,
                message: `Note with ID ${id} not found`
            });
        }
        if (result.message === 'Unauthorized') {
            throwError('You can only delete your own notes', 403);
        }
        throwError(result.message || 'Failed to delete note', 500);
    }

    return sendResponse(200, {
        success: true,
        message: result.message || 'Note deleted successfully'
    });

}).use(authenticateUser())
  .use(errorHandler());