import React, { Component } from 'react';
import Tab from '../tab/Tab';
import * as misc from '../../utils/misc';
import { usageEventLogger } from '../../../api/';
import constants from '../../utils/constants';
import usageEvents from '../../utils/usageEvents';

class TabPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIndex: this.defaultTabIndex()
    };
  }

  defaultTabIndex() {
    if (this.props.children.length === 0) {
      return -1;
    }

    if (this.props.selectedTabIndex) {
      return this.props.selectedTabIndex;
    }

    return 0;
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.selectedTabIndex ||
      this.props.selectedTabIndex === prevProps.selectedTabIndex
    ) {
      return;
    }

    const newCurrentTabIndex = this.defaultTabIndex();

    if (this.state.currentTabIndex === newCurrentTabIndex) {
      return;
    }

    const tabProps = this.props.children[newCurrentTabIndex].props;
    const tab = {
      tag: tabProps.tag,
      label: tabProps.label,
      index: newCurrentTabIndex
    };

    this.setState({
      currentTabIndex: newCurrentTabIndex
    });

    this.raiseTabChanged(tab);
  }

  raiseTabChanged(tab) {
    if (misc.isFunction(this.props.onTabChanged)) {
      this.props.onTabChanged(tab);
    }
  }

  onClickTabItem = (tab) => {
    this.setState({ currentTabIndex: tab.index });
    this.raiseTabChanged(tab);
    this.logUsageEvent(tab.tag);
  };

  logUsageEvent = (tag) => {
    if (tag) {
      switch (tag) {
        case constants.searchTabs.projects:
          usageEventLogger.logUsageEvent(usageEvents.searchProjectsTab);
          break;
        case constants.searchTabs.companies:
          usageEventLogger.logUsageEvent(usageEvents.searchClientsTab);
          break;
        case constants.searchTabs.default:
          usageEventLogger.logUsageEvent(usageEvents.searchAllTab);
          break;
        case constants.projectTabs.summary:
          usageEventLogger.logUsageEvent(usageEvents.projectSummaryTab);
          break;
        case constants.projectTabs.documents:
          usageEventLogger.logUsageEvent(usageEvents.projectDocumentsTab);
          break;
        case constants.projectTabs.dealTeam:
          usageEventLogger.logUsageEvent(usageEvents.projectDealTeamTab);
          break;
        case constants.clientTabs.summary:
          usageEventLogger.logUsageEvent(usageEvents.clientSummaryTab);
          break;
        case constants.clientTabs.coverageTeam:
          usageEventLogger.logUsageEvent(usageEvents.clientCoverageTeamTab);
          break;
        default:
          usageEventLogger.logUsageEvent(usageEvents.undefinedEvent);
      }
    }
  };

  render() {
    let tabIndex = -1;
    const children = this.props.children;
    const currentTabIndex = this.state.currentTabIndex;
    const olClassName = this.props.olClassName;
    return (
      <div className='tabs'>
        <ol className={olClassName}>
          {children.map((child) => {
            const { label, tabClass, tag, id } = child.props;
            tabIndex++;
            return (
              <Tab
                tag={tag}
                id={id}
                key={tabIndex}
                tabClass={tabClass}
                label={label}
                currentTabIndex={currentTabIndex}
                index={tabIndex}
                handleClick={this.onClickTabItem}
              />
            );
          })}
        </ol>
        <div className='tab-content'>
          {currentTabIndex >= 0 && children[currentTabIndex].props.children}
        </div>
      </div>
    );
  }
}

export default TabPanel;