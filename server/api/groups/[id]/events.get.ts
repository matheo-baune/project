import db from "~/server/db";

export default defineEventHandler(async (event) => {
    // Get the group ID from the URL
    const groupId = event.context.params?.id;
    
    if (!groupId) {
        throw createError({ 
            statusCode: 400, 
            message: 'Group ID is required' 
        });
    }

    try {
        // Get the user ID from the query parameters or session
        const query = getQuery(event);
        const userId = query.userId;

        if (!userId) {
            throw createError({ 
                statusCode: 401, 
                message: 'User ID is required' 
            });
        }

        // Check if the user is a member of the group
        const memberCheck = await db.query(
            `SELECT * FROM group_members 
             WHERE group_id = $1 AND user_id = $2`,
            [groupId, userId]
        );

        if (memberCheck.rows.length === 0) {
            throw createError({ 
                statusCode: 403, 
                message: 'Not authorized to view events for this group' 
            });
        }

        // Get all events for the group
        const result = await db.query(
            `SELECT * FROM events 
             WHERE group_id = $1 
             ORDER BY date ASC`,
            [groupId]
        );

        // Format the response
        const events = result.rows.map(event => ({
            id: event.id.toString(),
            name: event.name,
            date: event.date,
            groupId: event.group_id.toString(),
            createdBy: event.created_by.toString()
        }));

        return events;
    } catch (error) {
        console.error('Error fetching events for group:', error);
        if (error.statusCode) {
            throw error; // Re-throw validation errors
        }
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});