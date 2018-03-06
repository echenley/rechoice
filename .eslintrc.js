module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:flowtype/recommended',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true,
  },
  parser: 'babel-eslint',
  plugins: ['react', 'jest', 'flowtype'],
  rules: {
    'no-unused-vars': 'error',
    'react/jsx-sort-props': 'error',
    'react/prop-types': 0,
  },
  globals: {
    fetch: true,
  },
}
