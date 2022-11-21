const fs = require('fs'),
	path = require('path');

function walkDir(dir) {
	const result = {};
	fs.readdirSync(dir).forEach(f => {
		if (f.indexOf('.') === 0) return;

		const dirPath = path.join(dir, f);
		const stat = fs.statSync(dirPath);
		const isDirectory = stat.isDirectory();
		if (isDirectory) {
			result[f] = walkDir(dirPath);
		} else {
			result[f] = '/' + path.relative('source', dirPath);
		}
	});
	return result;
}

module.exports = walkDir('source');
