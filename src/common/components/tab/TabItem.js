import React from 'react';

function TabItem(props) {
  const label = props.label;
  const tabClass = props.tabClass;
  const children = props.children;
  const index = props.index;
  const id = props.id;

  return (
    <div label={label} tabClass={tabClass} index={index} id={id}>
      {children.map(child => {
        return child.props.children;
      })}
    </div>
  );
}

export default TabItem;
