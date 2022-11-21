#!/bin/node

const Path = require('path');
const FS = require('fs');
const { https } = require('follow-redirects');
const Parser = require('csv-parse');

const SHEET =
	'https://docs.google.com/spreadsheets/d/1OKFriFyzpZhV6XEzPE3T7F6j6Pk10PMdi-oIy1-iYN8/gviz/tq\?tqx\=out:csv';

const DEST = 'locales';

function read(url) {
	return new Promise((resolve, reject) => {
		var request = https.get(url, function(res) {
			var data = '';
			res.on('data', function(chunk) {
				data += chunk;
			});
			res.on('end', function() {
				resolve(data);
			});
		});
		request.on('error', function(e) {
			reject(e.message);
		});
		request.end();
	});
}

function parse(input) {
	FS.writeFileSync('data/google.csv', input);
	return new Promise((resolve, reject) => {
		Parser(input, {}, (err, output) => {
			function setData(data, path, content) {
				let key = path.pop();
				let dest = data;
				path.forEach(p => {
					if (!dest[p]) {
						dest[p] = {};
					}
					dest = dest[p];
				});
				dest[key] = content;
			}

			if (err) {
				console.error(err.message);
				reject(err);
			}
			const head = output.shift();
			const result = {};
			for (var i = 1; i < head.length; i++) {
				const langKey = head[i];
				if (!/\w{2}/.test(langKey)) continue;
				console.log('Processing language', langKey);

				const langData = {};
				result[langKey] = langData;
				output.forEach(line => {
					const key = line[0];
					// "the.text" = "value" => {the: {text: 'value'}}
					// line[1] is german
					setData(langData, key.split('.'), line[i] || `[${langKey}: ${line[1]}]`);
				});
			}
			resolve(result);
		});
	});
}

function write(path, content) {
	console.log('writing to file: ', path + '.json');
	FS.writeFileSync(path + '.json', JSON.stringify(content, null, '\t'));
}

module.exports = function(done) {
	read(SHEET)
		.then(csvdata => parse(csvdata))
		.then(data => {
			Object.keys(data).forEach(lang => {
				write(Path.join(DEST, lang), data[lang]);
			});
			if (done) done();
		})
		.catch(error => {
			console.log(error);
			if (done) done();
		});
};
