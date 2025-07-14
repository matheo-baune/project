/**
 * Utility functions for converting between snake_case and camelCase
 * This helps maintain snake_case in the database and camelCase in the frontend
 */

/**
 * Converts a string from snake_case to camelCase
 * @param str The snake_case string to convert
 * @returns The camelCase version of the string
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts a string from camelCase to snake_case
 * @param str The camelCase string to convert
 * @returns The snake_case version of the string
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Converts an object's keys from snake_case to camelCase
 * @param obj The object with snake_case keys
 * @returns A new object with camelCase keys
 */
export function snakeToCamelObject<T = any>(obj: Record<string, any>): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamelObject) as unknown as T;
  }

  return Object.keys(obj).reduce((result, key) => {
    const camelKey = snakeToCamel(key);
    const value = obj[key];
    
    result[camelKey] = value !== null && typeof value === 'object' 
      ? snakeToCamelObject(value)
      : value;
    
    return result;
  }, {} as Record<string, any>) as T;
}

/**
 * Converts an object's keys from camelCase to snake_case
 * @param obj The object with camelCase keys
 * @returns A new object with snake_case keys
 */
export function camelToSnakeObject<T = any>(obj: Record<string, any>): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(camelToSnakeObject) as unknown as T;
  }

  return Object.keys(obj).reduce((result, key) => {
    const snakeKey = camelToSnake(key);
    const value = obj[key];
    
    result[snakeKey] = value !== null && typeof value === 'object' 
      ? camelToSnakeObject(value)
      : value;
    
    return result;
  }, {} as Record<string, any>) as T;
}