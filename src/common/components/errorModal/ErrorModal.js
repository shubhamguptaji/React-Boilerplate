import React from 'react';
import { Modal } from '../index';
import { connect } from 'react-redux';
import { hideError } from '../../../store/error/actions';
import { sessionStorageAgent } from '../../../api';
import style from './ErrorModal.less';
import constants from '../../utils/constants';
import * as errorSelectors from '../../../store/error/selectors';

const outlookBodyLimit = 456;
class ErrorModal extends React.Component {
  close(event) {
    this.props.hideError();
    window.location = '/horizonweb/';
  }

  render() {
    const log = sessionStorageAgent.get(constants.storageKeys.horizonLogKey);
    const email = createMail(
      constants.supportEmail,
      'Horizon log data: latest snapshot',
      getTrimmedLogForEmail(log)
    );

    return (
      <Modal
        title={'OOPS, SOMETHING WENT WRONG'}
        showPopup={this.props.hasError}
        onCloseButton={this.close.bind(this)}
      >
        <div className={style.errorText}>Please try again.</div>
        <div className={style.errorText}>
          If the problem persists, <a href={email}>send us the details</a> and
          we can investigate the problem.
        </div>
        <div className={style.closeButton} onClick={this.close.bind(this)}>
          CLOSE
        </div>
      </Modal>
    );
  }
}

function getTrimmedLogForEmail(log) {
  const trimmedLog = log.substr(log.length - outlookBodyLimit);
  return trimmedLog.slice(trimmedLog.indexOf('[HznWeb]'));
}

function createMail(email, subject, body) {
  const result =
    'mailto:' +
    email +
    '&subject=' +
    subject +
    '&body=' +
    encodeURIComponent(body);

  return result;
}

const mapDispatchToProps = dispatch => ({
  hideError() {
    return dispatch(hideError());
  }
});

const mapStateToProps = function(state) {
  return {
    hasError: errorSelectors.getHasError(state),
    error: errorSelectors.getError(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);
