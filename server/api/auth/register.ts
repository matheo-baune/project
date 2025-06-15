import {query} from '@/server/db';

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    const {name, username, password} = body;

    if (!username || !password || !name) {
        throw createError({statusCode: 400, statusMessage: 'Missing required fields'});
    }

    // Check if user already exists
    const existingUser = await query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    if (existingUser.rows.length > 0) {
        throw createError({statusCode: 409, statusMessage: 'Username already exists'});
    }
    // Insert new user
    const result = await query(
        'INSERT INTO users (name,username, password) VALUES ($1, $2, $3) RETURNING *',
        [name, username, password]
    );

    // Return new user data (excluding password)
    const newUser = result.rows[0];
    delete newUser.password;
    return newUser;
});