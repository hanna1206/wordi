/* eslint-disable no-console */
import 'dotenv/config';

import { execSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { environment } from '@/config/environment.config';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import { generateLinguisticItem } from '@/modules/linguistics/linguistics.service';
import type { LinguisticWordItem } from '@/modules/linguistics/linguistics.types';

import type { WordTestCase } from './test-cases';
import { testCases } from './test-cases';

// Constants
const OUTPUT_DIR = 'llm-tests/word-generation/results';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;
const RETRY_BACKOFF_MULTIPLIER = 2;

interface TestResult {
  testCase: WordTestCase;
  success: boolean;
  response?: LinguisticWordItem;
  error?: {
    message: string;
    stack?: string;
  };
  timing: {
    startTime: string;
    endTime: string;
    durationMs: number;
  };
}

interface GitMetadata {
  branch: string;
  commitHash: string;
  commitDate: string;
}

interface TestRunOutput {
  metadata: {
    timestamp: string;
    provider: string;
    totalTests: number;
    git: GitMetadata;
    environment: {
      nodeVersion: string;
      platform: string;
    };
  };
  results: TestResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    averageDurationMs: number;
  };
}

// Git metadata collection

const getGitBranch = (): string => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
    }).trim();
  } catch {
    return 'unknown';
  }
};

const getGitCommitHash = (): string => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
};

const getGitCommitDate = (): string => {
  try {
    return execSync('git log -1 --format=%cI', { encoding: 'utf-8' }).trim();
  } catch {
    return new Date().toISOString();
  }
};

const collectGitMetadata = (): GitMetadata => {
  return {
    branch: getGitBranch(),
    commitHash: getGitCommitHash(),
    commitDate: getGitCommitDate(),
  };
};

// Credential validation

const { llmProvider } = environment;

const validateCredentials = (): void => {
  if (!llmProvider) {
    console.error('Error: LLM_PROVIDER environment variable is not set.');
    console.error(
      'Please set LLM_PROVIDER to one of: openai, google, anthropic',
    );
    process.exit(1);
  }

  // Check API credentials based on provider
  if (llmProvider === 'openai') {
    if (!environment.openAIApiKey) {
      console.error('Error: Missing API credentials for OpenAI.');
      console.error('Please set the OPENAI_API_KEY environment variable.');
      process.exit(1);
    }
  } else if (llmProvider === 'google') {
    if (!environment.googleAiApiKey) {
      console.error('Error: Missing API credentials for Google.');
      console.error('Please set the GOOGLE_AI_API_KEY environment variable.');
      process.exit(1);
    }
  } else if (llmProvider === 'anthropic') {
    if (!environment.anthropicApiKey) {
      console.error('Error: Missing API credentials for Anthropic.');
      console.error('Please set the ANTHROPIC_API_KEY environment variable.');
      process.exit(1);
    }
  } else {
    console.error(`Error: Unknown provider "${llmProvider}".`);
    console.error('Supported providers: openai, google, anthropic');
    process.exit(1);
  }
};

// Retry logic with exponential backoff
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const executeWithRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if it's a rate limit or network error
      const errorMessage =
        error instanceof Error ? error.message.toLowerCase() : '';
      const isRetryableError =
        errorMessage.includes('rate limit') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('network') ||
        errorMessage.includes('econnreset') ||
        errorMessage.includes('enotfound');

      if (!isRetryableError || attempt === MAX_RETRIES - 1) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay =
        INITIAL_RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt);
      console.log(
        `  Retry attempt ${attempt + 1}/${MAX_RETRIES} after ${delay}ms...`,
      );
      await sleep(delay);
    }
  }

  throw lastError;
};

// Test execution

// Response validation
const validateResponse = (response: LinguisticWordItem): string | null => {
  // Check that response contains basic required fields
  if (!response.normalizedWord) {
    return 'Response missing normalizedWord';
  }
  if (!response.mainTranslation) {
    return 'Response missing mainTranslation';
  }
  if (!response.partOfSpeech || response.partOfSpeech.length === 0) {
    return 'Response missing partOfSpeech';
  }

  // Validate part-of-speech-specific properties
  for (const pos of response.partOfSpeech) {
    switch (pos) {
      case PartOfSpeech.NOUN: {
        const nounResponse = response as {
          gender?: unknown;
          pluralForm?: unknown;
        };
        if (nounResponse.gender === undefined) {
          return 'Noun response missing gender property';
        }
        if (nounResponse.pluralForm === undefined) {
          return 'Noun response missing pluralForm property';
        }
        break;
      }

      case PartOfSpeech.VERB: {
        const verbResponse = response as { conjugation?: unknown };
        if (verbResponse.conjugation === undefined) {
          return 'Verb response missing conjugation property';
        }
        break;
      }

      case PartOfSpeech.ADJECTIVE: {
        const adjectiveResponse = response as { comparisonForms?: unknown };
        if (adjectiveResponse.comparisonForms === undefined) {
          return 'Adjective response missing comparisonForms property';
        }
        break;
      }

      case PartOfSpeech.PERSONAL_PRONOUN:
      case PartOfSpeech.DEMONSTRATIVE_PRONOUN: {
        const pronounResponse = response as { declensions?: unknown };
        if (pronounResponse.declensions === undefined) {
          return 'Pronoun response missing declensions property';
        }
        break;
      }
    }
  }

  return null;
};

