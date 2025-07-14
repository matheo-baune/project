import db from "~/server/db";

export default defineEventHandler(async (event) => {
    const groupId = event.context.params?.id;
    
    if (!groupId) {
        throw createError({ statusCode: 400, message: 'Group ID is required' });
    }

    try {
        // Query to fetch the group details
        const groupQuery = `
            SELECT id, name, background, created_by, created_at
            FROM groups
            WHERE id = $1
        `;
        
        const groupResult = await db.query(groupQuery, [groupId]);
        
        if (groupResult.rows.length === 0) {
            throw createError({ statusCode: 404, message: 'Group not found' });
        }
        
        const group = groupResult.rows[0];
        
        // Query to fetch the group members
        const membersQuery = `
            SELECT u.id, u.lastname, u.firstname, u.email, u.username
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = $1
        `;
        
        const membersResult = await db.query(membersQuery, [groupId]);
        const members = membersResult.rows;

        // Return the group with its members
        return {
            ...group,
            members
        };
    } catch (error:any) {
        console.error('Error fetching group:', error);
        throw createError({ 
            statusCode: error.statusCode || 500, 
            message: error.message || 'Internal Server Error' 
        });
    }
});