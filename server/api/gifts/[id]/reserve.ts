import { defineEventHandler, readBody } from 'h3';
import { query } from '../../../db';

// POST /api/gifts/:id/reserve - Reserve a gift
export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      throw createError({ statusCode: 400, message: 'Gift ID is required' });
    }

    const body = await readBody(event);
    const { userId } = body;

    if (!userId) {
      throw createError({ statusCode: 400, message: 'User ID is required' });
    }

    // Check if the gift exists
    const checkResult = await query(
      'SELECT * FROM gifts WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw createError({ statusCode: 404, message: 'Gift not found' });
    }

    // Check if gift is already reserved
    if (checkResult.rows[0].reserved_by) {
      throw createError({ statusCode: 400, message: 'Gift is already reserved' });
    }

    // Check if user is trying to reserve their own gift
    if (checkResult.rows[0].created_by.toString() === userId.toString()) {
      throw createError({ statusCode: 400, message: 'You cannot reserve your own gift' });
    }

    // Create reservation
    await query(
      'INSERT INTO reservations (gift_id, reserved_by) VALUES ($1, $2)',
      [id, userId]
    );

    // Update gift with reservation info
    const result = await query(
      'UPDATE gifts SET reserved_by = $1 WHERE id = $2 RETURNING *',
      [userId, id]
    );

    return {
      success: true,
      message: 'Gift reserved successfully',
      gift: result.rows[0]
    };
  } catch (error) {
    console.error('Error reserving gift:', error);
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Failed to reserve gift' 
    });
  }
});

// DELETE /api/gifts/:id/reserve - Cancel a gift reservation
export const del = defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      throw createError({ statusCode: 400, message: 'Gift ID is required' });
    }

    const body = await readBody(event);
    const { userId } = body;

    if (!userId) {
      throw createError({ statusCode: 400, message: 'User ID is required' });
    }

    // Check if the gift exists
    const checkResult = await query(
      'SELECT * FROM gifts WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw createError({ statusCode: 404, message: 'Gift not found' });
    }

    // Check if gift is reserved
    if (!checkResult.rows[0].reserved_by) {
      throw createError({ statusCode: 400, message: 'Gift is not reserved' });
    }

    // Check if the user is the one who reserved the gift
    if (checkResult.rows[0].reserved_by.toString() !== userId.toString()) {
      throw createError({ statusCode: 403, message: 'Only the user who reserved the gift can cancel the reservation' });
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

    return {
      success: true,
      message: 'Reservation canceled successfully',
      gift: result.rows[0]
    };
  } catch (error) {
    console.error('Error canceling reservation:', error);
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Failed to cancel reservation' 
    });
  }
});
