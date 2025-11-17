/**
 * Formats a date string from YYYY-MM-DD to DD/MM/YYYY.
 * @param {string} dateString - The date string in YYYY-MM-DD format.
 * @returns {string} The formatted date string or the original string if invalid.
 */
export const formatDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return '';

  try {
    const [year, month, day] = dateString.split('-');

    // Basic validation to ensure all parts are present
    if (day && month && year && year.length === 4) {
      return `${day}/${month}/${year}`;
    }
    
    return dateString; // Return original if format is not as expected
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Return original in case of an error
  }
};
