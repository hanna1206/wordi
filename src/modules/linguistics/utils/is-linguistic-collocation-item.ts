import {
  LinguisticCollocationItem,
  LinguisticWordItem,
} from '../linguistics.types';

export const isLinguisticCollocationItem = (
  item: LinguisticWordItem | LinguisticCollocationItem,
): item is LinguisticCollocationItem => {
  return 'normalizedCollocation' in item;
};
