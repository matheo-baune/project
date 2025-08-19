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

        // Get all events for the group with aggregated members and whether the current user is invited
        const result = await db.query(
            `SELECT 
                e.*, 
                EXISTS (
                  SELECT 1 FROM event_members em2 
                  WHERE em2.event_id = e.id AND em2.user_id = $2
                ) AS is_invited,
                COALESCE(
                  json_agg(
                    DISTINCT jsonb_build_object(
                      'id', u.id,
                      'firstname', u.firstname,
                      'lastname', u.lastname,
                      'avatar', u.avatar,
                      'isTarget', em.is_target
                    )
                  ) FILTER (WHERE u.id IS NOT NULL), '[]'::json
                ) AS members
             FROM events e
             LEFT JOIN event_members em ON em.event_id = e.id
             LEFT JOIN users u ON u.id = em.user_id
             WHERE e.group_id = $1 
             GROUP BY e.id, e.name, e.date, e.background, e.description, e.group_id, e.created_by, e.created_at
             ORDER BY e.date ASC`,
            [groupId, userId]
        );

        // Format the response (return a single entry per event)
        return result.rows.map(row => ({
            id: row.id.toString(),
            name: row.name,
            date: row.date,
            background: row.background,
            description: row.description,
            groupId: row.group_id.toString(),
            createdBy: row.created_by.toString(),
            isInvited: row.is_invited,
            members: row.members
        }));
    } catch (error : any) {
        console.error('Error fetching events for group:', error);
        if (error.statusCode) {
            throw error; // Re-throw validation errors
        }
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});