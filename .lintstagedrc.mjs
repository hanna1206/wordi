const config = {
  '*.{ts,tsx}': [
    'npm run lint:js',
    () => 'tsc --skipLibCheck --noEmit', // https://github.com/okonet/lint-staged/issues/825#issuecomment-620018284
    'npm run lint:css',
    'prettier --write',
  ],
  'src/*.css': ['npm run lint:css', 'prettier --write'],
};

export default config;
