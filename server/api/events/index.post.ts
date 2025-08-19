import db from "~/server/db";

export default defineEventHandler(async (event) => {
    // Create a new event
    const body = await readBody(event);
    const { name, date, groupId, createdBy, background, members } = body;
    
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
        const resultEvent = await db.query(
            `INSERT INTO events (name, date, group_id, created_by, background) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [name, date, groupId, createdBy, background]
        );


        //Create link between members and event
        for (const member of members) {
            await db.query(`INSERT INTO event_members (event_id, user_id, is_target) VALUES ($1, $2, $3)`, [resultEvent.rows[0].id, member.id, member.isTarget]);
        }


        const eventCreated = resultEvent.rows[0];

        // Enrich members with basic user info
        const memberIds = (members || []).map((m: any) => parseInt(m.id, 10)).filter((n: number) => !isNaN(n))
        let enrichedMembers: any[] = []
        if (memberIds.length) {
            const usersRes = await db.query(
                `SELECT id, firstname, lastname, avatar FROM users WHERE id = ANY($1::int[])`,
                [memberIds]
            )
            const targetMap = new Map<string, boolean>(members.map((m: any) => [String(m.id), !!m.isTarget]))
            enrichedMembers = usersRes.rows.map((u: any) => ({
                id: u.id.toString(),
                firstname: u.firstname,
                lastname: u.lastname,
                avatar: u.avatar || undefined,
                isTarget: !!targetMap.get(u.id.toString())
            }))
        }

        // Format the response
        return {
            id: eventCreated.id.toString(),
            name: eventCreated.name,
            date: eventCreated.date,
            groupId: eventCreated.group_id.toString(),
            createdBy: eventCreated.created_by.toString(),
            background: eventCreated.background,
            members: enrichedMembers
        };
    } catch (error) {
        console.error('Error creating event:', error);
        if ((error as any).statusCode) {
            throw error as any; // Re-throw validation errors
        }
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});