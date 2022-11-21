module.exports = async function(done) {
	const { rollup } = require('rollup');
	var buble = require('rollup-plugin-buble');
	var resolve = require('rollup-plugin-node-resolve');
	var commonjs = require('rollup-plugin-commonjs');

	var rollupPlugins = [buble(), resolve(), commonjs()];
	if (process.env.NODE_ENV === 'production') {
		rollupPlugins.push(require('rollup-plugin-uglify').uglify());
	}
	const rollupConfig = {
		input: './source/assets/js/main.js',
		output: {
			format: 'iife',
			file: './build/assets/js/main.js'
		},
		plugins: rollupPlugins
	};
	const bundle = await rollup(rollupConfig);
	await bundle.write(rollupConfig.output);
};
