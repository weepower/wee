let variables = require('wee-core/styles/variables'),
	register = require('postcss-variables/lib/register');

// Add and overwrite variables here
// Example - variables.colors.primary = '#58a324';

module.exports = register(variables);