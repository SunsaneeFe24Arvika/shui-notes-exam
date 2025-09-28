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

export const updateNote = async (noteId, updates) => {
    const timestamp = new Date().toISOString();
    
    const command = new UpdateItemCommand({
        TableName: 'shui-api',
        Key: marshall({
            PK: `NOTE#${noteId}`,
            SK: 'METADATA'
        }),
        UpdateExpression: 'SET #title = :title, #content = :content, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#title': 'title',
            '#content': 'content', 
            '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: marshall({
            ':title': updates.title,
            ':content': updates.content,
            ':updatedAt': timestamp
        }),
        ReturnValues: 'ALL_NEW'
    });

    try {
        const { Attributes } = await client.send(command);
        const updatedNote = unmarshall(Attributes);
        return { success: true, note: updatedNote };
    } catch (error) {
        console.log('ERROR in updateNote:', error.message);
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