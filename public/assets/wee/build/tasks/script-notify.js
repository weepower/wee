module.exports = function(grunt) {
	grunt.registerTask('notifyScript', function() {
		Wee.notify({
			title: 'Script Compiled',
			message: 'JavaScript compiled successfully'
		});
	});
};