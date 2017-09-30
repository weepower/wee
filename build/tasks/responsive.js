const paths = require('../paths');
const fs = require('fs-extra');
const glob = require('glob');

function buildBreakpoint(breakpoint, count) {
	let html = `html { font-family: '${count}'; }`;

	return `@${breakpoint} { ${html} }\n`;
}

module.exports = breakpoints => {
	let count = 2,
		result = '';

	for (let breakpoint in breakpoints) {
		result += buildBreakpoint(breakpoint, count);
		count++;
	}

	fs.mkdirsSync(paths.temp);
	fs.writeFileSync(paths.temp + '/responsive.scss', result);
};