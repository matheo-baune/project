import {query} from '@/server/db';

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    const {username, password} = body;

    if (!username || !password) {
        throw createError({statusCode: 400, statusMessage: 'Missing required fields'});
    }

    // Check if user exists
    const result = await query(
        'SELECT * FROM users WHERE username = $1 AND password = $2',
        [username, password]
    );

    if (result.rows.length === 0) {
        throw createError({statusCode: 401, statusMessage: 'Invalid username or password'});
    }

    // Return user data (excluding password)
    const user = result.rows[0];
    delete user.password;

    return user;

});