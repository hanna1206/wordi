import { generateObject } from 'ai';

import { getModels } from '@/services/llm/get-models';

import type { DistractorGenerationResponse } from './multiple-choice.types';
import {
  buildGenerateDistractorsPrompt,
  outputStructure,
} from './prompts/generate-distractors.prompt';

export const generateDistractors = async (
  items: string,
  targetLanguage: string,
  nativeLanguage: string,
): Promise<DistractorGenerationResponse> => {
  const models = getModels();

  const { object } = await generateObject({
    model: models.fast,
    schema: outputStructure,
    prompt: buildGenerateDistractorsPrompt(
      nativeLanguage,
      targetLanguage,
      items,
    ),
  });

  // Convert array format to Record format
  const distractors: Record<string, string[]> = {};
  for (const item of object.items) {
    distractors[item.id] = item.distractors;
  }

  return { distractors };
};
