import { query } from "~/server/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, link, image, price, eventId, createdBy } = body as Record<string, any>

    if (!title || !eventId || !createdBy) {
      throw createError({ statusCode: 400, message: 'title, eventId and createdBy are required' })
    }

    // Verify creator is member of the event's group
    const memCheck = await query(
      `SELECT gm.* FROM group_members gm
       JOIN events e ON e.group_id = gm.group_id
       WHERE e.id = $1 AND gm.user_id = $2`,
      [eventId, createdBy]
    )
    if (memCheck.rows.length === 0) {
      throw createError({ statusCode: 403, message: 'Not authorized to add gifts for this event' })
    }

    const res = await query(
      `INSERT INTO gifts (title, link, image, price, event_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, link || null, image || null, price ?? null, eventId, createdBy]
    )

    return res.rows[0]
  } catch (error: any) {
    console.error('Error creating gift:', error)
    throw createError({ statusCode: error.statusCode || 500, message: error.message || 'Failed to create gift' })
  }
});