
// 各棋子的初始值
function getInitialChessmans() {
	let chessmans = {
		king_b: {
			black: true,
			type: "king",
			position: [0,4],
		},
		king_w: {
			black: false,
			type: "king",
			position: [7,4],
		},
		qween_b: {
			black: true,
			type: "qween",
			position: [0,3],
		},
		qween_w: {
			black: false,
			type: "qween",
			position: [7,3],
		},
		bishop_b0: {
			black: true,
			type: "bishop",
			position: [0,2],
		},
		bishop_b1: {
			black: true,
			type: "bishop",
			position: [0,5],
		},
		bishop_w0: {
			black: false,
			type: "bishop",
			position: [7,2],
		},
		bishop_w1: {
			black: false,
			type: "bishop",
			position: [7,5],
		},
		horse_b0: {
			black: true,
			type: "horse",
			position: [0,1],
		},
		horse_b1: {
			black: true,
			type: "horse",
			position: [0,6],
		},
		horse_w0: {
			black: false,
			type: "horse",
			position: [7,1],
		},
		horse_w1: {
			black: false,
			type: "horse",
			position: [7,6],
		},
		rook_b0: {
			black: true,
			type: "rook",
			position: [0,0],
		},
		rook_b1: {
			black: true,
			type: "rook",
			position: [0,7],
		},
		rook_w0: {
			black: false,
			type: "rook",
			position: [7,0],
		},
		rook_w1: {
			black: false,
			type: "rook",
			position: [7,7],
		},
	};
	// 黑兵
	for (let i = 0; i < 8; i++) {
		let chessman = {
			black: true,
			type: "pawn",
		}
		chessman.position = [1, i];
		chessmans["pawn_b" + i] = chessman;
	}
	// 白兵
	for (let i = 0; i < 8; i++) {
		let chessman = {
			black: false,
			type: "pawn",
		}
		chessman.position = [6, i];
		chessmans["pawn_w" + i] = chessman;
	}

	return chessmans;
}

function getInitialBoard() {
	const board = {
	};
	let chessArray = getObjectValues(getInitialChessmans());
	chessArray.map((item, index) => {
		let pos = item.position;
		let id = pos[0]*8 + pos[1];
		board[id] = item;
		item.unicode = CHESS[item.type][item.black ? "black" : "white"].unicode;
		item.html = CHESS[item.type][item.black ? "black" : "white"].html;
	});

	return board;
}

const CHESS = { // Chess[{type}][{black}?"black":"white"].unicode
	king: { // 王
		title: "王",
		white: {
			unicode: "&#x2654;",
			html: "&#9812;"
		},
		black: {
			unicode: "&#x265A;",
			html: "&#9818;"
		},
	},
	qween: { // 后
		title: "后",
		white: {
			unicode: "&#x2655;",
			html: "&#9813;"
		},
		black: {
			unicode: "&#x265B;",
			html: "&#9819;"
		},
	},
	rook: { // 车
		title: "车",
		white: {
			unicode: "&#x2656;",
			html: "&#9814;"
		},
		black: {
			unicode: "&#x265C;",
			html: "&#9820;"
		},
	},
	bishop: { // 象
		title: "象",
		white: {
			unicode: "&#x2657;",
			html: "&#9815;"
		},
		black: {
			unicode: "&#x265D;",
			html: "&#9821;"
		},
	},
	horse: { // 马
		title: "马",
		white: {
			unicode: "&#x2658;",
			html: "&#9816;"
		},
		black: {
			unicode: "&#x265E;",
			html: "&#9822;"
		},
	},
	pawn: { // 兵
		title: "兵",
		white: {
			unicode: "&#x2659;",
			html: "&#9817;"
		},
		black: {
			unicode: "&#x265F;",
			html: "&#9823;"
		},
	},
}

function getObjectValues(object) {
	var values = [];
	for (var property in object)
		values.push(object[property]);
	return values;
}

const initialState = {
	status: {
		onBlackTurn: true, // 黑棋先行
		blackOnUp: true, // 黑棋在上方
	},
	// chessmans: chessmans,
	board: getInitialBoard(),
	
	// canMove{pos为对方棋子位置则为吃，pos为己方棋子位置则不可移动} -> eat ->  
};

const ItemTypes = {
	KNIGHT: 'knight'
};


export { CHESS, initialState, ItemTypes};