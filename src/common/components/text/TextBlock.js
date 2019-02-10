import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import style from './TextBlock.less';
import { OverflowTooltip } from '../index';

const cx = classNames.bind(style);

const TextBlock = (props) => {
  const {
    className,
    children,
    textTrimming,
    textWrapping,
    datauitestid
  } = props;
  const trimmingEnabled = textTrimming === 'CharacterEllipsis';
  const wrappingDisabled = textWrapping === 'NoWrap';

  const classes = cx(
    className,
    { nowrap: wrappingDisabled },
    { trimmed: trimmingEnabled }
  );

  return (
    <OverflowTooltip title={children}>
      <div
        className={classes}
        datauitestid={datauitestid ? datauitestid : null}
      >
        {children}
      </div>
    </OverflowTooltip>
  );
};

TextBlock.defaultProps = {
  textTrimming: 'CharacterEllipsis',
  textWrapping: 'Wrap'
};

TextBlock.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.bool
  ]),
  textTrimming: PropTypes.oneOf(['None', 'CharacterEllipsis']),
  textWrapping: PropTypes.oneOf(['NoWrap', 'Wrap'])
};

export default TextBlock;