module.exports = function(grunt) {
	grunt.registerTask('notifyCore', function() {
		Wee.notify({
			title: 'Config Updated',
			message: 'Project config updated successfully'
		});
	});
};