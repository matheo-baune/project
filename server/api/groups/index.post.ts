import db from "~/server/db";

export default defineEventHandler(async (event) => {

    //create a new group
    const body = await readBody(event);
    const { name, members , background, createdBy } = body;
    if (!name ) {
        throw createError({ statusCode: 400, message: 'Name is required' });
    }
    try {
        // Insert the new group into the database
        const group = await db.query(
            'INSERT INTO groups (name, background, created_by) VALUES ($1, $2, $3) RETURNING *',
            [name, background, createdBy]
        );

        // insert the creator into the group_members table
        await db.query(
            'INSERT INTO group_members (user_id, group_id) VALUES ($1, $2)',
            [createdBy, group.rows[0].id]
        );

        // If members are provided, insert them into the group_members table
        if (members && members.length > 0) {
            for (const member of members) {
                await db.query(`INSERT INTO group_members (user_id, group_id) VALUES ($1, $2)`, [member.id, group.rows[0].id]);
            }
        }



        return {
            ...group.rows[0],
            members: members // Include the creator and other members
        };
    } catch (error) {
        console.error('Error creating group:', error);
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }

});