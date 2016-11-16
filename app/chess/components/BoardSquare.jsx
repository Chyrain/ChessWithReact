import React from 'react';
import { canMoveKnight, moveKnight, canDropChess, moveDropChess } from '../Game.jsx';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../Constants.jsx';
import Chessman from './Chessman.jsx';

const squareTarget = {
  canDrop(props, monitor) {
    let fromChessman = monitor.getItem().chessman;
    // monitor.getItem() && v.logd([props.x, props.y], " => ", monitor.getItem());
    // props.chessman && v.logd(props.chessman.position, "=>", props.chessman);//////
    return canDropChess(props.x, props.y, fromChessman);
    // return canMoveKnight(props.x, props.y);
  },

  drop(props, monitor, component) {
    moveDropChess(props.x, props.y, monitor.getItem().chessman);
    // moveKnight(props.x, props.y);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver() || false,
    canDrop: monitor.canDrop() || false,
  };
}

class BoardSquare extends React.Component {

  componentWillReceiveProps(nextProps) {
    v.logd(this.props.id, 'BoardSquare => componentWillReceiveProps');//////, nextProps);//////
  }

  shouldComponentUpdate(nextProps, nextState) {
    let should = this.props.black !== nextProps.black || 
      this.props.x !== nextProps.x || 
      this.props.y !== nextProps.y ||
      this.props.isOver !== nextProps.isOver ||
      this.props.canDrop !== nextProps.canDrop ||
      (this.props.chessman && nextProps.chessman && (
        this.props.chessman.type !== nextProps.chessman.type || 
        this.props.chessman.black !== nextProps.chessman.black)
      ) ||
      (!this.props.chessman && nextProps.chessman) || (this.props.chessman && !nextProps.chessman);
    v.logi(this.props.id, 'BoardSquare => shouldComponentUpdate', should);//////, this.props, nextProps);//////
    return should;
  }

  renderOverlay(color, opacity=0.5) {
    return (
      <div
        className="square_mask"
        style={{
          opacity: opacity,
          backgroundColor: color,
        }} />
    );
  }

  renderPieces(chessman) {
    if (chessman) {
      return <Chessman chessman={chessman} />;
    }
  }

  render() {
    const { x, y, black, chessman, connectDropTarget, isOver, canDrop } = this.props;
    const fill = black ? '#933d00' : '#e8d0aa';
    const stroke = black ? 'white' : 'black';
    v.logi('BoardSquare => render', this.props.id);//////
    return connectDropTarget(
      <div style={{
        backgroundColor: fill,
        // color: stroke,
        position: 'relative',
        width: '100%',
        height: '100%'
      }}>
        {this.renderPieces(chessman)}
        
        {isOver && !canDrop && this.renderOverlay('#e23', 1)}
        {!isOver && canDrop && this.renderOverlay('green', 0.6)}
        {isOver && canDrop && this.renderOverlay('green', 1)}
      </div>
    );
  }
}

BoardSquare.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  black: React.PropTypes.bool.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
  isOver: React.PropTypes.bool.isRequired,
  // canDrop: React.PropTypes.bool.isRequired,
};

export default DropTarget(ItemTypes.KNIGHT, squareTarget, collect)(BoardSquare);