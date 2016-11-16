import {initialState, CHESS} from './Constants.jsx';
import md5 from 'md5';

let knightPosition = initialState.knightPosition;

let boardObserver = null;
let eatObserver = null;

let board = initialState.board;
let status = initialState.status;

function emitChange(prefPos, nextPos) {
  if (boardObserver) {
    boardObserver(status.onBlackTurn, prefPos, nextPos);
  }
}

function emitEat(preChessman, nextChessman) {
  if (eatObserver) {
    eatObserver(preChessman, nextChessman);
  }
}

export function observe(o) {
  if (boardObserver) {
    throw new Error('Multiple observers not implemented.');
  }

  boardObserver = o;
  // emitChange();
}

export function eatObserve(o) {
  if (eatObserver) {
    throw new Error('Multiple observers not implemented.');
  }

  eatObserver = o;
}

// export function randomMove(receive) {
//   // setInterval(() => receive([
//   //   Math.floor(Math.random() * 8),
//   //   Math.floor(Math.random() * 8)
//   // ]), 5);
// }

export function canDropChess(x, y, chessman) {
  var hash = md5(JSON.stringify(board));
  chessman.canDrop = chessman.canDrop || {};
  if (!chessman.canDrop[hash]) {
      chessman.canDrop[hash] = avaiblePosition(hash, chessman, board);
  }

  return chessman.canDrop[hash][x*8 + y];
}

export function moveDropChess(x, y, chessman) {
  status.onBlackTurn = !status.onBlackTurn; // 切换走棋

  let prefChessman = board[x*8+y];

  let [preX, preY] = chessman.position;
  delete board[preX*8+preY];
  chessman.position = [x, y];
  board[x*8+y] = chessman;

  v.logi('[move]:', (chessman.black ? "黑" : "白") + (CHESS[chessman.type].title), 
    [preX, preY], " => ", [x, y]);//////
  if (prefChessman) {
    v.logi((chessman.black ? "黑" : "白") + (CHESS[chessman.type].title) + "吃" 
      + (prefChessman.black ? "黑" : "白") + (CHESS[prefChessman.type].title));//////
    emitEat(prefChessman, chessman);
  }
  emitChange([preX, preY], [x, y]);
}

export function canDrag(chessman) {
  return !(chessman.black ^ status.onBlackTurn);
}

// 计算可移动范围
function avaiblePosition(hash, chessman, board) {
  (delete chessman.canDrop) && (chessman.canDrop = {});
  // 走棋规则，根据不同棋判定可走路线
  let avaibles = {}, keys=[];
  let [x, y] = chessman.position;
  switch (chessman.type) {
    case 'king': {
      keys = [
        [(x-1), y],
        [(x+1), y],
        [x, y+1],
        [x, y-1],
        [(x+1), y+1],
        [(x+1), y-1],
        [(x-1), y+1],
        [(x-1), y-1],
      ];
      // 排除当前位置为己方棋子和0～63之外的值
      keys.forEach(val => {
        let [nX, nY] = val;
        if (nX < 8 && nX >= 0 && nY < 8 && nY >= 0) {
          let key = nX*8 + nY;
          avaibles[key] = !board[key] || (board[key].black !== chessman.black);
        }
      });
    }
      break;
    case 'qween': { // 后 横直斜
      for (let nextY = y-1; nextY >= 0; nextY--) { // 横左
        let key = x*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextY = y+1; nextY < 8; nextY++) { // 横右
        let key = x*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x-1; nextX >= 0; nextX--) { // 竖直上
        let key = nextX*8 + y;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x+1; nextX < 8; nextX++) { // 竖直下
        let key = nextX*8 + y;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x-1, nextY = y-1; nextX >= 0 && nextY >=0; nextX--, nextY--) { // 斜左上
        let key = nextX*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x+1, nextY = y-1; nextX < 8 && nextY >=0; nextX++, nextY--) { // 斜左下
        let key = nextX*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x-1, nextY = y+1; nextX >= 0 && nextY < 8; nextX--, nextY++) { // 斜右上
        let key = nextX*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x+1, nextY = y+1; nextX < 8 && nextY < 8; nextX++, nextY++) { // 斜右下
        let key = nextX*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
    }
      break;
    case 'rook': { // 车
      for (let nextY = y-1; nextY >= 0; nextY--) { // 横左
        let key = x*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextY = y+1; nextY < 8; nextY++) { // 横右
        let key = x*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x-1; nextX >= 0; nextX--) { // 竖直上
        let key = nextX*8 + y;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x+1; nextX < 8; nextX++) { // 竖直下
        let key = nextX*8 + y;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
    }
      break;
    case 'bishop': { // 象
      for (let nextX = x-1, nextY = y-1; nextX >= 0 && nextY >=0; nextX--, nextY--) { // 斜左上
        let key = nextX*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x+1, nextY = y-1; nextX < 8 && nextY >=0; nextX++, nextY--) { // 斜左下
        let key = nextX*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x-1, nextY = y+1; nextX >= 0 && nextY < 8; nextX--, nextY++) { // 斜右上
        let key = nextX*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
      for (let nextX = x+1, nextY = y+1; nextX < 8 && nextY < 8; nextX++, nextY++) { // 斜右下
        let key = nextX*8 + nextY;
        if (board[key]) {
          avaibles[key] = (board[key].black !== chessman.black);
          break;
        }
        avaibles[key] = true;
      }
    }
      break;
    case 'horse': { // 马
      keys = [
        [(x-1), y+2],
        [(x+1), y+2],
        [(x-1), y-2],
        [(x+1), y-2],
        [(x+2), y+1],
        [(x+2), y-1],
        [(x-2), y+1],
        [(x-2), y-1],
      ];
      // 排除当前位置为己方棋子和0～63之外的值
      keys.forEach(val => {
        let [nX, nY] = val;
        if (nX < 8 && nX >= 0 && nY < 8 && nY >= 0) {
          let key = nX*8 + nY;
          avaibles[key] = !board[key] || (board[key].black !== chessman.black);
        }
      });
    }
      break;
    case 'pawn': { // 兵
      if (chessman.black && status.blackOnUp) {
        keys = [
          [(x+1), y+1],
          [(x+1), y-1],
        ];
        if (x + 1 < 8) {
          let key1 = (x+1)*8 + y;
          avaibles[key1] = !board[key1];
        }
      } else {
        keys = [
          // (x-1)*8 + y,
          [(x-1), y+1],
          [(x-1), y-1],
        ];
        if (x - 1 >= 0) {
          let key2 = (x-1)*8 + y;
          avaibles[key2] = !board[key2];
        }
      }
      // 排除当前位置为己方棋子和0～63之外的值
      keys.forEach(val => {
        let [nX, nY] = val;
        if (nX < 8 && nX >= 0 && nY < 8 && nY >= 0) {
          let key = nX*8 + nY;
          avaibles[key] = board[key] && (board[key].black !== chessman.black);
        }
      });
    }
      break;
  }

  v.logd('avaiblePosition =>', avaibles, " chessman =>", chessman);//////
  chessman.canDrop[hash] = avaibles || {};
  return {};
}
