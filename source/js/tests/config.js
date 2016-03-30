// Documentation available at https://theintern.github.io

define({
	proxyPort: 9010,
	proxyUrl: 'http://localhost:9010/',
	excludeInstrumentation: /^(?:node_modules|public)\//,
	tunnel: 'NullTunnel',
	loaderOptions: {
		packages: [
			{
				name: 'Script',
				location: 'public/assets/js',
				main: 'script.min.js'
			}
		]
	},
	suites: [
		'source/js/tests/unit/example'
	],
	functionalSuites: [

	],
	environments: [
		{
			browserName: 'chrome'
		}
	]
});