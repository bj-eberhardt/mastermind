import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import prettierConfig from '@vue/eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config({
  files: ['**/*.{js,ts,vue}'],
  ignores: ['**/.*', 'node_modules/**/*', 'dist/**/*'],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    ...pluginVue.configs['flat/essential'],
    ...vueTsEslintConfig(),
    prettierConfig,
  ],
  plugins: {
    'unused-imports': unusedImports,
  },
  rules: {
    'vue/no-unused-components': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'linebreak-style': ['error', 'unix'],
    'vue/multi-word-component-names': 'off',
    'unused-imports/no-unused-imports': 'error',
  },
});
