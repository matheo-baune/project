import {query} from "~/server/db";

export default defineEventHandler(async (event) => {
    try {
        const events = await query('SELECT * FROM events ORDER BY created_at DESC');
        return events.rows;
    } catch (error: any) {
        console.error('Error fetching events:', error);
        setResponseStatus(event, 500);
        return { error: 'Internal Server Error' };
    }
});