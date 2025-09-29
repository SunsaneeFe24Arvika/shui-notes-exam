import { client } from "./client.mjs";
import { PutItemCommand, GetItemCommand, QueryCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";


export const addNote = async (noteData) => {
    const command = new PutItemCommand({
        TableName: 'shui-api',
        Item: marshall({
            PK: noteData.username,        // Username as partition key
            SK: `NOTE#${noteData.id}`,    // Note ID as sort key
            id: noteData.id,
            title: noteData.title,
            content: noteData.content,
            username: noteData.username,
            createdAt: noteData.createdAt,
            updatedAt: noteData.updatedAt,
            // GSI för att söka efter titel och sortera efter datum
            GSI1PK: noteData.title,       // Title as GSI partition key
            GSI1SK: noteData.createdAt    // CreatedAt as GSI sort key
        })
    });

    try {
        // Skickar kommandot till databasen
        await client.send(command);

        // Returnerar bekräftelse och anteckningen
        return {
            success: true,
            note: {
                id: noteData.id,
                title: noteData.title,
                content: noteData.content,
                username: noteData.username,
                createdAt: noteData.createdAt,
                updatedAt: noteData.updatedAt
            }
        };
    } catch (error) {
        // Loggar fel om något går snett
        console.error("ERROR in addNote:", error.message);
        return { success: false, message: error.message };
    }
};

// Funktion som söker anteckningar baserat på titel (använder GSI)
export const getNotesByTitle = async (title) => {
    const command = new QueryCommand({
        TableName: 'shui-api',
        IndexName: 'GSI1', // Du behöver skapa detta GSI index
        KeyConditionExpression: 'GSI1PK = :title',
        ExpressionAttributeValues: marshall({
            ':title': title
        }),
        ScanIndexForward: false // Nyaste först (baserat på createdAt)
    });

    try {
        const { Items } = await client.send(command);
        
        if (!Items || Items.length === 0) {
            return { success: true, notes: [] };
        }

        const notes = Items.map(item => unmarshall(item));
        return { success: true, notes };
    } catch (error) {
        console.log('ERROR in getNotesByTitle:', error.message);
        return { success: false, message: error.message };
    }
};

// Funktion som söker anteckningar med partiell titel (innehåller sökterm)
export const searchNotesByTitle = async (searchTerm) => {
    const command = new QueryCommand({
        TableName: 'shui-api',
        FilterExpression: 'begins_with(SK, :sk) AND contains(#title, :searchTerm)',
        ExpressionAttributeNames: {
            '#title': 'title'
        },
        ExpressionAttributeValues: marshall({
            ':sk': 'NOTE#',
            ':searchTerm': searchTerm
        })
    });

    try {
        const { Items } = await client.send(command);
        
        if (!Items || Items.length === 0) {
            return { success: true, notes: [] };
        }

        const notes = Items
            .map(item => unmarshall(item))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
        return { success: true, notes };
    } catch (error) {
        console.log('ERROR in searchNotesByTitle:', error.message);
        return { success: false, message: error.message };
    }
};

// Funktion som hämtar en anteckning med username och noteId
export const getNoteById = async (username, noteId) => {
    const command = new GetItemCommand({
        TableName: 'shui-api',
        Key: marshall({
            PK: username,              // Username as partition key
            SK: `NOTE#${noteId}`       // Note ID as sort key
        })
    });

    try {
        const { Item } = await client.send(command);
        if (!Item) {
            return { success: false, message: 'Note not found' };
        }

        const note = unmarshall(Item);
        return { success: true, note };
    } catch (error) {
        console.log('ERROR in getNoteById:', error.message);
        return { success: false, message: error.message };
    }
};

// Funktion som hittar en anteckning när vi bara har noteId (använder GSI för effektivitet)
export const findNoteById = async (noteId) => {
    console.log('Looking for noteId:', noteId);
    
    const command = new ScanCommand({
        TableName: 'shui-api',
        FilterExpression: 'id = :noteId',
        ExpressionAttributeValues: marshall({
            ':noteId': noteId
        })
    });

    try {
        const { Items } = await client.send(command);
        console.log('Scan returned items:', Items?.length || 0);
        
        if (!Items || Items.length === 0) {
            return { success: false, message: 'Note not found' };
        }

        const note = unmarshall(Items[0]);
        console.log('Found note:', note.id, 'by user:', note.username);
        return { success: true, note };
    } catch (error) {
        console.log('ERROR in findNoteById:', error.message);
        return { success: false, message: error.message };
    }
};

// Funktion som hämtar alla anteckningar
// Om ett username skickas med - hämta bara den användarens anteckningar
export const getAllNotes = async (username = null) => {
    console.log('getAllNotes called with username:', username);
    let command;
    
    if (username) {
        // Mycket effektiv: Hämta alla anteckningar för en användare med Query
        console.log('Using QueryCommand for specific user:', username);
        command = new QueryCommand({
            TableName: 'shui-api',
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
            ExpressionAttributeValues: marshall({
                ':pk': username,
                ':sk': 'NOTE#'
            }),
            ScanIndexForward: false // Newest first
        });
    } else {
        // Hämta alla anteckningar från alla användare med Scan
        console.log('Using ScanCommand for all notes');
        command = new ScanCommand({
            TableName: 'shui-api',
            FilterExpression: 'begins_with(SK, :sk)',
            ExpressionAttributeValues: marshall({
                ':sk': 'NOTE#'
            })
        });
    }

    try {
        const { Items } = await client.send(command);
        console.log('DynamoDB returned items:', Items?.length || 0);
        
        if (!Items || Items.length === 0) {
            console.log('No items found in database');
            return { success: true, notes: [] };
        }

        // Convert DynamoDB items to regular objects and sort by createdAt
        const notes = Items
            .map(item => {
                const note = unmarshall(item);
                console.log('Processing note:', note.id, 'by user:', note.username);
                return note;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Most recent first

        console.log('Returning', notes.length, 'notes');
        return { success: true, notes };
    } catch (error) {
        console.log('ERROR in getAllNotes:', error.message);
        return { success: false, message: error.message };
    }
};

export const updateNoteById = async (noteId, updates, requestingUsername) => {
    // First, get the existing note to check ownership
    const existingNote = await findNoteById(noteId); // Use findNoteById since we don't have username
    
    if (!existingNote.success) {
        return existingNote; // Return the error (note not found)
    }

    // Check if the requesting user owns this note
    if (existingNote.note.username !== requestingUsername) {
        return { success: false, message: 'Unauthorized' };
    }

    const timestamp = new Date().toISOString();
    
    // Build dynamic update expression based on provided fields
    let updateExpression = 'SET #updatedAt = :updatedAt';
    const expressionAttributeNames = { '#updatedAt': 'updatedAt' };
    const expressionAttributeValues = { ':updatedAt': timestamp };

    if (updates.title) {
        updateExpression += ', #title = :title, #gsi1pk = :gsi1pk';
        expressionAttributeNames['#title'] = 'title';
        expressionAttributeNames['#gsi1pk'] = 'GSI1PK';
        expressionAttributeValues[':title'] = updates.title;
        expressionAttributeValues[':gsi1pk'] = updates.title; // Update GSI1PK with new title
    }

    if (updates.content) {
        updateExpression += ', #content = :content';
        expressionAttributeNames['#content'] = 'content';
        expressionAttributeValues[':content'] = updates.content;
    }

    const command = new UpdateItemCommand({
        TableName: 'shui-api',
        Key: marshall({
            PK: existingNote.note.username,  // Use the note's username
            SK: `NOTE#${noteId}`            // Use the noteId
        }),
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
        ReturnValues: 'ALL_NEW'
    });

    try {
        const { Attributes } = await client.send(command);
        const updatedNote = unmarshall(Attributes);
        return { success: true, note: updatedNote };
    } catch (error) {
        console.log('ERROR in updateNoteById:', error.message);
        return { success: false, message: error.message };
    }
};



// Secure delete with ownership check only
export const deleteNoteById = async (noteId, requestingUsername) => {
    // First, get the existing note to check if it exists
    const existingNote = await findNoteById(noteId); // Use findNoteById since we don't have username
    
    if (!existingNote.success) {
        return existingNote; // Return the error (note not found)
    }

    // Authorization check: Users can only delete their own notes
    const isOwner = existingNote.note.username === requestingUsername;
    
    if (!isOwner) {
        return { success: false, message: 'Unauthorized' };
    }

    // If authorized, delete the note
    const command = new DeleteItemCommand({
        TableName: 'shui-api',
        Key: marshall({
            PK: existingNote.note.username, // Use the note's username
            SK: `NOTE#${noteId}`           // Use the noteId
        })
    });

    try {
        await client.send(command);
        return { success: true, message: 'Note deleted successfully' };
    } catch (error) {
        console.log('ERROR in deleteNoteById:', error.message);
        return { success: false, message: error.message };
    }
};