import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  configPrettier,
  {
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-undef': 'error',
    },
  },
  {
    ignores: ['node_modules/', 'dist/'],
  },
];
