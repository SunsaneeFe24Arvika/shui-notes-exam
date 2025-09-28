import { client } from "./client.mjs";
import { PutItemCommand, GetItemCommand, QueryCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const addNote = async (noteData) => {
    const command = new PutItemCommand({
        TableName: 'shui-api',
        Item: marshall({
            PK: `NOTE#${noteData.id}`,
            SK: 'METADATA',
            id: noteData.id,
            title: noteData.title,
            content: noteData.content,
            username: noteData.username || 'anonymous',
            createdAt: noteData.createdAt,
            updatedAt: noteData.updatedAt,
            GSI1PK: `USER#${noteData.username || 'anonymous'}`,
            GSI1SK: `NOTE#${noteData.createdAt}`
        })
    });

    try {
        await client.send(command);
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
        console.log('ERROR in addNote:', error.message);
        return { success: false, message: error.message };
    }
};

export const getNoteById = async (noteId) => {
    const command = new GetItemCommand({
        TableName: 'shui-api',
        Key: marshall({
            PK: `NOTE#${noteId}`,
            SK: 'METADATA'
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
        console.log('ERROR in getNote:', error.message);
        return { success: false, message: error.message };
    }
};

export const getAllNotes = async (username = null) => {
    let command;
    
    if (username) {
        // Get notes for specific user using GSI
        command = new QueryCommand({
            TableName: 'shui-api',
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1PK = :pk',
            ExpressionAttributeValues: marshall({
                ':pk': `USER#${username}`
            }),
            ScanIndexForward: false // Most recent first
        });
    } else {
        // Get all notes using Scan with filter
        command = new ScanCommand({
            TableName: 'shui-api',
            FilterExpression: 'begins_with(PK, :pk) AND SK = :sk',
            ExpressionAttributeValues: marshall({
                ':pk': 'NOTE#',
                ':sk': 'METADATA'
            })
        });
    }

    try {
        const { Items } = await client.send(command);
        
        if (!Items || Items.length === 0) {
            return { success: true, notes: [] };
        }

        // Convert DynamoDB items to regular objects and sort by createdAt
        const notes = Items
            .map(item => unmarshall(item))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Most recent first

        return { success: true, notes };
    } catch (error) {
        console.log('ERROR in getAllNotes:', error.message);
        return { success: false, message: error.message };
    }
};

export const updateNoteById = async (noteId, updates, requestingUsername) => {
    // First, get the existing note to check ownership
    const existingNote = await getNoteById(noteId);
    
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
        updateExpression += ', #title = :title';
        expressionAttributeNames['#title'] = 'title';
        expressionAttributeValues[':title'] = updates.title;
    }

    if (updates.content) {
        updateExpression += ', #content = :content';
        expressionAttributeNames['#content'] = 'content';
        expressionAttributeValues[':content'] = updates.content;
    }

    const command = new UpdateItemCommand({
        TableName: 'shui-api',
        Key: marshall({
            PK: `NOTE#${noteId}`,
            SK: 'METADATA'
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

export const deleteNote = async (noteId) => {
    const command = new DeleteItemCommand({
        TableName: 'shui-api',
        Key: marshall({
            PK: `NOTE#${noteId}`,
            SK: 'METADATA'
        })
    });

    try {
        await client.send(command);
        return { success: true, message: 'Note deleted successfully' };
    } catch (error) {
        console.log('ERROR in deleteNote:', error.message);
        return { success: false, message: error.message };
    }
};


export const deleteNoteById = async (noteId, requestingUsername) => {
    // Kontrollera om note finns
    const existingNote = await getNoteById(noteId);
    
    if (!existingNote.success) {
        return existingNote; // returnera om note inte finns
    }

    // Kontrollera om user har behörighet att radera - Det ska bara ägaren få radera
    if (existingNote.note.username !== requestingUsername) {
        return { success: false, message: 'Unauthorized' };
    }

    
    const command = new DeleteItemCommand({
        TableName: 'shui-api',
        Key: marshall({
            PK: `NOTE#${noteId}`,
            SK: 'METADATA'
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