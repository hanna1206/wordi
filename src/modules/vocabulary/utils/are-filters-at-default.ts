import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';

import { ALL_PARTS_OF_SPEECH, VisibilityFilter } from '../vocabulary.types';

export function areFiltersAtDefault(
  visibilityFilter: VisibilityFilter,
  selectedPartsOfSpeech: PartOfSpeech[],
): boolean {
  const isVisibilityDefault = visibilityFilter === 'visible-only';
  // Part of speech is at default if either:
  // 1. No parts of speech are selected (no filter applied - show all)
  // 2. All parts of speech are selected (same effect - show all)
  const arePartsOfSpeechDefault =
    selectedPartsOfSpeech.length === 0 ||
    (selectedPartsOfSpeech.length === ALL_PARTS_OF_SPEECH.length &&
      ALL_PARTS_OF_SPEECH.every((pos) => selectedPartsOfSpeech.includes(pos)));

  return isVisibilityDefault && arePartsOfSpeechDefault;
}
