/* eslint-disable no-console */
import 'dotenv/config';

import { execSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { environment } from '@/config/environment.config';
import * as multipleChoiceService from '@/modules/multiple-choice/multiple-choice.service';

import type { DistractorTestCase } from './test-cases';
import { testCases } from './test-cases';

// Constants
const OUTPUT_DIR = 'llm-tests/distractor-generation/results';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;
const RETRY_BACKOFF_MULTIPLIER = 2;

// Interfaces
export interface DistractorTestResult {
  testCase: DistractorTestCase;
  success: boolean;
  response?: {
    distractors: string[];
  };
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

export interface GitMetadata {
  branch: string;
  commitHash: string;
  commitDate: string;
}

export interface DistractorTestRunOutput {
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
  results: DistractorTestResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    averageDurationMs: number;
  };
}

// ============================================================================
// 2.1 Credential Validation
// Requirements: 1.1, 1.2, 1.3
// ============================================================================

const { llmProvider } = environment;

export const validateCredentials = (): void => {
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

// ============================================================================
// 2.2 Git Metadata Collection
// Requirements: 1.4
// ============================================================================

export const getGitBranch = (): string => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
    }).trim();
  } catch {
    return 'unknown';
  }
};

export const getGitCommitHash = (): string => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
};

export const getGitCommitDate = (): string => {
  try {
    return execSync('git log -1 --format=%cI', { encoding: 'utf-8' }).trim();
  } catch {
    return new Date().toISOString();
  }
};

export const collectGitMetadata = (): GitMetadata => {
  return {
    branch: getGitBranch(),
    commitHash: getGitCommitHash(),
    commitDate: getGitCommitDate(),
  };
};

// ============================================================================
// 2.3 Retry Logic with Exponential Backoff
// Requirements: 3.2
// ============================================================================

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const executeWithRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
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

      // Calculate delay with exponential backoff (1s, 2s, 4s)
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

// ============================================================================
// Response Validation
// Requirements: 4.1, 4.2, 4.3, 4.4
// ============================================================================

export const validateResponse = (
  distractors: string[],
  correctAnswer: string,
): string | null => {
  // Check that exactly 3 distractors are returned
  if (!distractors || distractors.length !== 3) {
    return `Expected exactly 3 distractors, got ${distractors?.length ?? 0}`;
  }

  // Check that no distractor matches the correct answer
  const normalizedCorrect = correctAnswer.toLowerCase().trim();
  for (const distractor of distractors) {
    if (distractor.toLowerCase().trim() === normalizedCorrect) {
      return `Distractor "${distractor}" matches the correct answer "${correctAnswer}"`;
    }
  }

  // Check that all distractors are non-empty strings
  for (let i = 0; i < distractors.length; i++) {
    if (!distractors[i] || distractors[i].trim() === '') {
      return `Distractor at index ${i} is empty or whitespace-only`;
    }
  }

  // Check for duplicate distractors
  const normalizedDistractors = distractors.map((d) => d.toLowerCase().trim());
  const uniqueDistractors = new Set(normalizedDistractors);
  if (uniqueDistractors.size !== distractors.length) {
    return 'Duplicate distractors found';
  }

  return null;
};

// ============================================================================
// 2.4 Single Test Execution
// Requirements: 3.1, 3.3
// ============================================================================

export const executeSingleTest = async (
  testCase: DistractorTestCase,
): Promise<DistractorTestResult> => {
  const startTime = new Date();

  try {
    // Format the item for the service call
    const itemsFormatted = `ID: ${testCase.id}
Target Language Word: ${testCase.targetLanguageWord}
Native Language Translation: ${testCase.nativeLanguageTranslation}
Part of Speech: ${testCase.partOfSpeech}${testCase.gender ? `\nGender: ${testCase.gender}` : ''}`;

    // Call generateDistractors service with retry logic
    const response = await executeWithRetry(() =>
      multipleChoiceService.generateDistractors(
        itemsFormatted,
        testCase.targetLanguage,
        testCase.nativeLanguage,
      ),
    );

    const endTime = new Date();

    // Extract distractors for this test case
    const distractors = response.distractors[testCase.id];

    if (!distractors) {
      return {
        testCase,
        success: false,
        error: {
          message: `No distractors returned for test case ID: ${testCase.id}`,
        },
        timing: {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationMs: endTime.getTime() - startTime.getTime(),
        },
      };
    }

    // Validate response
    const validationError = validateResponse(
      distractors,
      testCase.targetLanguageWord,
    );

    if (validationError) {
      return {
        testCase,
        success: false,
        response: { distractors },
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
      response: { distractors },
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

// ============================================================================
// 2.5 Main Test Loop
// Requirements: 3.4, 3.5
// ============================================================================

export const runTests = async (): Promise<DistractorTestResult[]> => {
  const results: DistractorTestResult[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(
      `[${i + 1}/${testCases.length}] Testing "${testCase.targetLanguageWord}" (${testCase.id})...`,
    );

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

// ============================================================================
// Summary Calculation (for task 3)
// Requirements: 5.5, 6.1
// ============================================================================

export const calculateSummary = (
  results: DistractorTestResult[],
): DistractorTestRunOutput['summary'] => {
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

// ============================================================================
// Output filename generation (for task 3)
// Requirements: 5.2
// ============================================================================

export const generateOutputFilename = (
  provider: string,
  timestamp: Date,
): string => {
  const formattedTimestamp = timestamp
    .toISOString()
    .replace(/T/, '-')
    .replace(/:/g, '-')
    .replace(/\..+/, '');
  return `distractor-generation-${provider}-${formattedTimestamp}.json`;
};

// ============================================================================
// Results File Writing (for task 3)
// Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
// ============================================================================

export const writeResultsToFile = (
  results: DistractorTestResult[],
  gitMetadata: GitMetadata,
): string => {
  // Create output directory if it doesn't exist
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate filename with provider and timestamp
  const timestamp = new Date();
  const filename = generateOutputFilename(llmProvider || 'unknown', timestamp);
  const filepath = join(OUTPUT_DIR, filename);

  // Calculate summary
  const summary = calculateSummary(results);

  // Structure JSON output
  const output: DistractorTestRunOutput = {
    metadata: {
      timestamp: timestamp.toISOString(),
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

// ============================================================================
// Console Output (for task 3)
// Requirements: 1.4, 6.1, 6.2
// ============================================================================

export const printHeader = (gitMetadata: GitMetadata): void => {
  console.log('\n' + '='.repeat(60));
  console.log(`Testing provider: ${llmProvider}`);
  console.log(`Git: ${gitMetadata.branch} @ ${gitMetadata.commitHash}`);
  console.log(`Commit date: ${gitMetadata.commitDate}`);
  console.log(`Test cases: ${testCases.length}`);
  console.log('='.repeat(60) + '\n');
};

export const printSummary = (
  results: DistractorTestResult[],
  filepath: string,
): void => {
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

// ============================================================================
// Main Entry Point (for task 4)
// Requirements: 1.1, 1.2, 1.3
// ============================================================================

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
