import React from 'react';
import Perf from 'react-addons-perf';
import BoardSquare from './components/BoardSquare.jsx';
import { observe } from './Game.jsx';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {initialState, CHESS} from './Constants.jsx';
import md5 from 'md5';

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;

    let that = this;
    window.store = {
      getState: function() {
        return that.state;
      }
    };
    v.logd('Board => constructor initialState=>', this.state);//////
  }

  componentDidMount() {
    // 观察者：棋子移动
    observe((chessman, prefPos, nextPos) => {
      var pref = prefPos[0]*8+prefPos[1];
      var next = nextPos[0]*8+nextPos[1];
      var tmp = {};
      tmp[next] = Object.assign(chessman, {position:nextPos});
      var nextBoard = Object.assign(this.state.board, tmp);
      delete nextBoard[pref];
      var nextState = Object.assign(
        this.state, 
        { //更新棋盘
          board: nextBoard
        }, 
        { //切换走棋
          status: Object.assign(this.state.status, {onBlackTurn:!this.state.status.onBlackTurn})
        }
      );
      v.logi((new Date()).getTime(), 'observe => nextState', nextState);//////
      this.setState(nextState);
      v.logi((new Date()).getTime(), 'observe => this.state', this.state);//////
    });
  }

  componentWillUpdate() {
    this.update = (new Date()).getTime();
    v.logi('Board => componentWillUpdate', this.update);//////
  }
  componentDidUpdate() {
    v.logi('Board => componentDidUpdate cost:', (new Date()).getTime() - this.update);//////
  }

  renderSquare(i) {
    const x = Math.floor(i / 8);
    const y = i % 8;
    const black = (x + y) % 2 === 1;
    return (
      <div key={i}
           className="pieces" >
        <BoardSquare
          ref={'square'+i}
          id={i}
          x={x}
          y={y}
          black={black}
          chessman={this.state.board[i]} >
        </BoardSquare>
      </div>
    );
  }

  render() {
    const squares = [];
    for (let i = 0; i < 64; i++) {
      squares.push(this.renderSquare(i));
    }
    v.logi('Board => render', (new Date()).getTime(), " state =>", this.state);//////
    return (
      <div className="board">
        <div ref="tips" style={{paddingLeft: '20px', paddingTop: '4%',  paddingBottom: '4%'}}>{this.state.status.onBlackTurn ? '黑棋走' : '白棋走'}</div>
        <div className="chess-square" >
          {squares}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  //
};

export default DragDropContext(HTML5Backend)(Board);