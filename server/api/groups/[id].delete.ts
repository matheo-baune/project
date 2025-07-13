import db from "~/server/db";

export default defineEventHandler(async (event) => {
    const groupId = event.context.params?.id;
    
    if (!groupId) {
        throw createError({ statusCode: 400, message: 'Group ID is required' });
    }

    const body = await readBody(event);
    const userId = body.userId; // The ID of the user making the request

    if (!userId) {
        throw createError({ statusCode: 400, message: 'User ID is required' });
    }

    try {
        // First, check if the group exists
        const checkGroup = await db.query('SELECT * FROM groups WHERE id = $1', [groupId]);
        
        if (checkGroup.rows.length === 0) {
            throw createError({ statusCode: 404, message: 'Group not found' });
        }

        // Check if the user is the creator of the group
        const group = checkGroup.rows[0];
        
        if (group.created_by !== userId) {
            throw createError({ statusCode: 403, message: 'Only the group creator can delete the group' });
        }

        // Delete the group (cascade will delete related records in group_members)
        await db.query('DELETE FROM groups WHERE id = $1', [groupId]);

        return { 
            success: true,
            message: 'Group deleted successfully' 
        };
    } catch (error) {
        console.error('Error deleting group:', error);
        throw createError({ 
            statusCode: error.statusCode || 500, 
            message: error.message || 'Internal Server Error' 
        });
    }
});