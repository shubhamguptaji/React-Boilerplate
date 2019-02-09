// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
// LOCAL imports
import { keyCodes } from '../../utils/keyboardUtils';

export default class FocusTrap extends React.Component {
  constructor(props) {
    super(props);

    this.trapStartRef = null;
    this.trapEndRef = null;
  }

  componentDidMount() {
    this.trapStartRef.focus();
    document.addEventListener('keydown', this.handleTabPressListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleTabPressListener);
  }

  handleTabPressListener = (e) => {
    if (!this.props.disabled) {
      switch (true) {
        case e.shiftKey && e.keyCode === keyCodes.TAB:
          if (document.activeElement === this.trapStartRef)
            this.trapEndRef.focus();
          break;
        case e.keyCode === keyCodes.TAB:
          if (document.activeElement === this.trapEndRef)
            this.trapStartRef.focus();
          break;
        default:
          break;
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <div data-start tabIndex='0' ref={(x) => (this.trapStartRef = x)} />
        {this.props.children}
        <div data-end tabIndex='0' ref={(x) => (this.trapEndRef = x)} />
      </React.Fragment>
    );
  }
}

FocusTrap.propTypes = {
  disabled: PropTypes.bool
};

FocusTrap.defaultProps = {
  disabled: false
};