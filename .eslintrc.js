const { strictEslint } = require('@umijs/fabric');

module.exports = {
  ...strictEslint,
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
  rules: {
    'arrow-parens': 0,
    'global-require': 0,
    'import/prefer-default-export': 0,
    'no-console': 0,
    'no-mixed-operators': 0,
    'no-use-before-define': 0,
    radix: 0,
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
    semi: [2, 'always'],
  },
};
