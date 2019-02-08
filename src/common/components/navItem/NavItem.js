//GLOBAL imports
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Popup } from 'horizon-ui-react';
//LOCAL imports
import style from './NavItem.less';
//import { Icon } from '../';

class NavItem extends Component {
  render() {
    const { path, isActive, content, pathName } = this.props;
    const svgClass = [style.icon, isActive ? style.active : null].join(' ');

    return (
      <div className={style.iconWrap}>
        <NavLink to={{ pathname: pathName }}>
          <Popup
            className={style.icontooltip}
            trigger={
              <svg className={svgClass}>
                <path d={path} />
              </svg>
            }
            content={content}
            basic
            position='right center'
            inverted
          />
        </NavLink>
      </div>
    );
  }
}

export default NavItem;