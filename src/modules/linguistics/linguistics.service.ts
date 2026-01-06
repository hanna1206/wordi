import { generateObject } from 'ai';

import { getModels } from '@/services/llm/get-models';

import { PartOfSpeech } from './linguistics.const';
import {
  InputClassification,
  LanguageDetectionResult,
  LinguisticCollocationItem,
} from './linguistics.types';
import {
  buildClassifyInputPrompt,
  outputStructure as classifyInputOutputStructure,
} from './prompts/collocations/classify-input.prompt';
import {
  buildCollocationExamplesPrompt,
  outputStructure as collocationExamplesOutputStructure,
} from './prompts/collocations/collocation-examples.prompt';
import {
  buildCollocationTranslationPrompt,
  outputStructure as collocationTranslationOutputStructure,
} from './prompts/collocations/collocation-translation.prompt';
import {
  buildComponentWordsPrompt,
  outputStructure as componentWordsOutputStructure,
} from './prompts/collocations/component-words.prompt';
import {
  buildDetectLanguageAndTranslatePrompt,
  outputStructure as detectLanguageAndTranslateOutputStructure,
} from './prompts/detect-language-and-translate.prompt';
import {
  buildAdjectiveComparisonFormsPrompt,
  outputStructure as adjectiveComparisonFormsOutputStructure,
} from './prompts/words/adjective-comparison-forms.prompt';
import {
  buildAdjectivePrepositionsPrompt,
  outputStructure as adjectivePrepositionsOutputStructure,
} from './prompts/words/adjective-prepositions.prompt';
import {
  buildAdjectiveTypePrompt,
  outputStructure as adjectiveTypeOutputStructure,
} from './prompts/words/adjective-type.prompt';
import {
  buildBasicTranslationPrompt,
  outputStructure as basicTranslationOutputStructure,
} from './prompts/words/basic-translation.prompt';
import {
  buildCollocationsPrompt,
  outputStructure as collocationsOutputStructure,
} from './prompts/words/collocations.prompt';
import {
  buildDemonstrativePronounDeclensionsPrompt,
  outputStructure as demonstrativePronounDeclensionsOutputStructure,
} from './prompts/words/demonstrative-pronoun-declensions.prompt';
import {
  buildExampleSentencesPrompt,
  outputStructure as exampleSentencesOutputStructure,
} from './prompts/words/example-sentences.prompt';
import {
  buildNormalizeWordPrompt,
  outputStructure as normalizeWordOutputStructure,
} from './prompts/words/normalize-word.prompt';
import {
  buildNounGenderPrompt,
  outputStructure as nounGenderOutputStructure,
} from './prompts/words/noun-gender.prompt';
import {
  buildNounPluralFormPrompt,
  outputStructure as nounPluralFormOutputStructure,
} from './prompts/words/noun-plural-form.prompt';
import {
  buildNounPrepositionsPrompt,
  outputStructure as nounPrepositionsOutputStructure,
} from './prompts/words/noun-prepositions.prompt';
import {
  buildPronounDeclensionsPrompt,
  outputStructure as pronounDeclensionsOutputStructure,
} from './prompts/words/pronoun-declensions.prompt';
import {
  buildPronounTypePrompt,
  outputStructure as pronounTypeOutputStructure,
} from './prompts/words/pronoun-type.prompt';
import {
  buildSynonymsPrompt,
  outputStructure as synonymsOutputStructure,
} from './prompts/words/synonyms.prompt';
import {
  buildVerbConjugationPrompt,
  outputStructure as verbConjugationOutputStructure,
} from './prompts/words/verb-conjugation.prompt';
import {
  buildVerbPrepositionsPrompt,
  outputStructure as verbPrepositionsOutputStructure,
} from './prompts/words/verb-prepositions.prompt';
import {
  buildVerbReflexivityPrompt,
  outputStructure as verbReflexivityOutputStructure,
} from './prompts/words/verb-reflexivity.prompt';
import {
  buildVerbRegularityPrompt,
  outputStructure as verbRegularityOutputStructure,
} from './prompts/words/verb-regularity.prompt';
import {
  buildVerbSeparablePrefixPrompt,
  outputStructure as verbSeparablePrefixOutputStructure,
} from './prompts/words/verb-separable-prefix.prompt';
import {
  buildVerbSichUsagePrompt,
  outputStructure as verbSichUsageOutputStructure,
} from './prompts/words/verb-sich-usage.prompt';

const WRONG_VERB_SEPARABLE_PREFIX_VALUES = ['null', '/', '/null'];

// German articles for detection
const GERMAN_ARTICLES = {
  definite: ['der', 'die', 'das'],
  indefinite: ['ein', 'eine'],
} as const;

