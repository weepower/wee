// Documentation available at https://theintern.github.io

define({
	proxyPort: 9010,
	proxyUrl: 'http://localhost:9010/',
	excludeInstrumentation: /^(?:bower_components|node_modules)\//,
	tunnel: 'NullTunnel',
	loader: {
		packages: [
			{
				name: 'Wee',
				location: 'public/assets/js',
				main: 'script.min.js'
			}
		]
	},
	functionalSuites: [

	],
	suites: [
		'source/js/tests/unit/example'
	],
	environments: [
		{
			browserName: 'chrome'
		}
	]
});