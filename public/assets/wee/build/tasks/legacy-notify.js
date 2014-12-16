module.exports = function(grunt) {
	grunt.registerTask('notifyLegacy', function() {
		Wee.notify({
			title: 'Legacy Compiled',
			message: 'Legacy style successfully compiled'
		});
	});
};