export const detectLanguageAndTranslate = async (
  input: string,
  targetLanguage: string,
): Promise<LanguageDetectionResult> => {
  const models = getModels();
  const messages = buildDetectLanguageAndTranslatePrompt(input, targetLanguage);

  const { object } = await generateObject({
    model: models.fast,
    schema: detectLanguageAndTranslateOutputStructure,
    messages,
  });

  // Deduplicate translations by text (case-insensitive)
  const uniqueTranslations = object.translations.reduce(
    (acc, translation) => {
      const normalizedText = translation.text.toLowerCase();
      if (!acc.some((t) => t.text.toLowerCase() === normalizedText)) {
        acc.push(translation);
      }
      return acc;
    },
    [] as typeof object.translations,
  );

  return {
    detectedLanguage: object.detectedLanguage,
    isTargetLanguage: object.isGerman,
    translations: uniqueTranslations,
    confidence: object.confidence,
  };
};

export const generateLinguisticCollocationItem = async (
  collocation: string,
  targetLanguage: string,
): Promise<LinguisticCollocationItem> => {
  const models = getModels();

  const [translationResult, examplesResult, componentWordsResult] =
    await Promise.all([
      generateObject({
        model: models.standard,
        schema: collocationTranslationOutputStructure,
        prompt: buildCollocationTranslationPrompt(collocation, targetLanguage),
      }),
      generateObject({
        model: models.standard,
        schema: collocationExamplesOutputStructure,
        prompt: buildCollocationExamplesPrompt(collocation, targetLanguage),
      }),
      generateObject({
        model: models.standard,
        schema: componentWordsOutputStructure,
        prompt: buildComponentWordsPrompt(collocation, targetLanguage),
      }),
    ]);

  return {
    normalizedCollocation: translationResult.object.normalizedCollocation,
    mainTranslation: translationResult.object.mainTranslation,
    exampleSentences: examplesResult.object.exampleSentences,
    componentWords: componentWordsResult.object.componentWords,
  };
};

export const classifyInput = async (
  input: string,
): Promise<InputClassification> => {
  const models = getModels();
  const trimmedInput = input.trim();

  const words = trimmedInput.split(/\s+/);
  const wordCount = words.length;

  if (wordCount === 1) {
    return {
      type: 'single-word',
      normalizedInput: trimmedInput,
    };
  }

  const firstWord = words[0].toLowerCase();
  const allArticles: string[] = [
    ...GERMAN_ARTICLES.definite,
    ...GERMAN_ARTICLES.indefinite,
  ];

  if (wordCount === 2 && allArticles.includes(firstWord)) {
    const noun = words[1];
    return {
      type: 'single-word',
      normalizedInput: noun,
    };
  }

  try {
    const { object } = await generateObject({
      model: models.fast,
      schema: classifyInputOutputStructure,
      prompt: buildClassifyInputPrompt(trimmedInput),
    });

    if (object.classification === 'compound-word') {
      return {
        type: 'single-word',
        normalizedInput: object.normalizedForm,
      };
    } else {
      return {
        type: 'collocation',
        normalizedInput: object.normalizedForm,
      };
    }
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      `Classification failed for input "${trimmedInput}", defaulting to collocation processing`,
    );

    return {
      type: 'collocation',
      normalizedInput: trimmedInput,
    };
  }
};

