module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  plugins: [
    "html"
  ],
  extends: 'standard',
  rules: {
    "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0,
    "indent": ["error", 2],
    "no-tabs": 0,
    'space-before-function-paren': 0,
    'comma-dangle': 0,
    'keyword-spacing': 0,
    'eol-last': 0
  }
 }