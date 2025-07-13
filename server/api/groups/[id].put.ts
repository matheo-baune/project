import db from "~/server/db";

export default defineEventHandler(async (event) => {
    const groupId = event.context.params?.id;
    
    if (!groupId) {
        throw createError({ statusCode: 400, message: 'Group ID is required' });
    }

    const body = await readBody(event);
    const { name, background, members } = body;

    // Validate required fields
    if (!name) {
        throw createError({ statusCode: 400, message: 'Name is required' });
    }

    try {
        // First, check if the group exists
        const checkGroup = await db.query('SELECT * FROM groups WHERE id = $1', [groupId]);
        
        if (checkGroup.rows.length === 0) {
            throw createError({ statusCode: 404, message: 'Group not found' });
        }

        // Check if the user is the creator of the group
        const group = checkGroup.rows[0];
        const userId = body.userId; // The ID of the user making the request
        
        if (group.created_by !== userId) {
            throw createError({ statusCode: 403, message: 'Only the group creator can update the group' });
        }

        // Update the group
        const updateQuery = `
            UPDATE groups 
            SET name = $1, background = $2
            WHERE id = $3
            RETURNING *
        `;
        
        const updateResult = await db.query(updateQuery, [name, background, groupId]);
        const updatedGroup = updateResult.rows[0];

        // If members are provided, update the group members
        if (members && Array.isArray(members)) {
            // First, remove all existing members except the creator
            await db.query(
                'DELETE FROM group_members WHERE group_id = $1 AND user_id != $2',
                [groupId, userId]
            );

            // Then, add the new members
            for (const member of members) {
                // Skip if the member is the creator (already in the group)
                if (member.id === userId) continue;
                
                // Check if the user exists
                const userExists = await db.query('SELECT id FROM users WHERE id = $1', [member.id]);
                
                if (userExists.rows.length > 0) {
                    await db.query(
                        'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                        [groupId, member.id]
                    );
                }
            }
        }

        // Fetch the updated members
        const membersQuery = `
            SELECT u.id, u.name, u.username, u.avatar
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = $1
        `;
        
        const membersResult = await db.query(membersQuery, [groupId]);
        const updatedMembers = membersResult.rows;

        // Return the updated group with its members
        return {
            ...updatedGroup,
            members: updatedMembers
        };
    } catch (error) {
        console.error('Error updating group:', error);
        throw createError({ 
            statusCode: error.statusCode || 500, 
            message: error.message || 'Internal Server Error' 
        });
    }
});