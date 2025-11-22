import { gpt41Model } from '@/services/llm/gpt-4.1';

import { PartOfSpeech } from './linguistics.const';
import {
  InputClassification,
  LinguisticCollocationItem,
} from './linguistics.types';
import {
  classifyInputPrompt,
  outputStructure as classifyInputOutputStructure,
} from './prompts/collocations/classify-input.prompt';
import {
  collocationExamplesPrompt,
  outputStructure as collocationExamplesOutputStructure,
} from './prompts/collocations/collocation-examples.prompt';
import {
  collocationTranslationPrompt,
  outputStructure as collocationTranslationOutputStructure,
} from './prompts/collocations/collocation-translation.prompt';
import {
  componentWordsPrompt,
  outputStructure as componentWordsOutputStructure,
} from './prompts/collocations/component-words.prompt';
import {
  adjectiveComparisonFormsPrompt,
  outputStructure as adjectiveComparisonFormsOutputStructure,
} from './prompts/words/adjective-comparison-forms.prompt';
import {
  adjectivePrepositionsPrompt,
  outputStructure as adjectivePrepositionsOutputStructure,
} from './prompts/words/adjective-prepositions.prompt';
import {
  adjectiveTypePrompt,
  outputStructure as adjectiveTypeOutputStructure,
} from './prompts/words/adjective-type.prompt';
import {
  basicTranslationPrompt,
  outputStructure as basicTranslationOutputStructure,
} from './prompts/words/basic-translation.prompt';
import {
  collocationsPrompt,
  outputStructure as collocationsOutputStructure,
} from './prompts/words/collocations.prompt';
import {
  demonstrativePronounDeclensionsPrompt,
  outputStructure as demonstrativePronounDeclensionsOutputStructure,
} from './prompts/words/demonstrative-pronoun-declensions.prompt';
import {
  exampleSentencesPrompt,
  outputStructure as exampleSentencesOutputStructure,
} from './prompts/words/example-sentences.prompt';
import {
  normalizeWordPrompt,
  outputStructure as normalizeWordOutputStructure,
} from './prompts/words/normalize-word.prompt';
import {
  nounGenderPrompt,
  outputStructure as nounGenderOutputStructure,
} from './prompts/words/noun-gender.prompt';
import {
  nounPluralFormPrompt,
  outputStructure as nounPluralFormOutputStructure,
} from './prompts/words/noun-plural-form.prompt';
import {
  nounPrepositionsPrompt,
  outputStructure as nounPrepositionsOutputStructure,
} from './prompts/words/noun-prepositions.prompt';
import {
  outputStructure as pronounDeclensionsOutputStructure,
  pronounDeclensionsPrompt,
} from './prompts/words/pronoun-declensions.prompt';
import {
  outputStructure as pronounTypeOutputStructure,
  pronounTypePrompt,
} from './prompts/words/pronoun-type.prompt';
import {
  outputStructure as synonymsOutputStructure,
  synonymsPrompt,
} from './prompts/words/synonyms.prompt';
import {
  outputStructure as verbConjugationOutputStructure,
  verbConjugationPrompt,
} from './prompts/words/verb-conjugation.prompt';
import {
  outputStructure as verbPrepositionsOutputStructure,
  verbPrepositionsPrompt,
} from './prompts/words/verb-prepositions.prompt';
import {
  outputStructure as verbReflexivityOutputStructure,
  verbReflexivityPrompt,
} from './prompts/words/verb-reflexivity.prompt';
import {
  outputStructure as verbRegularityOutputStructure,
  verbRegularityPrompt,
} from './prompts/words/verb-regularity.prompt';
import {
  outputStructure as verbSeparablePrefixOutputStructure,
  verbSeparablePrefixPrompt,
} from './prompts/words/verb-separable-prefix.prompt';
import {
  outputStructure as verbSichUsageOutputStructure,
  verbSichUsagePrompt,
} from './prompts/words/verb-sich-usage.prompt';

const WRONG_VERB_SEPARABLE_PREFIX_VALUES = ['null', '/', '/null'];

// German articles for detection
const GERMAN_ARTICLES = {
  definite: ['der', 'die', 'das'],
  indefinite: ['ein', 'eine'],
} as const;

const basicTranslationLlm = gpt41Model.withStructuredOutput(
  basicTranslationOutputStructure,
);
const basicTranslationChain = basicTranslationPrompt.pipe(basicTranslationLlm);

