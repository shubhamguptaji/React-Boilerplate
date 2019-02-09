// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

// LOCAL imports
import { Icon } from '..';
import Styles from './IconButton.less';
import { isSubmitKey } from '../../utils/keyboardUtils';

const cx = classNames.bind(Styles);

export default class IconButton extends React.Component {
  onClick = e => {
    if (this.props.enabled) this.props.onClick(e);
  };

  render() {
    const className = this.props.className;
    const enabled = this.props.enabled;
    const disabled = !this.props.enabled;

    const classes = cx({ enabled: enabled }, { disabled: disabled }, className);

    return (
      <span
        onClick={this.onClick}
        onKeyUp={({ keyCode }) =>
          isSubmitKey(keyCode) ? this.onClick() : null
        }
      >
        {this.props.path && (
          <Icon
            path={this.props.path}
            viewBox={this.props.viewBox}
            className={classes}
          />
        )}
        {!this.props.path && (
          <Icon className={classes}>{this.props.children}</Icon>
        )}
      </span>
    );
  }
}

IconButton.propTypes = {
  enabled: PropTypes.bool,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  path: PropTypes.string,
  onClick: PropTypes.func
};

IconButton.defaultProps = {
  enabled: true,
  viewBox: '0 0 512 512',
  onClick: () => {}
};
