import React from 'react';
import style from './StatusBar.less';

function StatusBar(props) {
  const color = props.color;
  const percent = getPercents(props.percent);
  const progressBarStyle = {
    width: `${percent}%`,
    backgroundColor: color
  };
  return (
    <div className={style.statusContainer}>
      <div className={style.statusBar} style={progressBarStyle} />
    </div>
  );
}

function getPercents(points) {
  return points * 100;
}

export default StatusBar;
