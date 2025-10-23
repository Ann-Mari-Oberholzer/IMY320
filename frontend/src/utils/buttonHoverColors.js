/**
 * Button color mappings with their darker hover states
 * This ensures consistent hover effects across the entire application
 */

export const buttonHoverColors = {
  // Primary brand colors
  '#00AEBB': '#008a99',  // Teal blue -> Darker teal
  '#F7CA66': '#f4d03f',  // Yellow -> Darker yellow

  // Success/confirmation colors
  '#27ae60': '#229954',  // Green -> Darker green

  // Error/danger colors
  '#e74c3c': '#c0392b',  // Red -> Darker red
  '#c82333': '#a71d2a',  // Dark red -> Darker dark red

  // Neutral/white buttons
  '#ffffff': '#f5f5f5',  // White -> Light gray
  '#fff': '#f5f5f5',     // White (short) -> Light gray

  // Gray backgrounds
  '#f8f9fa': '#e9ecef',  // Light gray -> Medium gray
  '#f0f0f0': '#e0e0e0',  // Gray -> Darker gray
  '#f0f7ff': '#00AEBB',  // Light blue -> Brand blue

  // Warning colors
  '#fff3cd': '#ffeaa7',  // Light yellow -> Darker yellow warning
};

/**
 * Get the darker shade for a given color
 * @param {string} color - The original color (hex code)
 * @returns {string} - The darker shade or original color if no mapping exists
 */
export const getDarkerShade = (color) => {
  // Normalize the color (remove spaces, convert to lowercase)
  const normalizedColor = color?.trim().toLowerCase();

  // Return the darker shade if it exists, otherwise return original
  return buttonHoverColors[normalizedColor] || color;
};

/**
 * Common button hover style object
 * @param {string} originalColor - The button's original background color
 * @returns {object} - Style object for hover state
 */
export const getButtonHoverStyle = (originalColor) => ({
  backgroundColor: getDarkerShade(originalColor),
  transform: 'translateY(-2px)',
  boxShadow: `0 6px 12px ${getColorShadow(originalColor)}`,
});

/**
 * Get appropriate shadow color based on button color
 * @param {string} color - The button color
 * @returns {string} - RGBA shadow color
 */
export const getColorShadow = (color) => {
  const normalizedColor = color?.trim().toLowerCase();

  const shadowMap = {
    '#00aebb': 'rgba(0, 174, 187, 0.3)',
    '#f7ca66': 'rgba(247, 202, 102, 0.3)',
    '#27ae60': 'rgba(39, 174, 96, 0.3)',
    '#e74c3c': 'rgba(231, 76, 60, 0.3)',
    '#c82333': 'rgba(200, 35, 51, 0.3)',
    '#ffffff': 'rgba(0, 0, 0, 0.1)',
    '#fff': 'rgba(0, 0, 0, 0.1)',
    '#f8f9fa': 'rgba(0, 0, 0, 0.05)',
    '#f0f0f0': 'rgba(0, 0, 0, 0.1)',
    '#f0f7ff': 'rgba(0, 174, 187, 0.15)',
  };

  return shadowMap[normalizedColor] || 'rgba(0, 0, 0, 0.15)';
};

export default {
  buttonHoverColors,
  getDarkerShade,
  getButtonHoverStyle,
  getColorShadow,
};
