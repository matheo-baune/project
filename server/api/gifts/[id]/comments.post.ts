import { defineEventHandler, readBody } from 'h3'
import { query } from '../../../db'

// POST /api/gifts/:id/comments - Add a comment to a gift
export default defineEventHandler(async (event) => {
  try {
    const giftId = event.context.params?.id
    if (!giftId) {
      throw createError({ statusCode: 400, message: 'Gift ID is required' })
    }

    const body = await readBody(event)
    const { text, authorId, authorName } = body as { text?: string; authorId?: string; authorName?: string }

    if (!text || !text.trim()) {
      throw createError({ statusCode: 400, message: 'Comment text is required' })
    }

    // Ensure gift exists
    const giftRes = await query('SELECT id FROM gifts WHERE id = $1', [giftId])
    if (giftRes.rows.length === 0) {
      throw createError({ statusCode: 404, message: 'Gift not found' })
    }

    // Ensure table exists
    await query(`CREATE TABLE IF NOT EXISTS gift_comments (
      id BIGSERIAL PRIMARY KEY,
      gift_id BIGINT NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
      author_id BIGINT NULL,
      author_name TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)

    const displayName = (authorName && authorName.trim()) || 'Anonymous'
    const authorIdVal = authorId ? Number(authorId) : null

    const res = await query(
      `INSERT INTO gift_comments (gift_id, author_id, author_name, text)
       VALUES ($1, $2, $3, $4)
       RETURNING id, gift_id, author_id, author_name, text, created_at`,
      [giftId, authorIdVal, displayName, text.trim()]
    )

    return res.rows[0]
  } catch (error: any) {
    console.error('Error creating comment:', error)
    throw createError({ statusCode: error.statusCode || 500, message: error.message || 'Failed to create comment' })
  }
})
