import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';

import { ALL_PARTS_OF_SPEECH, VisibilityFilter } from '../vocabulary.types';

export function areFiltersAtDefault(
  visibilityFilter: VisibilityFilter,
  selectedPartsOfSpeech: PartOfSpeech[],
): boolean {
  const isVisibilityDefault = visibilityFilter === 'visible-only';
  const arePartsOfSpeechDefault =
    selectedPartsOfSpeech.length === ALL_PARTS_OF_SPEECH.length &&
    ALL_PARTS_OF_SPEECH.every((pos) => selectedPartsOfSpeech.includes(pos));

  return isVisibilityDefault && arePartsOfSpeechDefault;
}
