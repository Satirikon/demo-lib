module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', //Specify eslint parser
    plugins: ['@typescript-eslint'],
    ignorePatterns: ['*.d.ts'],
    extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.eslint.json'],
    },
    rules: {
        complexity: ['error', 10],
        'no-console': 'off',
        'class-methods-use-this': 0,
        'consistent-return': 0,
        'no-new': 0,
        'no-param-reassign': [
            'error',
            {
                props: true,
                ignorePropertyModificationsFor: ['coverage'],
            },
        ],
        '@typescript-eslint/no-unsafe-call': 1,
        '@typescript-eslint/no-unsafe-assignment': 1,
        'import/no-unresolved': ['error', { ignore: ['^@']}],
        '@typescript-eslint/no-unsafe-return': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/restrict-template-expressions': 0,
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: "^_.*"}],
        '@typescript-eslint/require-await': 0,
        'import/prefer-default-export': 0,
    },
    overrides: [
        {
            'files': ['*.test.ts', '*-testing-common.ts'],
            'rules': {
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
            }
        }
    ],
}