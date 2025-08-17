import {query} from '@/server/db';

export default defineEventHandler(async (event) => {
    // Get the event ID from the URL
    const eventId = event.context.params?.id;
    
    if (!eventId) {
        throw createError({ 
            statusCode: 400, 
            message: 'Event ID is required' 
        });
    }

    // Get the user ID from the query parameters
    const queryData = getQuery(event);
    const userId = queryData.userId as string;

    if (!userId) {
        throw createError({ 
            statusCode: 400, 
            message: 'User ID is required' 
        });
    }

    try {
        // Check if the event exists
        const eventCheck = await query(
            'SELECT * FROM events WHERE id = $1',
            [eventId]
        );

        if (eventCheck.rows.length === 0) {
            throw createError({ 
                statusCode: 404, 
                message: 'Event not found' 
            });
        }

        const eventData = eventCheck.rows[0];

        // Check if the user is the creator of the event
        if (eventData.createdBy.toString() !== userId.toString()) {
            throw createError({ 
                statusCode: 403, 
                message: 'Not authorized to delete this event' 
            });
        }

        // Delete the event
        await query(
            'DELETE FROM events WHERE id = $1',
            [eventId]
        );

        return { 
            success: true,
            message: 'Event deleted successfully' 
        };
    } catch (error) {
        console.error('Error deleting event:', error);
        if (error.statusCode) {
            throw error; // Re-throw validation errors
        }
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});