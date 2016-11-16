import React from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes, CHESS} from '../Constants.jsx';
import { canDrag } from '../Game.jsx';

const chessmanSource = { // props func from DND
  canDrag(props, monitor) {
    return canDrag(props.chessman);
  },
  beginDrag(props) {
    return {chessman: props.chessman};
  },
};

function collect(connect, monitor) { // props
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(), // 拖拽时显示的内容
    isDragging: monitor.isDragging()
  }
}

class Chessman extends React.Component {

  componentWillReceiveProps(nextProps) {
    // v.logd(this.props.id, 'Chessman => componentWillReceiveProps', nextProps, this.props);//////
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    let should = this.props.chessman.type !== nextProps.chessman.type || 
      this.props.chessman.black !== nextProps.chessman.black;
    v.logi('Chessman => shouldComponentUpdate =>', should);//////
    return should;
  }

  componentDidMount() {
    // 拖动效果-图片
    // const img = new Image();
    // img.src = require('./assets/img/chess_' + this.props.chessman.type + '.png');
    // img.onload = () => this.props.connectDragPreview(img);
  }

  render() {
  	const { connectDragSource, isDragging } = this.props;
    v.logi("Chessman => render");//////
    return connectDragSource(
      <div
        title={this.props.chessman.type}
        className="chessman"
        style={{
          color: this.props.chessman.black ? "black" : "white",
          opacity: isDragging ? 0.3 : 1,
          fontSize: 30,
          fontWeight: 'bolder',
          // fontFamily: icons.like.fontName
        }}
        dangerouslySetInnerHTML={{__html: CHESS[this.props.chessman.type].black.unicode}} >
      </div>
    );
  }
}

Chessman.propTypes = {
  connectDragSource: React.PropTypes.func.isRequired,
  connectDragPreview: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};

export default DragSource(ItemTypes.KNIGHT, chessmanSource, collect)(Chessman);