module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/typescript',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    'no-unused-vars': ['error', { argsIgnorePattern: '_|arg[0-9]{1,2}' }],
    'vue/html-indent': ['error', 2],
    'vue/attribute-hyphenation': ['off'],
    'vue/v-on-event-hyphenation': ['off'],
    'vue/max-attributes-per-line': ['off'],
    'vue/singleline-html-element-content-newline': ['off'],
    'vue/html-self-closing': ['off'],
    'no-constant-condition': ['error', { checkLoops: false }],
    'vue/no-v-html': ['off'],
  },
};