export const generateLinguisticItem = async (
  word: string,
  targetLanguage: string,
) => {
  const models = getModels();

  // First, normalize the word to get its base form and part of speech
  const { object: normalizeResult } = await generateObject({
    model: models.standard,
    schema: normalizeWordOutputStructure,
    prompt: buildNormalizeWordPrompt(word),
  });

  const { normalizedWord, partOfSpeech } = normalizeResult;

  // Run all translation-related queries in parallel
  const basicTranslationPromise = generateObject({
    model: models.standard,
    schema: basicTranslationOutputStructure,
    prompt: buildBasicTranslationPrompt(normalizedWord, targetLanguage),
  });

  const exampleSentencesPromise = generateObject({
    model: models.standard,
    schema: exampleSentencesOutputStructure,
    prompt: buildExampleSentencesPrompt(normalizedWord),
  });

  const collocationsPromise = generateObject({
    model: models.standard,
    schema: collocationsOutputStructure,
    prompt: buildCollocationsPrompt(normalizedWord, targetLanguage),
  });

  const synonymsPromise = generateObject({
    model: models.standard,
    schema: synonymsOutputStructure,
    prompt: buildSynonymsPrompt(normalizedWord),
  });

  // Run all noun-specific queries in parallel when it's a noun
  const nounGenderPromise = partOfSpeech.includes(PartOfSpeech.NOUN)
    ? generateObject({
        model: models.standard,
        schema: nounGenderOutputStructure,
        prompt: buildNounGenderPrompt(normalizedWord),
      })
    : Promise.resolve(undefined);

  const nounPluralFormPromise = partOfSpeech.includes(PartOfSpeech.NOUN)
    ? generateObject({
        model: models.standard,
        schema: nounPluralFormOutputStructure,
        prompt: buildNounPluralFormPrompt(normalizedWord),
      })
    : Promise.resolve(undefined);

  const nounPrepositionsPromise = partOfSpeech.includes(PartOfSpeech.NOUN)
    ? generateObject({
        model: models.standard,
        schema: nounPrepositionsOutputStructure,
        prompt: buildNounPrepositionsPrompt(normalizedWord, targetLanguage),
      })
    : Promise.resolve(undefined);

  // Run all verb-specific queries in parallel when it's a verb
  const verbRegularityPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? generateObject({
        model: models.standard,
        schema: verbRegularityOutputStructure,
        prompt: buildVerbRegularityPrompt(normalizedWord),
      })
    : Promise.resolve(undefined);

  const verbConjugationPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? generateObject({
        model: models.standard,
        schema: verbConjugationOutputStructure,
        prompt: buildVerbConjugationPrompt(normalizedWord),
      })
    : Promise.resolve(undefined);

  const verbSeparablePrefixPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? generateObject({
        model: models.standard,
        schema: verbSeparablePrefixOutputStructure,
        prompt: buildVerbSeparablePrefixPrompt(normalizedWord),
      })
    : Promise.resolve(undefined);

  const verbReflexivityPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? generateObject({
        model: models.standard,
        schema: verbReflexivityOutputStructure,
        prompt: buildVerbReflexivityPrompt(normalizedWord),
      })
    : Promise.resolve(undefined);

  const verbPrepositionsPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? generateObject({
        model: models.standard,
        schema: verbPrepositionsOutputStructure,
        prompt: buildVerbPrepositionsPrompt(normalizedWord, targetLanguage),
      })
    : Promise.resolve(undefined);

  // Run all adjective-specific queries in parallel when it's an adjective
  const adjectiveTypePromise = partOfSpeech.includes(PartOfSpeech.ADJECTIVE)
    ? generateObject({
        model: models.standard,
        schema: adjectiveTypeOutputStructure,
        prompt: buildAdjectiveTypePrompt(normalizedWord),
      })
    : Promise.resolve(undefined);

  const adjectiveComparisonFormsPromise = partOfSpeech.includes(
    PartOfSpeech.ADJECTIVE,
  )
    ? generateObject({
        model: models.standard,
        schema: adjectiveComparisonFormsOutputStructure,
        prompt: buildAdjectiveComparisonFormsPrompt(normalizedWord),
      })
    : Promise.resolve(undefined);

  const adjectivePrepositionsPromise = partOfSpeech.includes(
    PartOfSpeech.ADJECTIVE,
  )
    ? generateObject({
        model: models.standard,
        schema: adjectivePrepositionsOutputStructure,
        prompt: buildAdjectivePrepositionsPrompt(
          normalizedWord,
          targetLanguage,
        ),
      })
    : Promise.resolve(undefined);

  // Run all personal pronoun-specific queries in parallel when it's a personal pronoun
  const pronounTypePromise = partOfSpeech.includes(
    PartOfSpeech.PERSONAL_PRONOUN,
  )
    ? generateObject({
        model: models.standard,
        schema: pronounTypeOutputStructure,
        prompt: buildPronounTypePrompt(normalizedWord, targetLanguage),
      })
    : Promise.resolve(undefined);

  const pronounDeclensionsPromise = partOfSpeech.includes(
    PartOfSpeech.PERSONAL_PRONOUN,
  )
    ? generateObject({
        model: models.standard,
        schema: pronounDeclensionsOutputStructure,
        prompt: buildPronounDeclensionsPrompt(normalizedWord, targetLanguage),
      })
    : Promise.resolve(undefined);

  // Run demonstrative pronoun-specific queries when it's a demonstrative pronoun
  const demonstrativePronounDeclensionsPromise = partOfSpeech.includes(
    PartOfSpeech.DEMONSTRATIVE_PRONOUN,
  )
    ? generateObject({
        model: models.standard,
        schema: demonstrativePronounDeclensionsOutputStructure,
        prompt: buildDemonstrativePronounDeclensionsPrompt(
          normalizedWord,
          targetLanguage,
        ),
      })
    : Promise.resolve(undefined);

  const [
    basicTranslationResult,
    exampleSentencesResult,
    collocationsResult,
    synonymsResult,
    nounGenderResult,
    nounPluralFormResult,
    nounPrepositionsResult,
    verbRegularityResult,
    verbConjugationResult,
    verbSeparablePrefixResult,
    verbReflexivityResult,
    verbPrepositionsResult,
    adjectiveTypeResult,
    adjectiveComparisonFormsResult,
    adjectivePrepositionsResult,
    pronounTypeResult,
    pronounDeclensionsResult,
    demonstrativePronounDeclensionsResult,
  ] = await Promise.all([
    basicTranslationPromise,
    exampleSentencesPromise,
    collocationsPromise,
    synonymsPromise,
    nounGenderPromise,
    nounPluralFormPromise,
    nounPrepositionsPromise,
    verbRegularityPromise,
    verbConjugationPromise,
    verbSeparablePrefixPromise,
    verbReflexivityPromise,
    verbPrepositionsPromise,
    adjectiveTypePromise,
    adjectiveComparisonFormsPromise,
    adjectivePrepositionsPromise,
    pronounTypePromise,
    pronounDeclensionsPromise,
    demonstrativePronounDeclensionsPromise,
  ]);

  let posSpecifics = {} as Record<string, unknown>;

  // Merge noun-specific results
  if (nounGenderResult) {
    posSpecifics = { ...posSpecifics, ...nounGenderResult.object };
  }
  if (nounPluralFormResult) {
    posSpecifics = { ...posSpecifics, ...nounPluralFormResult.object };
  }
  if (nounPrepositionsResult) {
    posSpecifics = { ...posSpecifics, ...nounPrepositionsResult.object };
  }

  // Merge verb-specific results
  if (verbRegularityResult) {
    posSpecifics = { ...posSpecifics, ...verbRegularityResult.object };
  }
  if (verbConjugationResult) {
    posSpecifics = { ...posSpecifics, ...verbConjugationResult.object };
  }
  if (verbSeparablePrefixResult) {
    const normalizedPrefix = {
      separablePrefix:
        verbSeparablePrefixResult.object.separablePrefix != null &&
        WRONG_VERB_SEPARABLE_PREFIX_VALUES.includes(
          verbSeparablePrefixResult.object.separablePrefix,
        )
          ? null
          : verbSeparablePrefixResult.object.separablePrefix,
    };
    posSpecifics = { ...posSpecifics, ...normalizedPrefix };
  }
  if (verbReflexivityResult) {
    posSpecifics = { ...posSpecifics, ...verbReflexivityResult.object };

    // Only fetch sich usage if the verb is classified as 'both'
    if (verbReflexivityResult.object.isReflexive === 'both') {
      const { object: verbSichUsageResult } = await generateObject({
        model: models.standard,
        schema: verbSichUsageOutputStructure,
        prompt: buildVerbSichUsagePrompt(normalizedWord, targetLanguage),
      });
      if (verbSichUsageResult) {
        posSpecifics = { ...posSpecifics, ...verbSichUsageResult };
      }
    }
  }
  if (verbPrepositionsResult) {
    posSpecifics = { ...posSpecifics, ...verbPrepositionsResult.object };
  }

  // Merge adjective-specific results
  if (adjectiveTypeResult) {
    posSpecifics = { ...posSpecifics, ...adjectiveTypeResult.object };
  }
  if (adjectiveComparisonFormsResult) {
    posSpecifics = {
      ...posSpecifics,
      ...adjectiveComparisonFormsResult.object,
    };
  }
  if (adjectivePrepositionsResult) {
    posSpecifics = { ...posSpecifics, ...adjectivePrepositionsResult.object };
  }

  // Merge personal pronoun-specific results
  if (pronounTypeResult) {
    posSpecifics = { ...posSpecifics, ...pronounTypeResult.object };
  }
  if (pronounDeclensionsResult) {
    posSpecifics = { ...posSpecifics, ...pronounDeclensionsResult.object };
  }

  // Merge demonstrative pronoun-specific results
  if (demonstrativePronounDeclensionsResult) {
    posSpecifics = {
      ...posSpecifics,
      ...demonstrativePronounDeclensionsResult.object,
    };
  }

  return {
    normalizedWord,
    partOfSpeech,
    mainTranslation: basicTranslationResult.object.mainTranslation,
    additionalTranslations:
      basicTranslationResult.object.additionalTranslations,
    exampleSentences: exampleSentencesResult.object.exampleSentences,
    collocations: collocationsResult.object.collocations,
    synonyms: synonymsResult.object.synonyms,
    ...posSpecifics,
  };
};
