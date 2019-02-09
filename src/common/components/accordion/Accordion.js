import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import isEmpty from 'lodash/isEmpty';
import styles from './Accordion.less';

const cx = classNames.bind(styles);

const className = cx({
  searchinfodrop: true
});
const chevronClass = (isOpen) => {
  const chevClass = !isOpen
    ? styles.searchinfodropCaretDown
    : styles.searchinfodropCaretUp;
  return cx({ [chevClass]: true });
};
const headButton = cx({
  searchinfodroTitle: true
});

class Accordion extends Component {
  handleClick = (e) => {
    const { open } = this.state;
    const content = e.currentTarget.nextElementSibling;
    if (!isEmpty(content)) {
      content.style.display = open ? 'none' : 'block';
    }
    this.setState({ open: !open });
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const { open } = this.state;
    return (
      <div className={className}>
        <div className={styles.searchinfodropLabels} onClick={this.handleClick}>
          <div className={headButton}>{this.props.dropHeader}</div>
          <div className={chevronClass(open)} />
        </div>
        {open && this.props.children}
      </div>
    );
  }
}

Accordion.propTypes = {
  dropHeader: PropTypes.string
};

export default Accordion;