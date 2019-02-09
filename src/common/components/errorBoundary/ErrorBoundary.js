import React from 'react';
import { connect } from 'react-redux';

import { showError } from '../../../store/error/actions';
import constants from '../../utils/constants';
import Message from './Message.js';
import { ErrorModal } from '../index';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    const message = new Message(error, constants.messageTypes.Error);
    this.props.showError(message);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorModal />;
    }
    return this.props.children;
  }
}

const mapDispatchToProps = dispatch => ({
  showError(error) {
    return dispatch(showError(error));
  }
});

const mapStateToProps = function(state) {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
