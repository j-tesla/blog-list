module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': ['warn', {
      vars: 'all',
      args: 'none',
      ignoreRestSiblings: false,
    }],
    'no-underscore-dangle': 'off',
    'consistent-return': 'warn',
    'max-classes-per-file': 'off',
  },
};
