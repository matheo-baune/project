import { defineEventHandler } from 'h3'
import { query } from '../../../db'

// GET /api/gifts/:id/comments - List comments for a gift
export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    if (!id) {
      throw createError({ statusCode: 400, message: 'Gift ID is required' })
    }

    // Ensure gift_comments table exists
    await query(`CREATE TABLE IF NOT EXISTS gift_comments (
      id BIGSERIAL PRIMARY KEY,
      gift_id BIGINT NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
      author_id BIGINT NULL,
      author_name TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)

    const res = await query(
      `SELECT id, gift_id, author_id, author_name, text, created_at
       FROM gift_comments
       WHERE gift_id = $1
       ORDER BY created_at ASC`,
      [id]
    )

    return res.rows
  } catch (error: any) {
    console.error('Error fetching gift comments:', error)
    throw createError({ statusCode: error.statusCode || 500, message: error.message || 'Failed to fetch comments' })
  }
})
