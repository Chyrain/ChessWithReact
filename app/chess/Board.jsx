import React from 'react';
import Perf from 'react-addons-perf';
import BoardSquare from './components/BoardSquare.jsx';
import { observe, eatObserve } from './Game.jsx';
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

  // componentWillReceiveProps(nextProps) {
  //   v.logd('Board => componentWillReceiveProps', nextProps);//////
  //   this.setState({
  //     knightPosition: nextProps.knightPosition
  //   });
  // }

  componentDidMount() {
    v.logd('Board => componentDidMount');

    // 观察者：状态改变
    observe((onblackturn, prefPos, nextPos) => {
      this.setState(Object.assign({}, {status:{onBlackTurn:onblackturn}}));
      // let pref = prefPos[0]*8+prefPos[1];
      // let next = nextPos[0]*8+nextPos[1];
      // this.refs['square'+pref].chessman = this.state.board[pref];
      // this.refs['square'+next].chessman = this.state.board[next];
      // v.logw('observe =>', this.refs['square'+pref], this.refs['square'+next]);//////
    });
    // 观察者：状态改变
    eatObserve((pref, next) => {
      v.logi("吃子: " + (next.black ? "黑" : "白") + (CHESS[next.type].title) + "吃" 
        + (pref.black ? "黑" : "白") + (CHESS[pref.type].title));//////
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    v.logd('Board => shouldComponentUpdate =>', this.state, nextState);//////
    var should = md5(this.state.board) !== md5(nextState.board);
    v.logd('Board => shouldComponentUpdate =>', should);//////
    return true;
  }

  componentDidUpdate() {
    v.logd('Board => componentDidUpdate', (new Date()).getTime());//////
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
    v.logw('Board => render', (new Date()).getTime(), " state =>", this.state);//////
    return (
      <div className="board">
        <div style={{paddingLeft: '10%', paddingTop: '4%',  paddingBottom: '2%'}}>{this.state.status.onBlackTurn ? '黑棋走' : '白棋走'}</div>
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