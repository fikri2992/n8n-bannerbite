module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:n8n-nodes-base/nodes',
  ],
  rules: {
    'n8n-nodes-base/node-class-description-missing-subtitle': 'error',
    'n8n-nodes-base/node-param-default-missing': 'error',
    'n8n-nodes-base/node-param-description-unneeded-backticks': 'warn',
    'n8n-nodes-base/node-param-operation-option-without-action': 'error',
    'n8n-nodes-base/node-param-option-name-unsuffixed': 'error',
    'n8n-nodes-base/node-param-option-value-duplicate': 'error',
    'n8n-nodes-base/node-param-operation-option-action-taken-other': 'error',
    'n8n-nodes-base/node-param-resource-with-plural-option': 'error',
    'n8n-nodes-base/node-param-resource-without-no-data-expression': 'error',
    'n8n-nodes-base/node-param-type-options-missing-from-limit': 'error',
    'n8n-nodes-base/node-param-type-options-missing-from-password': 'error',
    'n8n-nodes-base/node-param-type-options-missing-from-options': 'error',
    'n8n-nodes-base/param-option-name-wrong-for-upsert': 'error',
    'n8n-nodes-base/param-option-name-wrong-for-simplify': 'error',
    'n8n-nodes-base/param-option-description-wrong-for-simplify': 'error',
    'n8n-nodes-base/param-option-description-wrong-for-ignore-ssl-issues': 'error',
    'n8n-nodes-base/param-option-name-wrong-for-ignore-ssl-issues': 'error',
    'n8n-nodes-base/param-option-name-wrong-for-simplify': 'error',
    'n8n-nodes-base/param-option-value-wrong-for-simplify': 'error',
    'n8n-nodes-base/param-option-value-wrong-for-ignore-ssl-issues': 'error',
    'n8n-nodes-base/param-option-name-wrong-for-json-parameter': 'error',
    'n8n-nodes-base/param-option-value-wrong-for-json-parameter': 'error',
    'n8n-nodes-base/param-option-name-wrong-for-collection': 'error',
    'n8n-nodes-base/param-option-value-wrong-for-collection': 'error',
    'n8n-nodes-base/param-option-name-wrong-for-multi-options': 'error',
    'n8n-nodes-base/param-option-value-wrong-for-multi-options': 'error',
    'n8n-nodes-base/param-option-name-wrong-for-date-time': 'error',
    'n8n-nodes-base/param-option-value-wrong-for-date-time': 'error',
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
      },
    },
  ],
};
