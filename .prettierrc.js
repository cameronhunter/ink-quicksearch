module.exports = {
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'none',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'always',
    proseWrap: 'always',
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2
            }
        },
        {
            files: '*.md',
            options: {
                tabWidth: 2,
                printWidth: 80
            }
        }
    ]
};
