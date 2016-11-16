"use strict";

const webpack = require('webpack');
const argv = require('yargs').argv;
const HtmlWebpackPlugin = require('html-webpack-plugin');  //生成最终的Html5文件，自动引用你打包后的JS文件
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //分离CSS和JS文件
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const defaultConf = {
	port: argv.port,
	devtool: 'cheap-module-source-map',
	outputPath: __dirname + '/build',
	outputFileName: '[name]_[chunkhash:10].js',
	chunkFileName: '[chunkhash].[id].chunk.js',
	imgLimit: 1, // url-loader限制不压缩图片的最大值
	imgName: 'img/[name]_[hash:10].[ext]',
	tmplName: __dirname + '/app/index.tmpl.html',
	cssName: '[name]_[contenthash:10].css',
	externals: {
		'react': 'window.React',
		'react-dom': 'window.ReactDOM'
	}
};

module.exports = function(manualConf) {
	const conf = Object.assign(defaultConf, manualConf);

	const config = {
		//配置生成Source Maps，选择合适的选项("source-map|cheap-module-source-map|eval-source-map|cheap-module-eval-source-map")
		devtool: conf.devtool, 
		// entry: {index:[__dirname + "/app/index.jsx"]},
		entry: {
			webpack: ['webpack-dev-server/client?http://0.0.0.0:' + conf.port,
					  'webpack/hot/only-dev-server'],
			index: './app/index'
		},
		output: {
			path: conf.outputPath, //打包后的文件存放的地方
			// publicPath: './build/',
			chunkFilename: conf.chunkFileName,//chunkFilename: "[name]_[chunkhash:10].chunk.js",
			filename: conf.outputFileName //打包后输出文件的文件名
		},

		module: {
			loaders: [
				{
					test: /\.json$/,
					// include: __dirname + "/app",
					loader: "json"
				},
				{
					//用babel转码器加载有es2015和jsx语法的js,输出为es5语法的js,注意这里只是语法转码。
					//如果开发代码中有用到新ES规范中的新对象或属性方法还需要babel-polyfill才能转码成ES5代码
					//class-properties和object-rest-spread,是转码类属性写法和非数组对象的延展符...,新React常用到的写法,但还不是ES2015规范
					//query对象和.babelrc配置文件内容一致,必须都写,不然使用webpack的babel-loader会报错.
					test: /\.js[x]?$/,
					exclude: /(node_modules|lib)/,
					// include: __dirname + "/app",
					loader: 'babel', //在webpack的module部分的loaders里进行配置即可
					// query: {
					// 	presets: ['es2015', 'react', 'stage-0']
					// 	// plugins: ['transform-class-properties', 'transform-object-rest-spread']
					// }
				},
				{
					test: /\.(styl|css)$/, 
					exclude: /node_modules/,
					// include: __dirname + "/app",
					//加载stylus css资源,默认写法loader:'style-loader!css-loader' css为Internal内部形式
					//ExtractTextPlugin插件写法用于生成独立的css文件,用于external link形式
					//生成的独立CSS文件中的url图片地址的publicPath,通常JS中的publicPath不一样,如果一样可以不设置
					//开启module:?modules 去掉避免css名称被修改影响ReactCSSTransitionGroup
					loader: ExtractTextPlugin.extract( //?modules
						'style', 
						'css!stylus!postcss',
						{
							publicPath: "./"
						}
					)
				},
				{
					test: /\.(png|jpg|jpeg)$/,
					exclude: /node_modules/,
					// include: __dirname + "/app",
					//url-loader处理图片URL,如果图片小于limit值直接生成`base64` 格式的`dataUrl`,否则输出图片,name参数指定输出目录和图片名
					//url-loader依赖file-loader
					//image-webpack-loader是用来压缩图片的,主要是透明PNG
					loaders: [
						'url?limit=' + conf.imgLimit + '&name=' + conf.imgName,
						'image-webpack-loader?{progressive:true,optimizationLevel:7,interlaced:false,pngquant:{quality:"65-90",speed:4},mozjpeg:{quality:65}}'
					]
				},
				{
					test: /\.svg$/,
					// exclude: /node_modules/,
					loader: 'iconfont-webpack',
				}
			]
		},

		postcss: [
			require('autoprefixer')//调用autoprefixer插件
		],

		//script引入js类库，通过require或import的方式来使用，却不希望webpack把它编译到输出文件中。
		//比如不想这么用 const $ = window.jQuery 而是这么用 const $ = require("jquery") or import $ from "jquery"; 则配置"jquery": "jQuery"
		//键名是require或from时的字符串,键值是js内的全局变量名
		// externals: {
		// 	'react': 'window.React',
		// 	'react-dom': 'window.ReactDOM'
		// },

		plugins: [
			//Plugin to replace a standard webpack chunkhash with md5.
			new WebpackMd5Hash(),

			//按需求生成HTML页面
			//template 模板位置
			//inject: 'body' js插入在body元素内部的最后
			//chunks 对应入口文件名
			//filename 生成的文件名,可以带上路径
			//options参数对象的值可以自定义,比如这里的libJS
			//在模板页中可以获得和使用这些数据,可以在模板页中使用<%= JSON.stringify(htmlWebpackPlugin) %>;输出查看所有可用的数据
			new HtmlWebpackPlugin({
				template: conf.tmplName,
				inject: 'body',
				// filename: 'index.html'
			}),
			
			//把entry中配置的多个js中共用代码提取生成为单个js, 多参数写法 new webpack.optimize.CommonsChunkPlugin("commons", "commons.js")
			// new webpack.optimize.CommonsChunkPlugin({
			// 	name: "commons",
			// 	filename: "commons_[chunkhash:10].js"
			// }),
			//输出独立的css文件,用于external link形式,如果有多个入口JS共用的CSS,会生成commons.css
			new ExtractTextPlugin(conf.cssName),
			
			// 全局变量
	        new webpack.DefinePlugin({
	            // __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')), //通过环境变量设置
	            __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')) // 开发调试时把它改为true
	        }),
			
			//为每个输出的文件添加头部注释
			// new webpack.BannerPlugin("Copyright V5KF inc. Author:Chyrain " + getTime()), //在这个数组中new一个就可以了
			
			//ProvidePlugin的作用就是在开发代码内不需要require('react')或import ... from ... 也能使用React
			// new webpack.ProvidePlugin({
			// 	React: 'react',
			// 	ReactDOM: 'react-dom'
			// }),
			
			//压缩代码,命令行的 webpack -p 会默认使用这个插件压缩代码
			// new webpack.optimize.UglifyJsPlugin({
			// 	compress: {
			// 		warnings: false
			// 	}
			// }),

			//vary the distribution of the ids to get the smallest id length for often used ids
			new webpack.optimize.OccurenceOrderPlugin(),

			//prevents the inclusion of duplicate code into your bundle and instead applies a copy of the function at runtime
			new webpack.optimize.DedupePlugin(),

			//抽离出不打包的库
			// new webpack.DllReferencePlugin({
			// 	context: __dirname,
			// 	manifest: require('./manifest.json'),
			// }),
			
			new OpenBrowserPlugin({url: ('http://localhost:' + conf.port + "/")}),
		],

		resolve: {
			extensions: ['', '.js', '.jsx']
		},

		//webpack-dev-server的配置, 通常弄成独立的文件,比如server.js,
		//或者使用命令行形式,比如npm scripts命令行形式,类似webpack-dev-server -d --inline --hot
		//弄webpack-dev-server通常是为了自动刷新和热更新,配置麻烦
		devserver: {
			contentBase: "./", //本地服务器所加载的页面所在的目录
			port: conf.port,
			colors: true, //终端中输出结果为彩色
			historyApiFallback: true, //不跳转
			inline: true, //实时刷新
			hot: true
		}
	};
	if (conf.externals) {
		config.externals = conf.externals;
	}

	return config;
}

function getTime() {
	var _time = new Date();
	return _time.toLocaleDateString() + " " + _time.toTimeString();
}