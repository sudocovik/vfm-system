const { resolve } = require('path')
module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  // https://eslint.vuejs.org/user-guide/#how-to-use-custom-parser
  // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
  // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
  parserOptions: {
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#configuration
    // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#eslint
    // Needed to make the parser take into account 'vue' files
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },

  env: {
    browser: true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // consider disabling this class of rules if linting takes too long
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

    'standard',
  ],

  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint',

    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    // required to lint *.vue files
    'vue',

  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly',
  },

  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    'no-void': 'off',
    'multiline-ternary': 'off',

    'import/first': 'off',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',

    // TypeScript
    quotes: ['warn', 'single', { avoidEscape: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // Additional Vue
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
    ],
    'vue/match-component-file-name': [
      'error',
      {
        'extensions': [
          'vue',
        ],
        'shouldMatchCase': true,
      },
    ],

    // Custom Eslint
    'brace-style': ['error', 'stroustrup'],

    'no-unused-vars': 'off', // Does not understand types
    '@typescript-eslint/no-unused-vars': 'error',

    'no-useless-constructor': 'off', // Does not understand types
    '@typescript-eslint/no-useless-constructor': 'error',

    'no-empty-function': 'off', // Does not understand types
    '@typescript-eslint/no-empty-function': ['error', { 'allow': ['private-constructors'] }],
    '@typescript-eslint/unbound-method': ['error', { 'ignoreStatic': true }]
  },

  overrides: [
    {
      files: ['*.ts', '*.vue'],
      rules: {
        'no-undef': 'off' // TypeScript already handles these errors
      }
    },
    {
      files: ['**/*.spec.{js,ts}', '**/__tests__/*.spec.{js,ts}', '**/__tests__/helpers/*.{js,ts}', 'test/support/*.{js,ts}', '**/*.cy.{js,ts}'],
      extends: [
        // Add Cypress-specific lint rules, globals and Cypress plugin
        // See https://github.com/cypress-io/eslint-plugin-cypress#rules
        'plugin:cypress/recommended',
      ],
    },
    {
      files: ['**/__tests__/**.test.{js,ts}'],
      extends: [
        // Add Jest-specific lint rules and Jest plugin
        // See https://github.com/jest-community/eslint-plugin-jest#recommended
        'plugin:jest/recommended',
        // Uncomment following line to apply style rules
        // 'plugin:jest/style',
      ],
    },
  ],
}
