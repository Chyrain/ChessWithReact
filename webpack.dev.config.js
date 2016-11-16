"use strict";

const webpack = require('webpack');
const argv = require('yargs').argv;
const confGenerator = require('./webpack.base.js');

const config = confGenerator({
	outputPath: __dirname + '/build',
});

if (/webpack-dev-server$/.test(argv.$0)) {
	config.devtool = 'eval-source-map';
	config.plugins.push(new webpack.HotModuleReplacementPlugin()); //热加载插件
	config.output.filename = "[name]_[hash:10].js";
} else {
	config.entry = {index:[__dirname + "/app/index.jsx"]};
	config.output.filename = "[name]_[chunkhash:10].js";
}

module.exports = config;