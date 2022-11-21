var browserSyncInstance;

module.exports = function server(done) {
	const port = parseInt(process.env.PORT, 10) || 8080;
	if (!browserSyncInstance) {
		browserSyncInstance = require('browser-sync').create();
	}
	console.log(`Starting preview server at http://localhost:${port}`);
	browserSyncInstance.init(
		{
			port: port,
			online: false,
			ghostMode: false,
			open: true,
			notify: false,
			watch: true,
			logLevel: 'silent',
			server: {
				baseDir: 'build',
				directory: false,
				index: 'index.html'
			},
			middleware: [
				{
					route: '/__refresh',
					handle: function(req, res, next) {
						require('./importGoogle')(() => {
							res.writeHead(200, {
								'Content-Type': 'application/json'
							});
							res.end(JSON.stringify({ success: true }));
						});
					}
				}
			]
		},
		done
	);
};

module.exports.browserSync = () => browserSyncInstance;
