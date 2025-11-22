/**
 * Extracts the sortable word by removing articles (der, die, das, ein, eine)
 * from German nouns for proper alphabetical sorting.
 *
 * @param normalizedWord - The full normalized word (e.g., "der Hund", "die Katze")
 * @returns The word without article for sorting (e.g., "Hund", "Katze")
 */
export const extractSortableWord = (normalizedWord: string): string => {
  const trimmed = normalizedWord.trim();

  // German articles to remove (definite and indefinite)
  const articles = ['der ', 'die ', 'das ', 'ein ', 'eine ', 'einen '];

  for (const article of articles) {
    if (trimmed.toLowerCase().startsWith(article)) {
      return trimmed.slice(article.length);
    }
  }

  // If no article found, return the original word
  return trimmed;
};
