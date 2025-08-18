import db from "~/server/db";

export default defineEventHandler(async (event) => {
    // Create a new event
    const body = await readBody(event);
    const { name, date, groupId, createdBy, scope, targetPersonId } = body;
    
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

        const created = result.rows[0];

        // Ensure event_settings table exists
        await db.query(
            `CREATE TABLE IF NOT EXISTS event_settings (
               event_id BIGINT PRIMARY KEY,
               scope VARCHAR(16) DEFAULT 'multiple',
               target_person_id BIGINT NULL
             )`
        );

        // Upsert settings if provided
        if (scope || targetPersonId) {
            await db.query(
              `INSERT INTO event_settings (event_id, scope, target_person_id)
               VALUES ($1, $2, $3)
               ON CONFLICT (event_id) DO UPDATE SET scope = EXCLUDED.scope, target_person_id = EXCLUDED.target_person_id`,
              [created.id, scope || 'multiple', targetPersonId || null]
            );
        }

        // Format the response
        return {
            id: created.id.toString(),
            name: created.name,
            date: created.date,
            groupId: created.group_id.toString(),
            createdBy: created.created_by.toString(),
            scope: scope || 'multiple',
            targetPersonId: targetPersonId ? targetPersonId.toString() : undefined
        };
    } catch (error) {
        console.error('Error creating event:', error);
        if ((error as any).statusCode) {
            throw error as any; // Re-throw validation errors
        }
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});