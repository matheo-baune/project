import db from "~/server/db";

async function getUserGroups(userId: string) {
    // Query to fetch groups where the user is a member
    const query = `
        SELECT g.id, g.name, g.description
        FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = $1
    `;

    try {
        const { rows } = await db.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error fetching user groups:', error);
        throw new Error('Database query failed');
    }

}

export default defineEventHandler(async (event) => {
    const userId = event.context.params?.id;
    if (!userId) {
        throw createError({ statusCode: 400, message: 'User ID is required' });
    }

    try {
        // Fetch the user's groups from the database
        // join the groups table with the user_id with group_members
        const userGroups = await getUserGroups(userId);

        if (userGroups.length === 0) {
        return { message: 'No groups found for this user' };
        }

        return { userGroups };
    } catch (error) {
        console.error('Error fetching user groups:', error);
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});