module.exports = {
  extends: [
    'stylelint-prettier/recommended',
    'stylelint-config-recommended-scss',
    'stylelint-config-recess-order',
  ],
  plugins: ['stylelint-scss', 'stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    'color-no-invalid-hex': true,
    'font-family-no-duplicate-names': true,
    'function-calc-no-invalid': true,
    'function-calc-no-unspaced-operator': true,
    'unit-no-unknown': true,
    'property-no-unknown': [true, { severity: 'warning' }],
    'block-no-empty': true,
    'no-duplicate-at-import-rules': true,
    'no-extra-semicolons': true,
    'no-invalid-double-slash-comments': true,
    'block-closing-brace-newline-after': 'always',
    'declaration-block-no-shorthand-property-overrides': [
      true,
      { severity: 'warning' },
    ],
  },
};
