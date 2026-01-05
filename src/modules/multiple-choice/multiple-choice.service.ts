import { generateObject } from 'ai';

import { gpt41MiniModel } from '@/services/llm/gpt-4.1-mini';

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
  const { object } = await generateObject({
    model: gpt41MiniModel,
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
