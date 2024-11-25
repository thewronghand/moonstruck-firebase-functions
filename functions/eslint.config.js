const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const googleConfig = require('eslint-config-google');

module.exports = [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.dev.json'],
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      import: importPlugin,
    },
    rules: {
      ...googleConfig.rules,
      quotes: ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],
      'require-jsdoc': 'off',
      'comma-dangle': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      indent: ['error', 2],
      'new-cap': 'off',
      'max-len': ['error', { code: 120 }],
      'quote-props': [
        'error',
        'as-needed',
        {
          keywords: false,
          unnecessary: true,
          numbers: false,
        },
      ],
    },
    ignores: ['/lib/**/*', '/generated/**/*'],
  },
];