const executeSingleTest = async (
  testCase: WordTestCase,
): Promise<TestResult> => {
  const startTime = new Date();

  try {
    // Call generateLinguisticItem with retry logic
    const response = await executeWithRetry(() =>
      generateLinguisticItem(testCase.word, testCase.targetLanguage),
    );

    const endTime = new Date();

    // Validate response structure (will be implemented in subtask 3.2)
    const validationError = validateResponse(response);

    if (validationError) {
      return {
        testCase,
        success: false,
        response,
        error: {
          message: validationError,
        },
        timing: {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationMs: endTime.getTime() - startTime.getTime(),
        },
      };
    }

    return {
      testCase,
      success: true,
      response,
      timing: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationMs: endTime.getTime() - startTime.getTime(),
      },
    };
  } catch (error) {
    const endTime = new Date();
    const err = error as Error;

    return {
      testCase,
      success: false,
      error: {
        message: err.message,
        stack: err.stack,
      },
      timing: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationMs: endTime.getTime() - startTime.getTime(),
      },
    };
  }
};

// Main test loop

const runTests = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`[${i + 1}/${testCases.length}] Testing "${testCase.word}"...`);

    const result = await executeSingleTest(testCase);
    results.push(result);

    if (result.success) {
      console.log(
        `  ✓ Success (${(result.timing.durationMs / 1000).toFixed(1)}s)`,
      );
    } else {
      console.log(`  ✗ Failed: ${result.error?.message}`);
    }
  }

  return results;
};

// Summary statistics calculation
const calculateSummary = (results: TestResult[]): TestRunOutput['summary'] => {
  const total = results.length;
  const successful = results.filter((r) => r.success).length;
  const failed = total - successful;

  const totalDuration = results.reduce(
    (sum, r) => sum + r.timing.durationMs,
    0,
  );
  const averageDurationMs = total > 0 ? totalDuration / total : 0;

  return {
    total,
    successful,
    failed,
    averageDurationMs,
  };
};

// Result file writing

const writeResultsToFile = (
  results: TestResult[],
  gitMetadata: GitMetadata,
): string => {
  // Create output directory if it doesn't exist
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate filename with provider and timestamp
  const timestamp = new Date()
    .toISOString()
    .replace(/T/, '-')
    .replace(/:/g, '-')
    .replace(/\..+/, '');
  const filename = `word-generation-${llmProvider}-${timestamp}.json`;
  const filepath = join(OUTPUT_DIR, filename);

  // Calculate summary
  const summary = calculateSummary(results);

  // Structure JSON output
  const output: TestRunOutput = {
    metadata: {
      timestamp: new Date().toISOString(),
      provider: llmProvider || 'unknown',
      totalTests: results.length,
      git: gitMetadata,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
      },
    },
    results,
    summary,
  };

  // Write to file
  writeFileSync(filepath, JSON.stringify(output, null, 2), 'utf-8');

  return filepath;
};

// Console output
const printHeader = (gitMetadata: GitMetadata): void => {
  console.log('\n='.repeat(60));
  console.log(`Testing provider: ${llmProvider}`);
  console.log(`Git: ${gitMetadata.branch} @ ${gitMetadata.commitHash}`);
  console.log(`Commit date: ${gitMetadata.commitDate}`);
  console.log(`Test cases: ${testCases.length}`);
  console.log('='.repeat(60) + '\n');
};

const printSummary = (results: TestResult[], filepath: string): void => {
  const summary = calculateSummary(results);

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`Total: ${summary.total} tests`);
  console.log(`Successful: ${summary.successful}`);
  console.log(`Failed: ${summary.failed}`);
  console.log(
    `Average duration: ${(summary.averageDurationMs / 1000).toFixed(1)}s`,
  );
  console.log('='.repeat(60));
  console.log(`\nResults written to: ${filepath}\n`);
};

// Main execution
const main = async (): Promise<void> => {
  // Validate credentials
  validateCredentials();

  // Collect git metadata
  const gitMetadata = collectGitMetadata();

  // Print header
  printHeader(gitMetadata);

  // Run tests
  const results = await runTests();

  // Write results to file
  const filepath = writeResultsToFile(results, gitMetadata);

  // Print summary
  printSummary(results, filepath);
};

// Execute main function
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
