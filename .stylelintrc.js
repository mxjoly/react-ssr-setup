module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'length-zero-no-unit': null,
    'at-rule-no-unknown': [true, { ignoreAtRules: /use/ }],
  },
};
