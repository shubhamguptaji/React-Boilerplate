import React from 'react';
import style from './DetailsField.less';

function DetailsField(props) {
  const { label, value } = props;

  if (!value) {
    return null;
  }

  return (
    <div>
      <div className={style.detailsFieldHeader}>{label}</div>
      <div className={style.detailsFieldValue}>{value}</div>
    </div>
  );
}

export default DetailsField;
