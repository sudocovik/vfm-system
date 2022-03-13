module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'standard'
  ],

  plugins: [
    '@typescript-eslint'
  ],

  rules: {
    'no-unused-vars': 'off', // Does not understand types
    '@typescript-eslint/no-unused-vars': 'error',
    'no-useless-constructor': 'off', // Does not understand types
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-empty-function': 'off', // Does not understand types
    '@typescript-eslint/no-empty-function': ['error', { 'allow': ['private-constructors'] }],
    'no-new': 'off' // Remove once all pulumi objects get created and returned by a function
  },

  overrides: [
    {
      files: ['**/__tests__/**.{unit,integration}.{js,ts}'],
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
