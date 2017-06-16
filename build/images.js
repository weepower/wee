const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const svgo = require('imagemin-svgo');
const paths = require('./paths');
const glob = require('glob');
const chalk = require('chalk');

// Declare start of image compression
console.log(chalk.underline.blue('\nCompressing Images\n'));

// Find all image paths
glob.sync(paths.images + '/**/*.{jpg,jpeg,png,svg}').forEach(file => {
	let segments = file.split('/');
	let destination = segments.slice(segments.indexOf('images') + 1);

	// Take out file name as we only want to declare the destination directory
	if (destination.length) {
		destination.pop();
	}

	// Compress image
	imagemin([file], `${paths.output.images}/${destination.join('/')}/`, {
		plugins: [
			mozjpeg({
				quality: 85
			}),
			pngquant({
				quality: '80-85'
			}),
			svgo()
		]
	}).then(files => {
		files.forEach(file => {
			let segments = file.path.split('/');
			let destination = '/' + segments.slice(segments.indexOf('images')).join('/');

			console.log(chalk.blue('Compressed: ') + destination);
		});
	}).catch(error => {
		console.log(chalk.red('Error: ') + error.message);
	});
});