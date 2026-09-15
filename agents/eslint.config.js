export default [
  {
    name: 'app/files-to-lint',
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  {
    rules: {
      semi: ['error', 'always'],
    },
  },
];
