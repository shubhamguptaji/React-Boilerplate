import React from 'react';
import * as arrayUtils from '../../utils/arrayUtils.js';
import * as misc from '../../utils/misc.js';

//TODO: add error handling
function List(props) {
  const items = props.items;
  const keySelector = props.keySelector;
  const headerTemplate = props.headerTemplate;
  const itemTemplate = props.itemTemplate;
  const NoItemsTemplate = props.noItemsTemplate
    ? props.noItemsTemplate
    : DefaultEmptyTemplate;

  if (!items || !items.length) {
    return <NoItemsTemplate />;
  }

  //Check if we are grouping items
  if (misc.isFunction(keySelector)) {
    const grouped = arrayUtils.groupBy(items, keySelector);
    //Grouping view
    return grouped.map(function(group) {
      return (
        <GroupItem
          key={group.key}
          group={group}
          headerTemplate={headerTemplate}
          itemTemplate={itemTemplate}
        />
      );
    });
  } else {
    //Flat view (without grouping).
    return <ListItems items={items} itemTemplate={itemTemplate} />;
  }
}

function GroupItem(props) {
  const HeaderTemplate = props.headerTemplate;
  const itemTemplate = props.itemTemplate;
  const group = props.group;
  const items = group.value;

  return (
    <div>
      <HeaderTemplate group={group} />
      <ListItems items={items} itemTemplate={itemTemplate} />
    </div>
  );
}

function ListItems(props) {
  const items = props.items;
  const ItemTemplate = props.itemTemplate;
  return items.map(function(item, index) {
    return <ItemTemplate key={index} item={item} index={index} />;
  });
}

function DefaultEmptyTemplate() {
  const style = {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Avenir Next Medium',
    paddingTop: '10px',
    paddingBottom: '10px',
    color: '#7F8Fa4'
  };

  return <div style={style}>No items available.</div>;
}

export default List;