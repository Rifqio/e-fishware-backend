import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    {
        files: ['**/*.js'],
        languageOptions: { sourceType: 'commonjs' },
    },
    {
        languageOptions: { globals: { process: true, ...globals.browser } },
    },
    pluginJs.configs.recommended,
];
