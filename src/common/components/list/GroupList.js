//GLOBAL Imports
import React from 'react';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
//LOCAL Imports
import { List } from '../index';
import * as misc from '../../utils/misc';
import style from './GroupList.less';

const GroupList = props => {
  const items = props.items;
  const groupOrderSelector = props.groupOrderSelector;
  const groupDisplaySelector = props.groupDisplaySelector;
  const orderInGroupSelector = props.orderInGroupSelector;
  const headerTemplate = props.headerTemplate;
  const headerTemplateSelector = props.headerTemplateSelector;
  const footerTemplate = props.footerTemplate;
  const footerTemplateSelector = props.footerTemplateSelector;
  const itemTemplate = props.itemTemplate;
  const NoItemsTemplate = props.noItemsTemplate
    ? props.noItemsTemplate
    : DefaultEmptyTemplate;

  if (!items || !items.length) {
    return <NoItemsTemplate />;
  }

  if (isFunction(groupOrderSelector)) {
    const grouped = misc.listGroupedBy(
      items,
      groupOrderSelector,
      groupDisplaySelector
    );
    return map(grouped, group => {
      return (
        <GroupItem
          key={group.key}
          group={group}
          headerTemplate={headerTemplate}
          headerTemplateSelector={headerTemplateSelector}
          footerTemplate={footerTemplate}
          footerTemplateSelector={footerTemplateSelector}
          itemTemplate={itemTemplate}
          orderInGroupSelector={orderInGroupSelector}
        />
      );
    });
  } else {
    return <List items={items} itemTemplate={itemTemplate} />;
  }
};

function GroupItem(props) {
  const itemTemplate = props.itemTemplate;
  const group = props.group;
  const rawItems = group.value;
  const orderInGroupSelector = props.orderInGroupSelector;

  const HeaderTemplate =
    isFunction(props.headerTemplateSelector) &&
    props.headerTemplateSelector(group.value)
      ? isFunction(props.headerTemplate)
        ? props.headerTemplate
        : EmptyHeaderTemplate
      : EmptyHeaderTemplate;

  const FooterTemplate =
    isFunction(props.footerTemplateSelector) &&
    props.footerTemplateSelector(group.value)
      ? isFunction(props.footerTemplate)
        ? props.footerTemplate
        : EmptyFooterTemplate
      : EmptyFooterTemplate;

  const items = orderInGroupSelector
    ? sortBy(rawItems, orderInGroupSelector)
    : rawItems;

  return (
    <div>
      <HeaderTemplate group={group} />
      <List items={items} itemTemplate={itemTemplate} />
      <FooterTemplate group={group} />
    </div>
  );
}

function DefaultEmptyTemplate() {
  return <div className={style.defaultEmptyTemplate}>No items available.</div>;
}

function EmptyFooterTemplate() {
  return null;
}

function EmptyHeaderTemplate() {
  return <br />;
}

export default GroupList;
