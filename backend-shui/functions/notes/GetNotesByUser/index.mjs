import middy from '@middy/core';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { authenticateUser } from '../../../middlewares/authenticateUser.mjs';
import { throwError } from '../../../utils/throwError.mjs';
import { getSortedNotesForUser } from '../../../services/notes.mjs';

export const handler = middy(async (event) => {
    // Hämta användarnamn från URL eller autentisering
    const requestedUsername = event.pathParameters?.username;
    const { username: authenticatedUsername } = event.user;
    
    // Säkerhetskontroll: användare kan bara hämta sina egna anteckningar
    if (requestedUsername !== authenticatedUsername) {
        throwError(403, 'You can only access your own notes');
    }
    
    // Hämta query parameters för sortering
    const queryParams = event.queryStringParameters || {};
    const sortBy = queryParams.sortBy || 'createdAt';
    const sortOrder = queryParams.sortOrder || 'desc';
    
    // Validera sortBy parameter
    const validSortFields = ['title', 'createdAt', 'updatedAt', 'content'];
    if (!validSortFields.includes(sortBy)) {
        throwError(400, `Invalid sortBy parameter. Must be one of: ${validSortFields.join(', ')}`);
    }
    
    // Validera sortOrder parameter
    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) {
        throwError(400, `Invalid sortOrder parameter. Must be one of: ${validSortOrders.join(', ')}`);
    }
    
    console.log(`Getting notes for user: ${username}, sortBy: ${sortBy}, order: ${sortOrder}`);
    
    // Hämta och sortera anteckningar för användaren
    const result = await getSortedNotesForUser(username, sortBy, sortOrder);
    
    if (!result.success) {
        throwError(500, result.message);
    }
    
    return sendResponse(200, {
        success: true,
        notes: result.notes,
        count: result.notes.length,
        sortBy,
        sortOrder
    });
})
.use(authenticateUser)
.use(errorHandler);