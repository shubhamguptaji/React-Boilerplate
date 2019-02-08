import React from 'react';
import PropTypes from 'prop-types';
import Styles from './circleBadge.less';

export default class CircleBadge extends React.Component {
  render() {
    return (
      <div className={Styles.circleBadge}>
        {this.props.text}
        <span className={Styles.tooltip}>{this.props.tooltipText}</span>
      </div>
    );
  }
}

CircleBadge.propTypes = {
  text: PropTypes.string.isRequired,
  tooltipText: PropTypes.string
};

CircleBadge.defaultProps = {
  text: '-'
};
