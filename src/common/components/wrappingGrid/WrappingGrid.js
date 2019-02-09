import React from 'react';
import style from './wrappingGrid.less';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

export default class WrappingGrid extends React.Component {
  render() {
    const classes = cx(this.props.className, style.grid);
    const items = this.props.itemSource;

    const first = items.splice(0, 1)[0];
    const firtStyle = this.getStyle(first);

    return (
      <div className={classes}>
        <div style={firtStyle}> {first.content} </div>
        {this.convertItem(items)}
      </div>
    );
  }

  getStyle(element) {
    let style = [];

    if (element.minWidth) {
      style = {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: element.minWidth
      };
    } else if (element.width) {
      style = {
        width: element.width
      };
    }

    if (element.customStyle) {
      style = Object.assign(style, element.customStyle);
    }

    return style;
  }

  calcItemDivMinWidth(array) {
    let width = 0;

    array.forEach(item => {
      width += item.minWidth || item.width;
    });
    return width + 10;
  }

  convertItem(parent) {
    const parentCopy = parent.slice();

    const first = parent.splice(0, 1)[0];
    const firtStyle = this.getStyle(first);

    if (!parent.length) {
      return <div style={firtStyle}> {first.content} </div>;
    } else {
      const boxStyle = {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: this.calcItemDivMinWidth(parentCopy),
        flexWrap: 'wrap',
        display: 'flex'
      };

      return (
        <div style={boxStyle}>
          <div style={firtStyle}> {first.content} </div>
          {this.convertItem(parent)}
        </div>
      );
    }
  }
}
