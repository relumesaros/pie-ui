import React from 'react';
import proImage from '../public/protractor.png';


const styles = {
  svg: {
    '&:hover': {
      fill: 'black'
    }
  }
};

class Protractor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      rotation: 0,
      isDragging: false,
      startAngle: 0,
      angle: 0,
      pos1: 0,
      pos2: 0,
      pos3: 0,
      pos4: 0
    };
  }

  getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y2 - y1) * (y2 - y1));
  }

  mouseDownHandler = (e) => {
    const R2D = 180 / Math.PI;
    let height, left, top, width, x, y, _ref, center;
    e.preventDefault();
    _ref = document.getElementById("rotateDiv").getBoundingClientRect(), top = _ref.top, left = _ref.left, height = _ref.height, width = _ref.width;
    center = {
      x: left + (width / 2),
      y: top + (height / 2)
    };
    x = e.clientX - center.x;
    y = e.clientY - center.y;
    this.setState({
      isDragging: true,
      startAngle: R2D * Math.atan2(y, x)
    });
  }

  mouseMoveHandler = (e) => {
    const R2D = 180 / Math.PI;
    let d, height, left, top, width, x, y, _ref, center;
    _ref = document.getElementById("rotateDiv").getBoundingClientRect(), top = _ref.top, left = _ref.left, height = _ref.height, width = _ref.width;
    center = {
      x: left + (width / 2),
      y: top + (height / 2)
    };
    e.preventDefault();
    x = e.clientX - center.x;
    y = e.clientY - center.y;
    d = R2D * Math.atan2(y, x);
    let rotation = d - this.state.startAngle;
    if (this.state.isDragging) {
      this.setState({
        rotation: (this.state.angle + rotation)
      });
    }
  }

  mouseUpHandler = (e) => {
    let angle = 0;
    angle += this.state.rotation;
    this.setState({
      angle: angle,
      isDragging: false
    });
  }

  dragMouseDown = (e) => {
    this.setState({
      pos3: e.clientX,
      pos4: e.clientY
    });
  }

  elementDrag = (e) => {
    const {pos3, pos4} = this.state;
    let pos1 = pos3 - e.clientX;
    let pos2 = pos4 - e.clientY;
    var elmnt = document.getElementById('myDiv');
    this.setState({
      pos1: pos1,
      pos2: pos2,
      pos3: e.clientX,
      pos4: e.clientY
    });
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    console.log("Hello");
  }

  closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  }


  render() {
    const { rotation, lastX, lastY, hovered } = this.state;
    const svg1 = (<svg onMouseOver={() => this.setState({ hovered: true })} onMouseOut={() => this.setState({ hovered: false })} onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} onMouseMove={this.mouseMoveHandler} xmlns="http://www.w3.org/2000/svg" version="1.1" width="35" height="180.6842105098047" style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }}><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none" className="" /><desc style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }}>Created with Raphaël</desc><defs style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }} /><g className="currentLayer"><title>Layer 1</title><path fill="#9ed343" stroke="none" d="M18.53460866277966,110.8445443391567 L24.197872444267603,110.8445443391567 L13.200812969262927,123.63243751869256 L1.5419852144077693,110.8445443391567 L7.208081099803776,110.8445443391567 A269.75789724290456,269.75789724290456 0 0 1 11.013484717603056,67.46143264082727 L5.413471256728496,66.46925223836956 L19.122742241020525,55.900784488118276 L27.73894636398109,70.39832439348756 L22.164421838279086,69.40142381784972 A269.75789724290456,269.75789724290456 0 0 0 18.53460866277965,110.84454433915673 z" style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', cursor: 'move' }} transform="rotate(-3.640275716781616 14.640466690063217,89.76661682128903) " id="svg_1" className="" /></g></svg>);
    const svg2 = (
      <svg onMouseOver={() => this.setState({ hovered: true })} onMouseOut={() => this.setState({ hovered: false })} onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} onMouseMove={this.mouseMoveHandler} xmlns="http://www.w3.org/2000/svg" version="1.1" width="29.47368439214722" height="178" style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }}><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none" /><desc style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }}>Created with Raphaël</desc><defs style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }} /><g className="currentLayer"><title>Layer 1</title><path fill="#9ed343" stroke="none" d="M19.321989993785216,105.06616200794492 L23.26001028935756,105.06616200794492 L15.613069395354858,114.14876339481546 L7.505959768697343,105.06616200794492 L11.445949402640533,105.06616200794492 A187.57947982327056,191.5955519192577 0 0 1 14.0920837269366,74.25330605536591 L10.198045321646529,73.54860990464977 L19.730955928797975,66.04235547337738 L25.722339699041143,76.33923348151048 L21.846025339088705,75.63118482769862 A187.57947982327056,191.5955519192577 0 0 0 19.32198999378521,105.06616200794495 z" style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', cursor: 'move' }} transform="rotate(-2.3505332469940186 16.614152908323916,80.22714233398428) " id="svg_1" /></g></svg>
    );
    return (
      <div style={{ position: 'relative' }}>
        <div id="rotateDiv" style={{ WebkitTransformStyle: 'preserve-3d', position: 'absolute', top: '137px', width: '502px', height: '180px', left: '0px', zIndex: '3', WebkitTransform: `rotate(${rotation}deg)` }}>
          {hovered ? svg1 : svg2}
        </div>
        <div id="myDiv" style={{ position: 'absolute', top: '0px', left: '0px', zIndex: '1' }}>
          <div id="mydivheader" onMouseDown={this.dragMouseDown} onMouseUp={this.closeDragElement} onMouseMove={this.elementDrag}>Click here to move</div>
          <img className="proImage" src={proImage} width="500" alt="proImage" />
        </div>
      </div>
    )
  }
}

export default Protractor;
