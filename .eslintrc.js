module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'implicit-arrow-linebreak': 'off',
    'class-methods-use-this': 'off',
    camelcase: 'off',
    '@typescript-eslint/camelcase': ['warn'],
    'interface-name-prefix': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'import/no-cycle': 'off',
  },
};
