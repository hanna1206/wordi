import type { VocabularySortOption } from '../vocabulary.types';

export const getSortDisplayName = (
  sortOption: VocabularySortOption,
  isMobile = false,
): string => {
  if (isMobile && sortOption.startsWith('Progress:')) {
    return sortOption.replace('Progress: ', '');
  }
  return sortOption;
};
