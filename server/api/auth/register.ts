import { query } from '@/server/db';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { firstname, lastname, username, email, password, avatar } = body;

    // Validate required fields
    if (!firstname || !lastname || !username || !email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields'
        });
    }

    try {
        // Check if username or email already exists
        const existingUser = await query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Username or email already exists'
            });
        }

        // Insert new user
        const result = await query(
            'INSERT INTO users (firstname, lastname, username, email, password, avatar, is_admin, created_at) VALUES' +
            ' ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [firstname, lastname, username, email, password, avatar, false, new Date().toISOString()]
        );

        if (result.rows.length === 0) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create user'
            });
        }

        // Return user data (excluding password)
        const user = result.rows[0];
        delete user.password;

        return user;
    } catch (error: any) {
        // If it's already a handled error, rethrow it
        if (error.statusCode) {
            throw error;
        }

        console.error('Registration error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'An error occurred during registration'
        });
    }
});