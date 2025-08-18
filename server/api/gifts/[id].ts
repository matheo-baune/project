import { defineEventHandler, readBody } from 'h3';
import { query } from '../../db';

// GET /api/gifts/:id - Get a gift by ID
export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      throw createError({ statusCode: 400, message: 'Gift ID is required' });
    }

    const result = await query('SELECT * FROM gifts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw createError({ statusCode: 404, message: 'Gift not found' });
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching gift:', error);
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Failed to fetch gift' 
    });
  }
});

// PUT /api/gifts/:id - Update a gift
export const put = defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      throw createError({ statusCode: 400, message: 'Gift ID is required' });
    }

    const body = await readBody(event);
    const { title, link, image, price, userId, createdBy } = body;

    const actorId = userId || createdBy;
    if (!actorId) {
      throw createError({ statusCode: 400, message: 'User ID is required' });
    }

    // Check if the gift exists and user is the creator
    const checkResult = await query(
      'SELECT * FROM gifts WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw createError({ statusCode: 404, message: 'Gift not found' });
    }

    if (checkResult.rows[0].created_by.toString() !== actorId.toString()) {
      throw createError({ statusCode: 403, message: 'Not authorized to update this gift' });
    }

    // Update the gift
    const result = await query(
      'UPDATE gifts SET title = $1, link = $2, image = $3, price = $4 WHERE id = $5 RETURNING *',
      [
        title || checkResult.rows[0].title,
        link !== undefined ? link : checkResult.rows[0].link,
        image !== undefined ? image : checkResult.rows[0].image,
        price !== undefined ? price : checkResult.rows[0].price,
        id
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error updating gift:', error);
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Failed to update gift' 
    });
  }
});

// DELETE /api/gifts/:id - Delete a gift
export const del = defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      throw createError({ statusCode: 400, message: 'Gift ID is required' });
    }

    const body = await readBody(event);
    const { userId, createdBy } = body;
    const actorId = userId || createdBy;

    if (!actorId) {
      throw createError({ statusCode: 400, message: 'User ID is required' });
    }

    // Check if the gift exists and user is the creator
    const checkResult = await query(
      'SELECT * FROM gifts WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw createError({ statusCode: 404, message: 'Gift not found' });
    }

    if (checkResult.rows[0].created_by.toString() !== actorId.toString()) {
      throw createError({ statusCode: 403, message: 'Not authorized to delete this gift' });
    }

    // Delete the gift
    await query('DELETE FROM gifts WHERE id = $1', [id]);

    return { success: true, message: 'Gift deleted successfully' };
  } catch (error) {
    console.error('Error deleting gift:', error);
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Failed to delete gift' 
    });
  }
});
