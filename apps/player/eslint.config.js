import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs } from '@vue/eslint-config-typescript';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**', '**/dev-dist/**'],
  },
  ...pluginVue.configs['flat/essential'],
  ...defineConfigWithVueTs(),
  {
    rules: {
      semi: ['error', 'always'],
    },
  },
];
