module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:jest/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true
        },
        sourceType: 'module'
    },
    plugins: ['react', 'jest'],
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'no-console': 'off',
        // This causes false positives when importing types.
        'no-unused-vars': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
