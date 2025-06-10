import { defineEventHandler, readBody, getQuery } from 'h3';
import { query } from '../../db';

// GET /api/gifts - Get all gifts or filter by eventId
export default defineEventHandler(async (event) => {
  try {
    const { eventId } = getQuery(event);
    
    if (eventId) {
      // Get gifts for a specific event
      const result = await query(
        'SELECT * FROM gifts WHERE event_id = $1 ORDER BY created_at DESC',
        [eventId]
      );
      
      // Check if user is the creator of the event to hide reservation details
      const eventResult = await query(
        'SELECT created_by FROM events WHERE id = $1',
        [eventId]
      );
      
      if (eventResult.rows.length === 0) {
        return { error: 'Event not found' };
      }
      
      // Get user ID from request (in a real app, this would come from authentication)
      // For now, we'll use a dummy user ID from the query params
      const { userId } = getQuery(event);
      const isCreator = userId && eventResult.rows[0].created_by.toString() === userId.toString();
      
      // If user is the creator, hide who reserved the gifts but show if they're reserved
      if (isCreator) {
        return result.rows.map(gift => ({
          ...gift,
          isReserved: !!gift.reserved_by,
          reserved_by: undefined
        }));
      }
      
      return result.rows;
    } else {
      // Get all gifts
      const result = await query('SELECT * FROM gifts ORDER BY created_at DESC');
      return result.rows;
    }
  } catch (error) {
    console.error('Error fetching gifts:', error);
    return { error: 'Failed to fetch gifts' };
  }
});

// POST /api/gifts - Create a new gift
export const post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, link, image, price, eventId, createdBy } = body;
    
    // Validate required fields
    if (!title || !eventId || !createdBy) {
      return { error: 'Missing required fields' };
    }
    
    // Check if the event exists and user is the creator
    const eventResult = await query(
      'SELECT * FROM events WHERE id = $1 AND created_by = $2',
      [eventId, createdBy]
    );
    
    if (eventResult.rows.length === 0) {
      return { error: 'Event not found or not authorized' };
    }
    
    // Insert the new gift
    const result = await query(
      'INSERT INTO gifts (title, link, image, price, event_id, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, link, image, price, eventId, createdBy]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating gift:', error);
    return { error: 'Failed to create gift' };
  }
});