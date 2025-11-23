export const extractSortableText = (normalizedText: string): string => {
  const trimmed = normalizedText.trim();

  const articles = ['der ', 'die ', 'das ', 'ein ', 'eine ', 'einen '];

  for (const article of articles) {
    if (trimmed.toLowerCase().startsWith(article)) {
      return trimmed.slice(article.length).toLowerCase();
    }
  }

  return trimmed.toLowerCase();
};
