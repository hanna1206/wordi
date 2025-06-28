const config = {
  '*.{ts,tsx}': [
    'npm run lint:js',
    () => 'tsc --skipLibCheck --noEmit', // https://github.com/okonet/lint-staged/issues/825#issuecomment-620018284
    'prettier --write',
  ],
};

export default config;
