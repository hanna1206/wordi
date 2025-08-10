import { gpt5MiniModel } from '@/services/llm/gpt-5-mini';

import {
  adjectiveComparisonFormsPrompt,
  outputStructure as adjectiveComparisonFormsOutputStructure,
} from './prompts/adjective-comparison-forms.prompt';
import {
  adjectivePrepositionsPrompt,
  outputStructure as adjectivePrepositionsOutputStructure,
} from './prompts/adjective-prepositions.prompt';
import {
  adjectiveTypePrompt,
  outputStructure as adjectiveTypeOutputStructure,
} from './prompts/adjective-type.prompt';
import {
  basicTranslationPrompt,
  outputStructure as basicTranslationOutputStructure,
} from './prompts/basic-translation.prompt';
import {
  collocationsPrompt,
  outputStructure as collocationsOutputStructure,
} from './prompts/collocations.prompt';
import {
  demonstrativePronounDeclensionsPrompt,
  outputStructure as demonstrativePronounDeclensionsOutputStructure,
} from './prompts/demonstrative-pronoun-declensions.prompt';
import {
  exampleSentencesPrompt,
  outputStructure as exampleSentencesOutputStructure,
} from './prompts/example-sentences.prompt';
import {
  normalizeWordPrompt,
  outputStructure as normalizeWordOutputStructure,
} from './prompts/normalize-word.prompt';
import {
  nounGenderPrompt,
  outputStructure as nounGenderOutputStructure,
} from './prompts/noun-gender.prompt';
import {
  nounPluralFormPrompt,
  outputStructure as nounPluralFormOutputStructure,
} from './prompts/noun-plural-form.prompt';
import {
  nounPrepositionsPrompt,
  outputStructure as nounPrepositionsOutputStructure,
} from './prompts/noun-prepositions.prompt';
import {
  outputStructure as pronounDeclensionsOutputStructure,
  pronounDeclensionsPrompt,
} from './prompts/pronoun-declensions.prompt';
import {
  outputStructure as pronounTypeOutputStructure,
  pronounTypePrompt,
} from './prompts/pronoun-type.prompt';
import {
  outputStructure as synonymsOutputStructure,
  synonymsPrompt,
} from './prompts/synonyms.prompt';
import {
  outputStructure as verbConjugationOutputStructure,
  verbConjugationPrompt,
} from './prompts/verb-conjugation.prompt';
import {
  outputStructure as verbPrepositionsOutputStructure,
  verbPrepositionsPrompt,
} from './prompts/verb-prepositions.prompt';
import {
  outputStructure as verbReflexivityOutputStructure,
  verbReflexivityPrompt,
} from './prompts/verb-reflexivity.prompt';
import {
  outputStructure as verbRegularityOutputStructure,
  verbRegularityPrompt,
} from './prompts/verb-regularity.prompt';
import {
  outputStructure as verbSeparablePrefixOutputStructure,
  verbSeparablePrefixPrompt,
} from './prompts/verb-separable-prefix.prompt';
import {
  outputStructure as verbSichUsageOutputStructure,
  verbSichUsagePrompt,
} from './prompts/verb-sich-usage.prompt';
import { PartOfSpeech } from './words-generation.const';

const WRONG_VERB_SEPARABLE_PREFIX_VALUES = ['null', '/', '/null'];

const basicTranslationLlm = gpt5MiniModel.withStructuredOutput(
  basicTranslationOutputStructure,
);
const basicTranslationChain = basicTranslationPrompt.pipe(basicTranslationLlm);

const exampleSentencesLlm = gpt5MiniModel.withStructuredOutput(
  exampleSentencesOutputStructure,
);
const exampleSentencesChain = exampleSentencesPrompt.pipe(exampleSentencesLlm);

const collocationsLlm = gpt5MiniModel.withStructuredOutput(
  collocationsOutputStructure,
);
const collocationsChain = collocationsPrompt.pipe(collocationsLlm);

const synonymsLlm = gpt5MiniModel.withStructuredOutput(synonymsOutputStructure);
const synonymsChain = synonymsPrompt.pipe(synonymsLlm);

