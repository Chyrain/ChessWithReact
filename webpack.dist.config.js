"use strict";

const webpack = require('webpack');
const argv = require('yargs').argv;
const confGenerator = require('./webpack.base.js');

const config = null;
const defaultConf = {
	outputPath: __dirname + '/public',
	externals: { /* 以外部库引入，不打包 */
		'react': 'window.React',
		'react-dom': 'window.ReactDOM'
	},
	// tmplName: __dirname + '/app/dist.tmpl.html',
};
if (/webpack-dev-server$/.test(argv.$0)) {
	config = confGenerator(defaultConf);

	config.plugins.push(new webpack.HotModuleReplacementPlugin()); //热加载插件
	config.output.filename = "[name]_[hash:10].js";
} else {
	defaultConf.tmplName = __dirname + '/app/dist.tmpl.html';
	config = confGenerator(defaultConf);

	config.entry = {index:[__dirname + "/app/index.jsx"]};
	config.output.filename = "[name]_[chunkhash:10].js";
	// delete config.externals; // 全部打包进一个bundle
}

/* 压缩 */
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
	compress: {
		warnings: false
	}
}));

module.exports = config;