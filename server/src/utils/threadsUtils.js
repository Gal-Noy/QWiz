const getContentText = (htmlString) => {
  const matches = htmlString.match(/<[^>]*>([^<]+)<\/[^>]*>/g);
  const textContent = matches ? matches.map((match) => match.replace(/<\/?[^>]+(>|$)/g, "")).join("") : "";
  return textContent;
};

export { getContentText };
