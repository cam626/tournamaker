const webpackConfig = require('./webpack.config.js');

webpackConfig.devtool = 'inline-source-map';
webpackConfig.entry = {};
webpackConfig.watch = true;

module.exports = function (config) {
	config.set({
		basePath: '',
    	webpack: webpackConfig, 
		browsers: ['Chrome'],
		singleRun: true,
		frameworks: ['mocha', 'chai'],
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
	})
}