const normalizeWordLlm = gpt5MiniModel.withStructuredOutput(
  normalizeWordOutputStructure,
);
const normalizeWordChain = normalizeWordPrompt.pipe(normalizeWordLlm);

const nounGenderLlm = gpt5MiniModel.withStructuredOutput(
  nounGenderOutputStructure,
);
const nounGenderChain = nounGenderPrompt.pipe(nounGenderLlm);

const nounPluralFormLlm = gpt5MiniModel.withStructuredOutput(
  nounPluralFormOutputStructure,
);
const nounPluralFormChain = nounPluralFormPrompt.pipe(nounPluralFormLlm);

const nounPrepositionsLlm = gpt5MiniModel.withStructuredOutput(
  nounPrepositionsOutputStructure,
);
const nounPrepositionsChain = nounPrepositionsPrompt.pipe(nounPrepositionsLlm);

const verbRegularityLlm = gpt5MiniModel.withStructuredOutput(
  verbRegularityOutputStructure,
);
const verbRegularityChain = verbRegularityPrompt.pipe(verbRegularityLlm);

const verbConjugationLlm = gpt5MiniModel.withStructuredOutput(
  verbConjugationOutputStructure,
);
const verbConjugationChain = verbConjugationPrompt.pipe(verbConjugationLlm);

const verbSeparablePrefixLlm = gpt5MiniModel.withStructuredOutput(
  verbSeparablePrefixOutputStructure,
);
const verbSeparablePrefixChain = verbSeparablePrefixPrompt.pipe(
  verbSeparablePrefixLlm,
);

const verbReflexivityLlm = gpt5MiniModel.withStructuredOutput(
  verbReflexivityOutputStructure,
);
const verbReflexivityChain = verbReflexivityPrompt.pipe(verbReflexivityLlm);

const verbSichUsageLlm = gpt5MiniModel.withStructuredOutput(
  verbSichUsageOutputStructure,
);
const verbSichUsageChain = verbSichUsagePrompt.pipe(verbSichUsageLlm);

const verbPrepositionsLlm = gpt5MiniModel.withStructuredOutput(
  verbPrepositionsOutputStructure,
);
const verbPrepositionsChain = verbPrepositionsPrompt.pipe(verbPrepositionsLlm);

const adjectiveTypeLlm = gpt5MiniModel.withStructuredOutput(
  adjectiveTypeOutputStructure,
);
const adjectiveTypeChain = adjectiveTypePrompt.pipe(adjectiveTypeLlm);

const adjectiveComparisonFormsLlm = gpt5MiniModel.withStructuredOutput(
  adjectiveComparisonFormsOutputStructure,
);
const adjectiveComparisonFormsChain = adjectiveComparisonFormsPrompt.pipe(
  adjectiveComparisonFormsLlm,
);

const adjectivePrepositionsLlm = gpt5MiniModel.withStructuredOutput(
  adjectivePrepositionsOutputStructure,
);
const adjectivePrepositionsChain = adjectivePrepositionsPrompt.pipe(
  adjectivePrepositionsLlm,
);

const pronounTypeLlm = gpt5MiniModel.withStructuredOutput(
  pronounTypeOutputStructure,
);
const pronounTypeChain = pronounTypePrompt.pipe(pronounTypeLlm);

const pronounDeclensionsLlm = gpt5MiniModel.withStructuredOutput(
  pronounDeclensionsOutputStructure,
);
const pronounDeclensionsChain = pronounDeclensionsPrompt.pipe(
  pronounDeclensionsLlm,
);

const demonstrativePronounDeclensionsLlm = gpt5MiniModel.withStructuredOutput(
  demonstrativePronounDeclensionsOutputStructure,
);
const demonstrativePronounDeclensionsChain =
  demonstrativePronounDeclensionsPrompt.pipe(
    demonstrativePronounDeclensionsLlm,
  );

export const getWordInfo = async (word: string, targetLanguage: string) => {
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
