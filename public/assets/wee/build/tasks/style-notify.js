module.exports = function(grunt) {
	grunt.registerTask('notifyStyle', function() {
		Wee.notify({
			title: 'Style Compiled',
			message: 'CSS compiled successfully'
		});
	});
};