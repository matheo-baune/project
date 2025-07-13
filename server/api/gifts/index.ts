import { defineEventHandler, readBody, getQuery } from 'h3';
import { query } from '../../db';

// GET /api/gifts - Get all gifts or filter by eventId
export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);
    const { eventId, userId } = queryParams;

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
        throw createError({ statusCode: 404, message: 'Event not found' });
      }

      // Check if the current user is the creator of any gifts in this event
      const userGifts = await query(
        'SELECT id FROM gifts WHERE event_id = $1 AND created_by = $2',
        [eventId, userId]
      );

      const isCreator = userId && eventResult.rows[0].created_by.toString() === userId.toString();
      const hasOwnGifts = userGifts.rows.length > 0;

      // Different views based on user role:
      // 1. If user is the event creator, they see all gifts but not who reserved them
      // 2. If user has their own gifts in the event, they see a special view for their gifts
      // 3. Otherwise, they see all gifts with reservation info

      if (isCreator) {
        // Event creator view: see all gifts, know if reserved but not by whom
        return {
          gifts: result.rows.map(gift => ({
            ...gift,
            isReserved: !!gift.reserved_by,
            reserved_by: undefined
          })),
          isEventCreator: true,
          hasOwnGifts
        };
      } else if (hasOwnGifts) {
        // User with own gifts: see all gifts, with special marking for own gifts
        const ownGiftIds = userGifts.rows.map(g => g.id);
        return {
          gifts: result.rows.map(gift => ({
            ...gift,
            isOwnGift: ownGiftIds.includes(gift.id)
          })),
          isEventCreator: false,
          hasOwnGifts
        };
      } else {
        // Regular participant: see all gifts with reservation info
        return {
          gifts: result.rows,
          isEventCreator: false,
          hasOwnGifts: false
        };
      }
    } else {
      // Get all gifts
      const result = await query('SELECT * FROM gifts ORDER BY created_at DESC');
      return { gifts: result.rows };
    }
  } catch (error) {
    console.error('Error fetching gifts:', error);
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Failed to fetch gifts' 
    });
  }
});

// POST /api/gifts - Create a new gift
export const post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, link, image, price, eventId, userId } = body;

    // Validate required fields
    if (!title || !eventId || !userId) {
      throw createError({ statusCode: 400, message: 'Missing required fields' });
    }

    // Check if the event exists
    const eventResult = await query(
      'SELECT * FROM events WHERE id = $1',
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      throw createError({ statusCode: 404, message: 'Event not found' });
    }

    // Insert the new gift
    const result = await query(
      'INSERT INTO gifts (title, link, image, price, event_id, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, link, image, price, eventId, userId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating gift:', error);
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Failed to create gift' 
    });
  }
});
