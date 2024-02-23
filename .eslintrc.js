module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'arrow-parens': 0,
    'max-len': ['error', { code: 110 }],
    'no-unused-expressions': [
      1,
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'object-curly-newline': 0,
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'Vue',
          // for vuex state
          'state',
          // for reduce accumulators
          'acc',
          // for e.returnvalue
          'e',
        ],
      },
    ],
    'import/prefer-default-export': 0,
    'global-require': 0,
    'operator-linebreak': [2, 'after', { overrides: { '?': 'before', ':': 'before' } }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
