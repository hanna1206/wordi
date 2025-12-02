import { ExerciseType } from './practice.const';

export type VocabularySourceType =
  | 'collection'
  | 'worst-known'
  | 'new-words'
  | 'without-collection';

export interface VocabularySource {
  type: VocabularySourceType;
  id?: string; // Collection ID if type is 'collection'
  label: string;
  count?: number; // Number of items in source
}

export interface PracticeConfiguration {
  exerciseType: ExerciseType;
  source: VocabularySource;
}
