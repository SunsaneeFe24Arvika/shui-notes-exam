import middy from '@middy/core';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { authenticateUser } from '../../../middlewares/authenticateUser.mjs';
import { throwError } from '../../../utils/throwError.mjs';
import { getAllNotes } from '../../../services/notes.mjs';

export const handler = middy(async (event) => {
    // Check if user wants their own notes or all notes
    const { username } = event.queryStringParameters || {};
    const requestedUsername = username || null; // Get all notes if no username specified

    const result = await getAllNotes(requestedUsername);

    if (!result.success) {
        throwError(result.message || 'Failed to retrieve notes', 400);
    }

    const { notes } = result;

    if (!notes || notes.length === 0) {
        return sendResponse(200, {
            success: true,
            message: requestedUsername 
                ? `No notes found for user ${requestedUsername}` 
                : 'No notes found',
            notes: [],
            count: 0
        });
    }

    return sendResponse(200, {
        success: true,
        message: `Found ${notes.length} notes`,
        notes: notes,
        count: notes.length
    });

}).use(authenticateUser())
  .use(errorHandler());