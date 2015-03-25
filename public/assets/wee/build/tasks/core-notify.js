/* global module */

module.exports = function(grunt) {
	grunt.registerTask('notify', function(task) {
		var obj = {};

		if (task === 'project') {
			obj.title = 'Project Updated';
			obj.message = 'Config updated successfully';
		} else if (task === 'images') {
			obj.title = 'Images Minified';
			obj.message = 'Images minified successfully';
		} else if (task === 'script') {
			obj.title = 'Script Compiled';
			obj.message = 'JavaScript compiled successfully';
		} else if (task === 'style') {
			obj.title = 'Style Compiled';
			obj.message = 'CSS compiled successfully';
		} else if (task === 'legacy') {
			obj.title = 'Legacy Compiled';
			obj.message = 'Legacy style successfully compiled';
		}

		Wee.notify(obj);
	});
};