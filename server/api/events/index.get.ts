import {query} from "~/server/db";

export default defineEventHandler(async (event) => {
    try {
        const res = await query(`
          SELECT 
            e.id,
            e.name,
            e.background,
            e.description,
            e.created_by as createdBy,
            e.created_at as createdAt,
            COALESCE(
              json_agg(
                DISTINCT jsonb_build_object(
                  'id', u.id,
                  'firstname', u.firstname,
                  'lastname', u.lastname,
                  'avatar', u.avatar,
                  'isTarget', em.is_target
                )
              ) FILTER (WHERE u.id IS NOT NULL), '[]'::json
            ) AS members
          FROM events e
          LEFT JOIN event_members em ON em.event_id = e.id
          LEFT JOIN users u ON u.id = em.user_id
          GROUP BY e.id, e.name, e.date, e.background, e.description, e.group_id, e.created_by, e.created_at
          ORDER BY e.created_at DESC
        `)
        return res.rows
    } catch (error: any) {
        console.error('Error fetching events:', error);
        setResponseStatus(event, 500);
        return { error: 'Internal Server Error' };
    }
});