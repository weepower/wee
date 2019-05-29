const path = require('path');

module.exports = {
    parserOptions: {
        parser: 'babel-eslint',
    },
    extends: [
        // https://github.com/airbnb/javascript
        'airbnb-base',
        // https://eslint.vuejs.org/rules/
        'plugin:vue/recommended',
    ],
    plugins: [
        'import',
        'vue',
    ],
    settings: {
        'import/resolver': {
            webpack: {
                config: path.resolve(__dirname, 'build/webpack.dev.config.js'),
            },
        },
    },
    rules: {
        strict: 0,
        indent: ['error', 4],
        'eol-last': 0,
        'no-plusplus': 0,
        'prefer-template': 0,
        'import/prefer-default-export': 0,
        'space-unary-ops': 0,
        'newline-per-chained-call': 0,
        radix: 0,
        'import/no-dynamic-require': 0,
        'no-param-reassign': [
            'error',
            {
                ignorePropertyModificationsFor: [
                    'state'
                ],
            },
        ],
        'vue/html-indent': ['error', 4],
    },
};