const exampleSentencesLlm = gpt41Model.withStructuredOutput(
  exampleSentencesOutputStructure,
);
const exampleSentencesChain = exampleSentencesPrompt.pipe(exampleSentencesLlm);

const collocationsLlm = gpt41Model.withStructuredOutput(
  collocationsOutputStructure,
);
const collocationsChain = collocationsPrompt.pipe(collocationsLlm);

const synonymsLlm = gpt41Model.withStructuredOutput(synonymsOutputStructure);
const synonymsChain = synonymsPrompt.pipe(synonymsLlm);

const normalizeWordLlm = gpt41Model.withStructuredOutput(
  normalizeWordOutputStructure,
);
const normalizeWordChain = normalizeWordPrompt.pipe(normalizeWordLlm);

const nounGenderLlm = gpt41Model.withStructuredOutput(
  nounGenderOutputStructure,
);
const nounGenderChain = nounGenderPrompt.pipe(nounGenderLlm);

const nounPluralFormLlm = gpt41Model.withStructuredOutput(
  nounPluralFormOutputStructure,
);
const nounPluralFormChain = nounPluralFormPrompt.pipe(nounPluralFormLlm);

const nounPrepositionsLlm = gpt41Model.withStructuredOutput(
  nounPrepositionsOutputStructure,
);
const nounPrepositionsChain = nounPrepositionsPrompt.pipe(nounPrepositionsLlm);

const verbRegularityLlm = gpt41Model.withStructuredOutput(
  verbRegularityOutputStructure,
);
const verbRegularityChain = verbRegularityPrompt.pipe(verbRegularityLlm);

const verbConjugationLlm = gpt41Model.withStructuredOutput(
  verbConjugationOutputStructure,
);
const verbConjugationChain = verbConjugationPrompt.pipe(verbConjugationLlm);

const verbSeparablePrefixLlm = gpt41Model.withStructuredOutput(
  verbSeparablePrefixOutputStructure,
);
const verbSeparablePrefixChain = verbSeparablePrefixPrompt.pipe(
  verbSeparablePrefixLlm,
);

const verbReflexivityLlm = gpt41Model.withStructuredOutput(
  verbReflexivityOutputStructure,
);
const verbReflexivityChain = verbReflexivityPrompt.pipe(verbReflexivityLlm);

const verbSichUsageLlm = gpt41Model.withStructuredOutput(
  verbSichUsageOutputStructure,
);
const verbSichUsageChain = verbSichUsagePrompt.pipe(verbSichUsageLlm);

const verbPrepositionsLlm = gpt41Model.withStructuredOutput(
  verbPrepositionsOutputStructure,
);
const verbPrepositionsChain = verbPrepositionsPrompt.pipe(verbPrepositionsLlm);

const adjectiveTypeLlm = gpt41Model.withStructuredOutput(
  adjectiveTypeOutputStructure,
);
const adjectiveTypeChain = adjectiveTypePrompt.pipe(adjectiveTypeLlm);

const adjectiveComparisonFormsLlm = gpt41Model.withStructuredOutput(
  adjectiveComparisonFormsOutputStructure,
);
const adjectiveComparisonFormsChain = adjectiveComparisonFormsPrompt.pipe(
  adjectiveComparisonFormsLlm,
);

const adjectivePrepositionsLlm = gpt41Model.withStructuredOutput(
  adjectivePrepositionsOutputStructure,
);
const adjectivePrepositionsChain = adjectivePrepositionsPrompt.pipe(
  adjectivePrepositionsLlm,
);

const pronounTypeLlm = gpt41Model.withStructuredOutput(
  pronounTypeOutputStructure,
);
const pronounTypeChain = pronounTypePrompt.pipe(pronounTypeLlm);

const pronounDeclensionsLlm = gpt41Model.withStructuredOutput(
  pronounDeclensionsOutputStructure,
);
const pronounDeclensionsChain = pronounDeclensionsPrompt.pipe(
  pronounDeclensionsLlm,
);

const demonstrativePronounDeclensionsLlm = gpt41Model.withStructuredOutput(
  demonstrativePronounDeclensionsOutputStructure,
);
const demonstrativePronounDeclensionsChain =
  demonstrativePronounDeclensionsPrompt.pipe(
    demonstrativePronounDeclensionsLlm,
  );

