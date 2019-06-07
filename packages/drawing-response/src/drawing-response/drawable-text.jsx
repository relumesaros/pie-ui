import React from 'react';
import { Text } from 'react-konva';

import Transformer from './drawable-transformer';

const generateId = () =>
  Math.random().toString(36).substring(2)
  + (new Date()).getTime().toString(36);

export default class TextDrawable {
  static getTextareaNode(id) { return `textarea_${id}`; }
  static getTextNode(id) { return `text_${id}`; }
  static getTransformerNode(id) { return `transformer_${id}`; }

  constructor() {
    this.all = [];
  }

  addNewTextEntry = () => {
    const all = this.all;
    const id = generateId();

    all.push({
      id: id,
      isDefault: true,
      label: 'Double click to edit this text. Press Enter to submit.',
      width: 200,
      x: (all.length + 1) * 5 + 50,
      y: (all.length + 1) * 5 + 50,
      textVisible: true,
      transformerVisible: true,
      textareaVisible: false,
      createdAt: new Date(),
      type: 'text-entry'
    });

    this.stage.on('click', (e) => {
      if (e.target !== this.stage) {
        return;
      }
      this.showOnlyTextNodes();
      this.props.forceUpdate();
    })
  };

  showOnlyTextNodes() {
    this.all.map(item => {
      item.textVisible = true;
      item.transformerVisible = false;
      item.textareaVisible = false;
    });
  }

  toggleTextarea(id, value) {
    this.all = this.all.map(item => {
      if (item.id === id) {
        return {
          ...item,
          textVisible: !value,
          transformerVisible: !value,
          textareaVisible: value
        }
      }
      return item;
    });
    this.props.forceUpdate();
  }

  initializeDefault(id, isDefault) {
    if (isDefault) {
      const current = this.all.filter(item => item.id === id)[0];
      current.isDefault = false;
    }
  }

  saveValue(id, textNode, textareaNode) {
    if (textareaNode.value) {
      textNode.text(textareaNode.value);
    } else {
      this.all = this.all.filter(text => text.id !== id);
      this.props.forceUpdate();
    }
  }

  handleMouseDown = () => this.props.toggleTextSelected(true);
  handleMouseUp = () => this.props.toggleTextSelected(false);

  handleClick = (e, id) => {
    const current = this.all.filter(item => item.id === id)[0];
    current.transformerVisible = true;
    this.props.forceUpdate();
  };

  handleDblClick = (e, text) => {
    const { id, isDefault } = text;
    this.toggleTextarea(id, true);

    const textNode = this[TextDrawable.getTextNode(id)];
    const textareaNode = this[TextDrawable.getTextareaNode(id)];

    const areaPosition = textNode._lastPos;

    textareaNode.value = isDefault ? '' : textNode.text();
    textareaNode.style.position = 'absolute';
    textareaNode.style.top = areaPosition.y + 'px';
    textareaNode.style.left = areaPosition.x + 'px';
    textareaNode.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textareaNode.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textareaNode.style.fontSize = textNode.fontSize() + 'px';
    textareaNode.style.border = 'none';
    textareaNode.style.padding = '0px';
    textareaNode.style.margin = '0px';
    textareaNode.style.overflow = 'hidden';
    textareaNode.style.background = 'none';
    textareaNode.style.outline = 'none';
    textareaNode.style.resize = 'none';
    textareaNode.style.lineHeight = textNode.lineHeight();
    textareaNode.style.fontFamily = textNode.fontFamily();
    textareaNode.style.transformOrigin = 'left top';
    textareaNode.style.textAlign = textNode.align();
    textareaNode.style.color = textNode.fill();

    let rotation = textNode.rotation();
    let transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }

    let px = 0;
    let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    textareaNode.style.transform = transform;
    textareaNode.style.height = 'auto';
    textareaNode.style.height = textareaNode.scrollHeight + 3 + 'px';

    textareaNode.focus();

    textareaNode.addEventListener('keydown', (e) => {
      // hide on enter but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        this.toggleTextarea(id, false);
        this.saveValue(id, textNode, textareaNode);
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        this.toggleTextarea(id, false);
      }
    });

    this.stage.on('click', (e) => {
      if (e.target !== this.stage) {
        return;
      }
      this.showOnlyTextNodes();
      this.saveValue(id, textNode, textareaNode);
    });

    this.initializeDefault(id, isDefault);
    this.props.forceUpdate();
  };

  handleTransform = (e, textNode) => {
    this[textNode].setAttrs({
      width: this[textNode].width() * this[textNode].scaleX(),
      scaleX: 1
    });
  };

  renderTextareas() {
    return this.all.map(text => {
      const { id, textareaVisible } = text;
      const textareaNode = `textarea_${id}`;

      return (
        <textarea
          key={textareaNode}
          ref={textarea => { this[textareaNode] = textarea; }}
          style={{ display: `${textareaVisible ? 'block' : 'none'}`}}
        />
      )
    });
  }

  setInitialProps(props) {
    if (!this.props) {
      this.props = props;
    }
  }

  render(props) {
    this.setInitialProps(props);

    if (props.stage && !this.props.stage) {
      this.stage = props.stage;
    }

    return this.all.map(text => {
      const {
        id,
        label,
        x,
        y,
        width,
        textVisible,
        transformerVisible
      } = text;

      const textNode = `text_${id}`;
      const transformerNode = `transformer_${id}`;

      return ([
          <Text
            key={id}
            bubbles={true}
            id={id}
            ref={text => { this[textNode] = text; }}
            onClick={(e) => this.handleClick(e, id)}
            onDblClick={(e) => this.handleDblClick(e, text)}
            onTransform={(e) => this.handleTransform(e, textNode)}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            text={label}
            name={textNode}
            x={x}
            y={y}
            width={width}
            draggable
            visible={textVisible}
            fontSize={16}
          />,
          transformerVisible && (
            <Transformer
              ref={text => { this[transformerNode] = text; }}
              selectedShapeName={textNode}
              onMouseDown={this.handleMouseDown}
              onMouseUp={this.handleMouseUp}
            />
          )
        ]
      )
    });
  }
}