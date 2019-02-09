import React from 'react';
import PropTypes from 'prop-types';
import Styles from './badge.less';
import classNames from 'classnames/bind';

const cx = classNames.bind(Styles);

export default class Badge extends React.Component {
  render() {
    const { className, color } = this.props;
    const classes = cx(className, 'badge', Styles[color]);

    return <div className={classes}>{this.props.text}</div>;
  }
}

Badge.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    'blue',
    'lightBlue',
    'green',
    'orange',
    'red',
    'darkGrey',
    'grey',
    'lightGrey'
  ])
};

Badge.defaultProps = {
  color: 'lightBlue'
};