const classifyInputLlm = gpt41Model.withStructuredOutput(
  classifyInputOutputStructure,
);
const classifyInputChain = classifyInputPrompt.pipe(classifyInputLlm);

const collocationTranslationLlm = gpt41Model.withStructuredOutput(
  collocationTranslationOutputStructure,
);
const collocationTranslationChain = collocationTranslationPrompt.pipe(
  collocationTranslationLlm,
);

const collocationExamplesLlm = gpt41Model.withStructuredOutput(
  collocationExamplesOutputStructure,
);
const collocationExamplesChain = collocationExamplesPrompt.pipe(
  collocationExamplesLlm,
);

const componentWordsLlm = gpt41Model.withStructuredOutput(
  componentWordsOutputStructure,
);
const componentWordsChain = componentWordsPrompt.pipe(componentWordsLlm);

export const generateLinguisticCollocationItem = async (
  collocation: string,
  targetLanguage: string,
): Promise<LinguisticCollocationItem> => {
  const [translationResult, examplesResult, componentWordsResult] =
    await Promise.all([
      collocationTranslationChain.invoke({ collocation, targetLanguage }),
      collocationExamplesChain.invoke({ collocation, targetLanguage }),
      componentWordsChain.invoke({ collocation, targetLanguage }),
    ]);

  return {
    normalizedCollocation: collocation,
    mainTranslation: translationResult.mainTranslation,
    exampleSentences: examplesResult.exampleSentences,
    componentWords: componentWordsResult.componentWords,
  };
};

