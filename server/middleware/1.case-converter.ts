import { snakeToCamelObject, camelToSnakeObject } from '../utils/case-converter';

/**
 * Middleware to convert response data from snake_case to camelCase
 * 
 * This middleware intercepts API responses and converts all keys from snake_case to camelCase
 * for frontend consumption.
 */
export default defineEventHandler(async (event) => {
  // Process the request
  await handleRequest(event);
  
  // Continue with the handler chain
  const response = await handleResponse(event);
  
  // Process the response
  return response;
});

/**
 * Handle the incoming request
 * Convert request body from camelCase to snake_case if present
 */
async function handleRequest(event: any) {
  try {
    // Get the original request body (if any)
    const body = await readBody(event).catch(() => null);
    
    // If there's a body, convert it from camelCase to snake_case
    if (body && typeof body === 'object') {
      // Store the converted body in the context for use in handlers
      event.context.body = camelToSnakeObject(body);
    }
  } catch (error) {
    console.error('Error processing request body:', error);
  }
}

/**
 * Handle the response
 * Convert response data from snake_case to camelCase
 */
async function handleResponse(event: any) {
  // Get the original handler
  const _handler = event.node.handler;
  
  // Override the handler to intercept the response
  event.node.handler = async function() {
    // Call the original handler to get the response
    const response = await _handler.apply(this, arguments);
    
    // If the response is an object, convert it from snake_case to camelCase
    if (response && typeof response === 'object') {
      return snakeToCamelObject(response);
    }
    
    return response;
  };
  
  // Continue with the handler chain
  return;
}