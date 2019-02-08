import React, { Component } from 'react';
import './Tab.css';

class Tab extends Component {
  handleClick = () => {
    const { tag, label, handleClick, index } = this.props;
    handleClick({ label, tag, index });
  };

  render() {
    const {
      handleClick,
      props: { currentTabIndex, label, tabClass, index, id }
    } = this;

    let className = tabClass;
    if (currentTabIndex === index) {
      className = tabClass + '-active';
    }

    return (
      <li id={id} className={className} onClick={handleClick}>
        {label}
      </li>
    );
  }
}

export default Tab;