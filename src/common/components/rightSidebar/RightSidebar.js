import React, { Component } from 'react';
import { connect } from 'react-redux';
import { componentKeys, componentProvider } from '../../../api/index';
import constants from '../../utils/constants';
import usageEvents from '../../utils/usageEvents';
import { usageEventLogger } from '../../../api';
import { closeSideBar } from '../../../store/rightsidebar/actions';
import transactionDocumentsHelper from '../../../app/project/documents/helpers/TransactionDocumentsHelper';
import { IconButton } from '../index';
import { crossIcon } from '../../../assets/icons/svgPaths';

class RightSidebar extends Component {
  handleClick = () => {
    usageEventLogger.logUsageEvent(usageEvents.rightSidePanelClose);
    this.props.closeSideBar();
  };

  componentWillUnmount() {
    this.props.closeSideBar();
  }

  render() {
    const rightBar = this.props.rightBar;
    const Content = getContent(rightBar.dataType);
    let className = 'right-sidebar';
    if (rightBar.active) {
      className = className + ' active';
      return (
        <div className={className}>
          <IconButton
            path={crossIcon}
            onClick={this.handleClick}
            className={'button-close'}
          />
          <Content />
        </div>
      );
    }
    return null;
  }
}

function getContent(dataType) {
  switch (dataType) {
    case constants.approvalTypes.Generic:
      return componentProvider.resolve(componentKeys.GENERIC_APPROVAL_DETAILS);
    case constants.approvalTypes.Conflict:
      return componentProvider.resolve(componentKeys.CONFLICT_APPROVAL_DETAILS);
    case constants.transactionDocType:
      return transactionDocumentsHelper.transactionDocDetailComponent;
    default:
      return componentProvider.resolve(componentKeys.GENERIC_APPROVAL_DETAILS);
  }
}

const mapDispatchToProps = (dispatch) => ({
  closeSideBar() {
    return dispatch(closeSideBar());
  }
});

const mapStateToProps = function(state) {
  return {
    rightBar: state.rightBar
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RightSidebar);