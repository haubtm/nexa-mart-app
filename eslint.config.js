// https://docs.expo.dev/guides/using-eslint/
import prettierPlugin from 'eslint-plugin-prettier';

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { prettier: prettierPlugin },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'prettier/prettier': 'error'
    }
  },
]);
