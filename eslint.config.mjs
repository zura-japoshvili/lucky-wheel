import parserPkg from '@typescript-eslint/parser';
import eslintPluginPkg from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserPkg,
      parserOptions: {
        ecmaVersion: 2020,
        project: './tsconfig.json',
      },
      globals: {
        browser: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginPkg,
    },
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          vars: 'all',
          ignoreRestSiblings: false,
        },
      ],
    },
  },
];
