// src/utils/dateUtils.js

/**
 * Converts a date string from SQLite (which is in UTC but doesn't have timezone info)
 * to a proper Date object that JavaScript understands as UTC.
 * @param {string} sqliteDateString - e.g., "2025-09-07 10:54:42"
 * @returns {Date} A Date object.
 */
export const parseUTCDate = (sqliteDateString) => {
    if (!sqliteDateString) {
      return new Date(); // Fallback
    }
    // Add "Z" to the end of the string to tell JavaScript it's a UTC date
    return new Date(sqliteDateString.replace(' ', 'T') + 'Z');
  };