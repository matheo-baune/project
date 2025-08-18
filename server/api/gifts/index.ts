import { query } from "~/server/db";

export default defineEventHandler(async (event) => {
  try {
    const q = getQuery(event) as Record<string, string | undefined>
    const eventId = q.eventId
    const userId = q.userId
    const isPublic = q.public === 'true' || (!q.userId && !!q.eventId)

    if (eventId) {
      // If not public, verify membership of the event's group
      if (!isPublic) {
        if (!userId) {
          throw createError({ statusCode: 401, message: 'User ID is required' })
        }
        const memCheck = await query(
          `SELECT gm.* FROM group_members gm
           JOIN events e ON e.group_id = gm.group_id
           WHERE e.id = $1 AND gm.user_id = $2`,
          [eventId, userId]
        )
        if (memCheck.rows.length === 0) {
          throw createError({ statusCode: 403, message: 'Not authorized to view gifts for this event' })
        }
      }

      const res = await query(
        'SELECT * FROM gifts WHERE event_id = $1 ORDER BY created_at DESC',
        [eventId]
      )
      return res.rows
    }

    // No event filter: return all gifts (used by admin stats)
    const gifts = await query('SELECT * FROM gifts ORDER BY created_at DESC')
    return gifts.rows
  } catch (error: any) {
    console.error('Error fetching gifts:', error)
    setResponseStatus(event, error.statusCode || 500)
    return { error: error.message || 'Internal Server Error' }
  }
});
