import { query } from "~/server/db";

export default defineEventHandler(async (event) => {
  try {
    const gifts = await query('SELECT * FROM gifts ORDER BY created_at DESC');
    // No need for manual conversion - middleware will handle it
    return gifts.rows;
  } catch (error: any) {
    console.error('Error fetching gifts:', error);
    setResponseStatus(event, 500);
    return { error: 'Internal Server Error' };
  }
});
