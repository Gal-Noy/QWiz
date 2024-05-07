/**
 * Extracts the text content from an HTML string.
 *
 * @function getContentText
 * @param {string} htmlString - The HTML string to extract the text from
 * @returns {string} - The text content of the HTML string
 */
const getContentText = (htmlString) => {
  const matches = htmlString.match(/<[^>]*>([^<]+)<\/[^>]*>/g);
  const textContent = matches ? matches.map((match) => match.replace(/<\/?[^>]+(>|$)/g, "")).join("") : "";
  return textContent;
};

export { getContentText };
