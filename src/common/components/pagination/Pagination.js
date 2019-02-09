import React, { Component } from 'react';
import { default as HorizonPagination } from 'react-js-pagination';
import ceil from 'lodash/ceil';
import isEqual from 'lodash/isEqual';
import './Pagination.css';
import { IconButton } from '../index';
import { angleLeftIcon, angleRightIcon } from '../../../assets/icons/svgPaths';

export default class Pagination extends Component {
  render() {
    const { activePage, onPageChange, totalItems, pageSize } = this.props;
    return (
      <div className="pagination-center">
        <ChevronPagination
          page={activePage}
          direction={'left'}
          onChange={onPageChange}
        />
        <div className="pagination-wrapper">
          <HorizonPagination
            hideNavigation
            hideFirstLastPages
            activePage={activePage}
            onChange={onPageChange}
            itemsCountPerPage={25}
            pageRangeDisplayed={10}
            totalItemsCount={totalItems}
            innerClass="pagination-ul"
            itemClass="pagination-li"
            activeClass="pagination-li-active"
            linkClass="pagination-a"
          />
        </div>
        <ChevronPagination
          page={activePage}
          direction={'right'}
          items={totalItems}
          onChange={onPageChange}
          pageSize={pageSize}
        />
      </div>
    );
  }
}

const faIconHandlers = {
  left: <IconButton path={angleLeftIcon} />,
  right: <IconButton path={angleRightIcon} />,
  default: null
};

function ChevronIcons(props) {
  if (props.disabled) {
    return (
      <div className="pagination-chevrons pagination-chevrons-disabled">
        {props.children}
      </div>
    );
  }
  return (
    <div
      className="pagination-chevrons"
      onClick={() => props.onChange(props.page)}
    >
      {props.children}
    </div>
  );
}

export class ChevronPagination extends Component {
  left = 'left';
  right = 'right';

  render() {
    const {
      props: { page, direction, items, onChange, pageSize }
    } = this;
    const totalPages = ceil(items / pageSize);
    const disabled =
      (isEqual(page, 1) && isEqual(direction, this.left)) ||
      (isEqual(page, totalPages) && isEqual(direction, this.right));
    const handler = faIconHandlers[direction] || faIconHandlers.default;
    const newPage = isEqual(direction, this.left)
      ? page - 1
      : isEqual(direction, this.right)
        ? page + 1
        : -1;

    return (
      <ChevronIcons disabled={disabled} onChange={onChange} page={newPage}>
        {handler}
      </ChevronIcons>
    );
  }
}
