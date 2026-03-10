export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const getFirstCharacter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase();
};

// Converts a string to pascal case (e.g., "hello world" -> "HelloWorld")
// It splits the input string by spaces, underscores, or hyphens, capitalizes the first letter of each word, and then joins them together without any separators.
// Example usage: getPascalCase("hello world") -> "HelloWorld"
export const getPascalCase = (text: string): string => {
  if (!text) return '';
  return text
    .split(/[\s_-]+/) // Split by space, underscore, or hyphen
    .map((word) => capitalizeFirstLetter(word))
    .join('');
};
