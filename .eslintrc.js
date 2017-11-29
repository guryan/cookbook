module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
     'no-unused-vars': 0,
     'no-undef': 0,
     'no-multi-spaces': 0
  },
  globals: {}
}
