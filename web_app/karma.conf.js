const webpackConfig = require('./webpack.config.js');

webpackConfig.mode = 'development';

module.exports = function (config) {
	config.set({
		basePath: '',
    	webpack: webpackConfig,
    	port: 9876,
		colors: true,
		singleRun: true,
		concurrency: Infinity,
		frameworks: ['mocha', 'chai'],
		plugins: ['karma-*'],
		files: ['./test/**/*.+(js|jsx)'],
		preprocessors: {
			'./test/**/*.+(js|jsx)': ['webpack', 'sourcemap'],
			'./main/**/*.+(js|jsx)': ['webpack', 'sourcemap']
		},
		reporters: ['mocha'],
		client: {
			mocha: {
				timeout: '5000',
				reporter: 'html',
        		ui: 'bdd'
			}
		},
		webpackServer: {
			noInfo: true
		},
		browserNoActivityTimeout: 100000
	});
};
