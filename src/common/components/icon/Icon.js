// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

// LOCAL imports
import Styles from './Icon.less';

const cx = classNames.bind(Styles);

export default class Icon extends React.Component {
  render() {
    const className = this.props.className;
    const svg = this.props.path;

    const classes = cx({ icon: !svg }, { svgIcon: svg }, className);

    if (this.props.path) {
      return (
        <svg
          tabIndex='0'
          className={classes}
          viewBox={this.props.viewBox}
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink={'preserve'}
          preserveAspectRatio='xMinYMin'
          x='0px'
          y='0px'
        >
          <path d={this.props.path} />
        </svg>
      );
    }

    return (
      <div tabIndex='0' className={classes}>
        {this.props.children}
      </div>
    );
  }
}

Icon.propTypes = {
  className: PropTypes.string,
  viewBox: PropTypes.string,
  path: PropTypes.string
};

Icon.defaultProps = {
  viewBox: '0 0 512 512'
};