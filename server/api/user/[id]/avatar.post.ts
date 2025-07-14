import {query} from "~/server/db";

export default defineEventHandler(async (event) => {
    const userId = event.context.params?.id;
    if (!userId) {
        throw createError({ statusCode: 400, message: 'User ID is required' });
    }

    const {avatar} = await readBody(event);

    try {
        // Update user avatar in the database
        await query('UPDATE users SET avatar = $1 WHERE id = $2', [avatar, userId]);

        return { success: true, avatar };
    } catch (error: any) {
        console.error('Error uploading avatar:', error);
        setResponseStatus(event, 500);
        return { error: 'Internal Server Error' };
    }
})