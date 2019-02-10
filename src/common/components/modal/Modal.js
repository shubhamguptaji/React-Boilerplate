// GLOBAL Imports
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
// LOCAL Imports
import { crossIcon } from '../../../assets/icons/svgPaths';
import { IconButton } from '../index';
import constants from '../../../common/utils/constants';
import Style from './Modal.less';

const cx = classNames.bind(Style);

export default class Modal extends React.Component {
  componentDidMount() {
    this.setFocusOnModalDialog();
  }

  get containerStyles() {
    return cx(
      { modalContainer: !this.props.containerClass },
      this.props.containerClass
    );
  }

  setFocusOnModalDialog = () => {
    const { showPopup } = this.props;
    const { modalContainer } = this.refs;

    if (showPopup) {
      modalContainer.focus();
    }
  };

  render() {
    const { showPopup, title, onCloseButton, children } = this.props;

    return showPopup ? (
      <div className={Style.modal}>
        <div
          className={this.containerStyles}
          tabIndex="-1"
          ref={constants.modalContainer}
        >
          <div className={Style.modalContainerHeader}>
            <div className={Style.modalContainerHeaderTitle}>{title}</div>
            {onCloseButton && (
              <IconButton
                path={crossIcon}
                onClick={onCloseButton.bind(this)}
                className={Style.modalContainerHeaderClose}
              />
            )}
          </div>

          {children}
        </div>
      </div>
    ) : null;
  }
}

Modal.propTypes = {
  showPopup: PropTypes.bool,
  title: PropTypes.string,
  onCloseButton: PropTypes.func,
  containerClass: PropTypes.string
};
