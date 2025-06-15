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
        const result = await db.query(
            'INSERT INTO groups (name, background, created_by) VALUES ($1, $2, $3) RETURNING *',
            [name, background, createdBy]
        );

        // insert the creator into the group_members table
        await db.query(
            'INSERT INTO group_members (user_id, group_id) VALUES ($1, $2)',
            [createdBy, result.rows[0].id]
        );

        // If members are provided, insert them into the group_members table
        if (members && members.length > 0) {
            const memberValues = members.map(member => `('${member}', ${result.rows[0].id})`).join(',');
            await db.query(`INSERT INTO group_members (user_id, group_id) VALUES ${memberValues}`);
        }

        if (result.rows.length === 0) {
            throw createError({ statusCode: 500, message: 'Failed to create group' });
        }


        return {
            ...result.rows[0],
            members: members // Include the creator and other members
        };
    } catch (error) {
        console.error('Error creating group:', error);
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }

});