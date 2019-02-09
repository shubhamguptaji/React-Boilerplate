// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';

// LOCAL imports
import Style from './ProgressButton.less';
import { Button } from '../';

export default class ProgressButton extends React.Component {
  loadingButton = () => {
    return <ReactLoading className={Style.loadingButton} type={'bubbles'} />;
  };

  defaultButton = () => {
    return (
      <Button
        tabIndex='0'
        enabled={this.props.enabled}
        onClick={this.props.onClick}
        className={this.props.className}
      >
        {this.props.children}
      </Button>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.props.loading ? this.loadingButton() : this.defaultButton()}
      </React.Fragment>
    );
  }
}

ProgressButton.propTypes = {
  enabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func
};

ProgressButton.defaultProps = {
  enabled: true,
  loading: false,
  onClick: () => {}
};