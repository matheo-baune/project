import {query} from '~/server/db';

export default defineEventHandler(async (event) => {
    try {
        const users = await query('SELECT * FROM users');
        if (users.rowCount === 0) {
            setResponseStatus(event, 404);
            return { error: 'No users found' };
        }
        //We don't need to return password
        users.rows.forEach(user => {
            delete user.password;
        });
        return users.rows;
    }catch (error:any) {
        console.error('Error fetching user:', error);
        setResponseStatus(event, 500);
        return { error: 'Internal Server Error' };
    }
});
