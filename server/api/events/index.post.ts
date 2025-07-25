import db from "~/server/db";

export default defineEventHandler(async (event) => {
    // Create a new event
    const body = await readBody(event);
    const { name, date, groupId, createdBy } = body;
    
    // Validate required fields
    if (!name || !date || !groupId || !createdBy) {
        throw createError({ 
            statusCode: 400, 
            message: 'Name, date, groupId, and createdBy are required' 
        });
    }

    try {
        // Check if the group exists and the user is a member
        const groupCheck = await db.query(
            `SELECT * FROM group_members 
             WHERE group_id = $1 AND user_id = $2`,
            [groupId, createdBy]
        );

        if (groupCheck.rows.length === 0) {
            throw createError({ 
                statusCode: 403, 
                message: 'Not authorized to create events for this group' 
            });
        }

        // Insert the new event into the database
        const result = await db.query(
            `INSERT INTO events (name, date, group_id, created_by) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [name, date, groupId, createdBy]
        );

        // Format the response
        const event = result.rows[0];
        return {
            id: event.id.toString(),
            name: event.name,
            date: event.date,
            groupId: event.group_id.toString(),
            createdBy: event.created_by.toString()
        };
    } catch (error) {
        console.error('Error creating event:', error);
        if (error.statusCode) {
            throw error; // Re-throw validation errors
        }
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});