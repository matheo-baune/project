import db from "~/server/db";

async function getUserGroupsWithMembers(userId: string) {
    // Récupère les groupes où l'utilisateur est membre
    const groupQuery = `
        SELECT g.id, g.name, g.background, g.created_by, g.created_at
        FROM groups g
                 JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = $1
    `;
    const { rows: groups } = await db.query(groupQuery, [userId]);

    // Pour chaque groupe, récupère les membres
    const groupList = [];
    for (const group of groups) {
        const memberQuery = `
            SELECT u.id, u.firstname, u.lastname, u.email, u.avatar
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = $1
        `;
        const { rows: members } = await db.query(memberQuery, [group.id]);
        groupList.push({
            ...group,
            members
        });
    }
    return groupList;
}

export default defineEventHandler(async (event) => {
    const userId = event.context.params?.id;
    if (!userId) {
        throw createError({ statusCode: 400, message: 'User ID is required' });
    }

    try {
        const userGroups = await getUserGroupsWithMembers(userId);
        if (userGroups.length === 0) {
            return { message: 'No groups found for this user' };
        }
        return { userGroups };
    } catch (error) {
        console.error('Error fetching user groups:', error);
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});