module.exports = function(grunt) {
	grunt.registerTask('notifyImages', function() {
		Wee.notify({
			title: 'Images Minified',
			message: 'Images minified successfully'
		});
	});
};