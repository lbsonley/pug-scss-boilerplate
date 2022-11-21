module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2022: true,
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 'latest',
	},
	plugins: [
		'unicorn',
		'prettier'
	],
	extends: [
		'eslint:recommended',
		'plugin:unicorn/recommended',
		'plugin:prettier/recommended'
	],
	rules: {
		'prettier/prettier': 'error'
	},
};
