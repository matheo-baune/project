import { defineEventHandler, readBody, getRouterParam } from 'h3';
import { query } from '../../../db';

// POST /api/gifts/:id/reserve - Reserve a gift
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const { reservedBy } = body;
    
    if (!reservedBy) {
      return { error: 'Missing required fields' };
    }
    
    // Check if the gift exists
    const checkResult = await query(
      'SELECT * FROM gifts WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return { error: 'Gift not found' };
    }
    
    // Check if gift is already reserved
    if (checkResult.rows[0].reserved_by) {
      return { error: 'Gift is already reserved' };
    }
    
    // Create reservation
    await query(
      'INSERT INTO reservations (gift_id, reserved_by) VALUES ($1, $2)',
      [id, reservedBy]
    );
    
    // Update gift with reservation info
    const result = await query(
      'UPDATE gifts SET reserved_by = $1 WHERE id = $2 RETURNING *',
      [reservedBy, id]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error reserving gift:', error);
    return { error: 'Failed to reserve gift' };
  }
});

// DELETE /api/gifts/:id/reserve - Cancel a gift reservation
export const del = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    // Check if the gift exists
    const checkResult = await query(
      'SELECT * FROM gifts WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return { error: 'Gift not found' };
    }
    
    // Check if gift is reserved
    if (!checkResult.rows[0].reserved_by) {
      return { error: 'Gift is not reserved' };
    }
    
    // Delete reservation
    await query(
      'DELETE FROM reservations WHERE gift_id = $1',
      [id]
    );
    
    // Update gift to remove reservation info
    const result = await query(
      'UPDATE gifts SET reserved_by = NULL WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error canceling reservation:', error);
    return { error: 'Failed to cancel reservation' };
  }
});