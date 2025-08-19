import { query } from '@/server/db';

export default defineEventHandler(async (event) => {
    // Get the event ID from the URL
    const eventId = event.context.params?.id;
    
    if (!eventId) {
        throw createError({ 
            statusCode: 400, 
            message: 'Event ID is required' 
        });
    }

    try {
        // Get the user ID from the query parameters or session
        const q = getQuery(event);
        const userId = q.userId as string | undefined;
        const isPublic = q.public === 'true';

        // For public view, we don't need authentication
        if (!isPublic && !userId) {
            throw createError({ 
                statusCode: 401, 
                message: 'User ID is required for non-public view' 
            });
        }

        // Get the event

        const eventResult = await query(
            `SELECT e.*, g.id as group_id
             FROM events e
             JOIN groups g ON e.group_id = g.id
             WHERE e.id = $1`,
            [eventId]
        );

        if (eventResult.rows.length === 0) {
            throw createError({ 
                statusCode: 404, 
                message: 'Event not found' 
            });
        }

        const eventData = eventResult.rows[0];

        // For non-public view, check if the user is a member of the group
        if (!isPublic && userId) {
            const memberCheck = await query(
                `SELECT * FROM group_members 
                 WHERE group_id = $1 AND user_id = $2`,
                [eventData.group_id, userId]
            );

            if (memberCheck.rows.length === 0) {
                throw createError({ 
                    statusCode: 403, 
                    message: 'Not authorized to view this event' 
                });
            }
        }

        // Format the response
        return {
            id: eventData.id.toString(),
            name: eventData.name,
            date: eventData.date,
            groupId: eventData.group_id.toString(),
            createdBy: eventData.created_by.toString(),
            targetPersonId: eventData.target_person_id ? eventData.target_person_id.toString() : undefined
        };
    } catch (error) {
        console.error('Error fetching event:', error);
        if ((error as any).statusCode) {
            throw error as any; // Re-throw validation errors
        }
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});