import React from 'react';
import ReactDOM from 'react-dom';
import Board from './chess/Board.jsx';
import Perf from 'react-addons-perf';

import './assets/chess.css'; //使用require导入css文件

window.v = {};
v.logd = function (...args) {
	// console.log(...args);
};
v.logi = function (...args) {
	console.info(...args);
};
v.logw = function (...args) {
	console.warn(...args);
};
v.loge = function(...args) {
	console.error(...args);
};
v.dir = function(...args) {
	console.dir(...args);
};

ReactDOM.render(
	<Board />
	, document.getElementById('root'));