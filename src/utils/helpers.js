/**
 * Adds a specified number of days to a given date.
 */
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Gets the Monday of the week for a given date.
 */
export function getMondayOfDate(d) {
    const date = new Date(d);
    const day = date.getDay(); // Sunday - 0, Monday - 1, ...
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0); // Reset time to beginning of the day
    return monday;
}

/**
 * Formats a date into DD/MM/YYYY format.
 */
export const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * Capitalizes the first letter of a string.
 */
export const capitalize = s => s && s.charAt(0).toUpperCase() + s.slice(1);