export const classifyInput = async (
  input: string,
): Promise<InputClassification> => {
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
    const classificationResult = await classifyInputChain.invoke({
      input: trimmedInput,
    });

    if (classificationResult.classification === 'compound-word') {
      return {
        type: 'single-word',
        normalizedInput: classificationResult.normalizedForm,
      };
    } else {
      return {
        type: 'collocation',
        normalizedInput: classificationResult.normalizedForm,
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
  const { normalizedWord, partOfSpeech } = await normalizeWordChain.invoke({
    word,
  });

  // Run all translation-related queries in parallel
  const basicTranslationPromise = basicTranslationChain.invoke({
    word: normalizedWord,
    targetLanguage,
  });

  const exampleSentencesPromise = exampleSentencesChain.invoke({
    word: normalizedWord,
  });

  const collocationsPromise = collocationsChain.invoke({
    word: normalizedWord,
    targetLanguage,
  });

  const synonymsPromise = synonymsChain.invoke({
    word: normalizedWord,
  });

  // Run all noun-specific queries in parallel when it's a noun
  const nounGenderPromise = partOfSpeech.includes(PartOfSpeech.NOUN)
    ? nounGenderChain.invoke({ word: normalizedWord })
    : Promise.resolve(undefined);

  const nounPluralFormPromise = partOfSpeech.includes(PartOfSpeech.NOUN)
    ? nounPluralFormChain.invoke({ word: normalizedWord })
    : Promise.resolve(undefined);

  const nounPrepositionsPromise = partOfSpeech.includes(PartOfSpeech.NOUN)
    ? nounPrepositionsChain.invoke({ word: normalizedWord, targetLanguage })
    : Promise.resolve(undefined);

  // Run all verb-specific queries in parallel when it's a verb
  const verbRegularityPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? verbRegularityChain.invoke({ word: normalizedWord })
    : Promise.resolve(undefined);

  const verbConjugationPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? verbConjugationChain.invoke({ word: normalizedWord })
    : Promise.resolve(undefined);

  const verbSeparablePrefixPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? verbSeparablePrefixChain.invoke({ word: normalizedWord })
    : Promise.resolve(undefined);

  const verbReflexivityPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? verbReflexivityChain.invoke({ word: normalizedWord })
    : Promise.resolve(undefined);

  const verbPrepositionsPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? verbPrepositionsChain.invoke({ word: normalizedWord, targetLanguage })
    : Promise.resolve(undefined);

  // Run all adjective-specific queries in parallel when it's an adjective
  const adjectiveTypePromise = partOfSpeech.includes(PartOfSpeech.ADJECTIVE)
    ? adjectiveTypeChain.invoke({ word: normalizedWord })
    : Promise.resolve(undefined);

  const adjectiveComparisonFormsPromise = partOfSpeech.includes(
    PartOfSpeech.ADJECTIVE,
  )
    ? adjectiveComparisonFormsChain.invoke({ word: normalizedWord })
    : Promise.resolve(undefined);

  const adjectivePrepositionsPromise = partOfSpeech.includes(
    PartOfSpeech.ADJECTIVE,
  )
    ? adjectivePrepositionsChain.invoke({
        word: normalizedWord,
        targetLanguage,
      })
    : Promise.resolve(undefined);

  // Run all personal pronoun-specific queries in parallel when it's a personal pronoun
  const pronounTypePromise = partOfSpeech.includes(
    PartOfSpeech.PERSONAL_PRONOUN,
  )
    ? pronounTypeChain.invoke({ word: normalizedWord, targetLanguage })
    : Promise.resolve(undefined);

  const pronounDeclensionsPromise = partOfSpeech.includes(
    PartOfSpeech.PERSONAL_PRONOUN,
  )
    ? pronounDeclensionsChain.invoke({ word: normalizedWord, targetLanguage })
    : Promise.resolve(undefined);

  // Run demonstrative pronoun-specific queries when it's a demonstrative pronoun
  const demonstrativePronounDeclensionsPromise = partOfSpeech.includes(
    PartOfSpeech.DEMONSTRATIVE_PRONOUN,
  )
    ? demonstrativePronounDeclensionsChain.invoke({
        word: normalizedWord,
        targetLanguage,
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
    posSpecifics = { ...posSpecifics, ...nounGenderResult };
  }
  if (nounPluralFormResult) {
    posSpecifics = { ...posSpecifics, ...nounPluralFormResult };
  }
  if (nounPrepositionsResult) {
    posSpecifics = { ...posSpecifics, ...nounPrepositionsResult };
  }

  // Merge verb-specific results
  if (verbRegularityResult) {
    posSpecifics = { ...posSpecifics, ...verbRegularityResult };
  }
  if (verbConjugationResult) {
    posSpecifics = { ...posSpecifics, ...verbConjugationResult };
  }
  if (verbSeparablePrefixResult) {
    const normalizedPrefix = {
      separablePrefix:
        verbSeparablePrefixResult.separablePrefix != null &&
        WRONG_VERB_SEPARABLE_PREFIX_VALUES.includes(
          verbSeparablePrefixResult.separablePrefix,
        )
          ? null
          : verbSeparablePrefixResult.separablePrefix,
    };
    posSpecifics = { ...posSpecifics, ...normalizedPrefix };
  }
  if (verbReflexivityResult) {
    posSpecifics = { ...posSpecifics, ...verbReflexivityResult };

    // Only fetch sich usage if the verb is classified as 'both'
    if (verbReflexivityResult.isReflexive === 'both') {
      const verbSichUsageResult = await verbSichUsageChain.invoke({
        word: normalizedWord,
        targetLanguage,
      });
      if (verbSichUsageResult) {
        posSpecifics = { ...posSpecifics, ...verbSichUsageResult };
      }
    }
  }
  if (verbPrepositionsResult) {
    posSpecifics = { ...posSpecifics, ...verbPrepositionsResult };
  }

  // Merge adjective-specific results
  if (adjectiveTypeResult) {
    posSpecifics = { ...posSpecifics, ...adjectiveTypeResult };
  }
  if (adjectiveComparisonFormsResult) {
    posSpecifics = { ...posSpecifics, ...adjectiveComparisonFormsResult };
  }
  if (adjectivePrepositionsResult) {
    posSpecifics = { ...posSpecifics, ...adjectivePrepositionsResult };
  }

  // Merge personal pronoun-specific results
  if (pronounTypeResult) {
    posSpecifics = { ...posSpecifics, ...pronounTypeResult };
  }
  if (pronounDeclensionsResult) {
    posSpecifics = { ...posSpecifics, ...pronounDeclensionsResult };
  }

  // Merge demonstrative pronoun-specific results
  if (demonstrativePronounDeclensionsResult) {
    posSpecifics = {
      ...posSpecifics,
      ...demonstrativePronounDeclensionsResult,
    };
  }

  return {
    normalizedWord,
    partOfSpeech,
    mainTranslation: basicTranslationResult.mainTranslation,
    additionalTranslations: basicTranslationResult.additionalTranslations,
    exampleSentences: exampleSentencesResult.exampleSentences,
    collocations: collocationsResult.collocations,
    synonyms: synonymsResult.synonyms,
    ...posSpecifics,
  };
};
