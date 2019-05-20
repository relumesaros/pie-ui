import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';

import constants from './constants';
import Button from './button';
import DrawablePalette from './drawable-palette';
import DrawableMain from './drawable-main';
import DrawableText from './drawable-text';

const { tools: TOOLS } = constants;

class Container extends Component {
  constructor(props) {
    super(props);
    const TextEntry = new DrawableText();

    this.state = {
      drawableDimensions: {
        height: 0,
        width: 0
      },
      toolActive: TOOLS[0],
      fillColor: 'white',
      fillColorList: [
        'white',
        'lightblue',
        'lightyellow'
      ],
      outlineColor: 'black',
      outlineColorList: [
        'black',
        'blue',
        'yellow'
      ],
      paintColor: 'red',
      paintColorList: [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'violet'
      ],
      TextEntry
    };
  }

  componentDidMount() {
    const { height, width } = this.drawable.getBoundingClientRect();
    this.setState({
      drawableDimensions: {
        height,
        width
      }
    })
  }

  handleUndo = () => { };
  handleClearAll = () => {};

  handleMakeToolActive(tool) {
    const { TextEntry } = this.state;
    const { type } = tool;
    if (type !== 'Text') {
      this.setState({
        toolActive: tool
      });
    } else {
      TextEntry.addNewTextEntry();
      // Force update
      this.setState({
        // Make select tool by default
        toolActive: TOOLS[0],
        updatedAt: new Date()
      });
    }
  }

  checkIfToolIsDisabled = (type) => {
    const { toolActive } = this.state;
    // Text will never be disabled since on each "Text Entry" click a new text is added
    if (type === 'Text') {
      return false;
    }
    return type === toolActive.type;
  };

  handleColorChange(type, color) {
    const cType = `${type}Color`;
    this.setState({
      [cType]: color
    });
  }

  render() {
    const {
      classes,
      imageUrl,
      imageDimensions
    } = this.props;
    const {
      drawableDimensions,
      toolActive,
      fillColor,
      fillColorList,
      outlineColor,
      outlineColorList,
      paintColor,
      paintColorList,
      TextEntry
    } = this.state;

    return (
      <div className={classes.base} >
        <DrawablePalette
          fillColor={fillColor}
          fillList={fillColorList}
          outlineColor={outlineColor}
          outlineList={outlineColorList}
          paintColor={paintColor}
          paintList={paintColorList}
          onFillColorChange={color => this.handleColorChange('fill', color)}
          onOutlineColorChange={color => this.handleColorChange('outline', color)}
          onPaintColorChange={color => this.handleColorChange('paint', color)}
        />

        <div className={classes.box}>
          <div className={classes.toolbar}>
            <div>
              {TOOLS.map(tool => {
                const { type, label } = tool;

                return (
                  <Button
                    key={type}
                    disabled={this.checkIfToolIsDisabled(type)}
                    onClick={() => this.handleMakeToolActive(tool)}
                    label={label}
                  />
                )
              })}
            </div>
            {/*<div>*/}
            {/*<Button*/}
            {/*onClick={this.handleUndo}*/}
            {/*label="Undo"*/}
            {/*/>*/}
            {/*<Button*/}
            {/*onClick={this.handleClearAll}*/}
            {/*label="Clear all"*/}
            {/*/>*/}
            {/*</div>*/}
          </div>

          <div ref={drawable => { this.drawable = drawable; }}  className={classes.drawableHeight}>
            <DrawableMain
              fillColor={fillColor}
              outlineColor={outlineColor}
              paintColor={paintColor}
              imageUrl={imageUrl}
              drawableDimensions={drawableDimensions}
              imageDimensions={imageDimensions}
              toolActive={toolActive}
              TextEntry={TextEntry}
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  base: {
    marginTop: theme.spacing.unit * 2
  },
  box: {
    border: '1px solid #E0E1E6',
    borderRadius: '5px',
    marginTop: theme.spacing.unit * 2
  },
  drawableHeight: {
    minHeight: 350
  },
  toolbar: {
    backgroundColor: '#ECEDF1',
    borderBottom: '1px solid #E0E1E6',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 8px'
  }
});

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  imageDimensions: PropTypes.object.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default withStyles(styles)(Container);
