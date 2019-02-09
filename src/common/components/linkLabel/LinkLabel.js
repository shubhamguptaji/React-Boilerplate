import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'react-router-dom';

const LinkLabel = props => {
  const { className, children, to, datauitestid } = props;
  const classes = cx(className);

  return (
    <Link to={to}>
      <div
        className={classes}
        datauitestid={datauitestid ? datauitestid : null}
      >
        {children}
      </div>
    </Link>
  );
};

LinkLabel.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

  className: PropTypes.string,

  children: PropTypes.node.isRequired
};

export default LinkLabel;
