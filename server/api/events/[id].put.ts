import db from "~/server/db";

export default defineEventHandler(async (event) => {
    // Get the event ID from the URL
    const eventId = event.context.params?.id;
    
    if (!eventId) {
        throw createError({ 
            statusCode: 400, 
            message: 'Event ID is required' 
        });
    }

    // Get the request body
    const body = await readBody(event);
    const { name, date, userId } = body;
    
    // Validate required fields
    if (!name || !date || !userId) {
        throw createError({ 
            statusCode: 400, 
            message: 'Name, date, and userId are required' 
        });
    }

    try {
        // Check if the event exists
        const eventCheck = await db.query(
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
        if (eventData.created_by.toString() !== userId.toString()) {
            throw createError({ 
                statusCode: 403, 
                message: 'Not authorized to update this event' 
            });
        }

        // Update the event
        const result = await db.query(
            `UPDATE events 
             SET name = $1, date = $2
             WHERE id = $3
             RETURNING *`,
            [name, date, eventId]
        );

        // Format the response
        const updatedEvent = result.rows[0];
        return {
            id: updatedEvent.id.toString(),
            name: updatedEvent.name,
            date: updatedEvent.date,
            groupId: updatedEvent.group_id.toString(),
            createdBy: updatedEvent.created_by.toString()
        };
    } catch (error) {
        console.error('Error updating event:', error);
        if (error.statusCode) {
            throw error; // Re-throw validation errors
        }
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});