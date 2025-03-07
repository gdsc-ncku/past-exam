import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends(
        'next/core-web-vitals',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
), {
    plugins: {
        '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-require-imports': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        'no-console': 'warn',
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
    },
}];