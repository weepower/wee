module.exports = {
    extends: 'stylelint-config-standard',
    plugins: [
        'stylelint-order'
    ],
    rules: {
        'order/properties-alphabetical-order': true,
        'at-rule-no-unknown': null,
        'no-eol-whitespace': null,
        indentation: 4,
        'number-leading-zero': null,
        'at-rule-no-vendor-prefix': true,
        'media-feature-name-no-vendor-prefix': true,
        'property-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,
        'string-quotes': 'single',
        'at-rule-name-case': null,
    },
};
