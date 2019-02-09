//GLOBAL imports
import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
//LOCAL imports
import style from './SubNavigation.less';
import { usageEventLogger } from '../../../api/';

class SubNavigation extends Component {
  handleClick(usageEvent) {
    if (usageEvent) {
      usageEventLogger.logUsageEvent(usageEvent);
    }
  }

  render() {
    const { items } = this.props;
    return (
      <div className={style.tabs}>
        <ol className={style.tabList}>
          {items.map(({ url, title, usageEvent }) => {
            return (
              <li key={url.pathname} className={style.tabItem}>
                <NavLink
                  activeClassName={style.subNavigationActive}
                  to={url}
                  onClick={() => this.handleClick(usageEvent)}
                >
                  {title}
                </NavLink>
              </li>
            );
          })}
        </ol>
        <div className={style.tabContent}>
          {items.map(item => {
            const Component = item.component;
            const props = item.props;
            return (
              <React.Fragment key={item.url.pathname}>
                <Route
                  path={item.url.pathname}
                  render={() => <Component {...props} />}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SubNavigation;
