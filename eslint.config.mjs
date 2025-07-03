import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...fixupConfigRules(compat.extends('plugin:prettier/recommended')),
  {
    plugins: {
      prettier: fixupPluginRules(prettier),
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-console': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. "Side effect" imports, e.g. `import './setup';`
            ['^\\u0000'],

            // 2. Libs: React, @-prefixed lib imports, and other third-party libraries
            ['^react'],
            ['^@?\\w'],

            // 3. Imports of types from third-party libraries
            ['^import\\s+type\\s+.*\\s+from\\s+[\'"]@?\\w'],

            // 4. Absolute imports from your project
            ['^(@)(/.*|$)'],

            // 5. Sibling imports from your project
            ['^import\\s+type\\s+.*from\\s+[\'"]\\..*'],

            // 6. Relative imports from your project
            ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?!/?$)', '^\\./?$'],

            // 7. Other imports, e.g. `import './styles.css';`
            [],
          ],
        },
      ],

      'simple-import-sort/exports': 'error',

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
];

export default eslintConfig;
