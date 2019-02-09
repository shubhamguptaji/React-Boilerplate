// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

// LOCAL imports
import Styles from './Button.less';
import { isSubmitKey } from '../../utils/keyboardUtils';

const cx = classNames.bind(Styles);

export default class Button extends React.Component {
  onClick = (e) => {
    if (this.props.enabled) this.props.onClick(e);
  };

  get styles() {
    return cx(
      { primaryButton: this.props.type === 'primary' },
      { secondaryButton: this.props.type === 'secondary' },
      { textButton: this.props.type === 'text' },
      { enabled: this.props.enabled },
      { disabled: !this.props.enabled },
      this.props.className
    );
  }

  primaryButton = () => {
    return (
      <div
        tabIndex='0'
        onClick={this.onClick}
        onKeyUp={({ keyCode }) =>
          isSubmitKey(keyCode) ? this.onClick() : null
        }
        className={this.styles}
        data-button
        datauitestid={this.props.datauitestid ? this.props.datauitestid : null}
      >
        {this.props.children}
      </div>
    );
  };

  secondaryButton = () => {
    return (
      <div
        tabIndex='0'
        onClick={this.onClick}
        onKeyUp={({ keyCode }) =>
          isSubmitKey(keyCode) ? this.onClick() : null
        }
        className={this.styles}
        data-button
        datauitestid={this.props.datauitestid ? this.props.datauitestid : null}
      >
        {this.props.children}
      </div>
    );
  };

  textButton = () => {
    return (
      <div
        tabIndex='0'
        onClick={this.onClick}
        onKeyUp={({ keyCode }) =>
          isSubmitKey(keyCode) ? this.onClick() : null
        }
        className={this.styles}
        data-button
        datauitestid={this.props.datauitestid ? this.props.datauitestid : null}
      >
        {this.props.children}
      </div>
    );
  };

  render() {
    switch (this.props.type) {
      case 'primary':
        return this.primaryButton();
      case 'secondary':
        return this.secondaryButton();
      case 'text':
      default:
        return this.textButton();
    }
  }
}

Button.propTypes = {
  type: PropTypes.string,
  enabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

Button.defaultProps = {
  type: 'primary',
  enabled: true,
  className: '',
  onClick: () => {}
};