import { defineEventHandler, readBody, getRouterParam } from 'h3';
import { query } from '../../db';

// GET /api/gifts/:id - Get a gift by ID
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    const result = await query('SELECT * FROM gifts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return { error: 'Gift not found' };
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching gift:', error);
    return { error: 'Failed to fetch gift' };
  }
});

// PUT /api/gifts/:id - Update a gift
export const put = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const { title, link, image, price, createdBy } = body;
    
    // Check if the gift exists and user is the creator
    const checkResult = await query(
      'SELECT * FROM gifts WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return { error: 'Gift not found' };
    }
    
    if (createdBy && checkResult.rows[0].created_by.toString() !== createdBy.toString()) {
      return { error: 'Not authorized to update this gift' };
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
    return { error: 'Failed to update gift' };
  }
});

// DELETE /api/gifts/:id - Delete a gift
export const del = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const { createdBy } = body;
    
    // Check if the gift exists and user is the creator
    const checkResult = await query(
      'SELECT * FROM gifts WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return { error: 'Gift not found' };
    }
    
    if (createdBy && checkResult.rows[0].created_by.toString() !== createdBy.toString()) {
      return { error: 'Not authorized to delete this gift' };
    }
    
    // Delete the gift
    await query('DELETE FROM gifts WHERE id = $1', [id]);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting gift:', error);
    return { error: 'Failed to delete gift' };
  }
});