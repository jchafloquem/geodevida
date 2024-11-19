// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
	{
		files: ['**/*.ts'],
		extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic, ...angular.configs.tsRecommended],
		processor: angular.processInlineTemplates,
		rules: {
			'no-empty-function': 'off',
			'@typescript-eslint/no-empty-function': [
				'off',
				{
					allow: ['protected-constructors'],
				},
			],
			'@typescript-eslint/explicit-module-boundary-types': 'error',
			'@typescript-eslint/explicit-member-accessibility': [
				'error',
				{
					accessibility: 'explicit',
					overrides: {
						accessors: 'explicit',
						constructors: 'no-public',
						methods: 'no-public',
						properties: 'explicit',
						parameterProperties: 'explicit',
					},
				},
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'no-debugger': 'warn',
			'no-var': 'off',
			// "prefer-const": "error",
			'prefer-template': 'off',
			// "no-console": "warn",
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-unused-vars': 'warn',
			'@angular-eslint/component-class-suffix': [
				'off',
				{
					suffixes: ['Page', 'Component'],
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'app',
					style: 'kebab-case',
				},
			],
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'app',
					style: 'camelCase',
				},
			],
			'@angular-eslint/use-lifecycle-interface': ['error'],
			'@typescript-eslint/member-ordering': 0,
			'@typescript-eslint/naming-convention': 0,
		},
	},
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
		rules: {},
	}
);
