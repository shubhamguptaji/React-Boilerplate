import React from 'react';
import PropTypes from 'prop-types';
import Style from './WrappingTable.less';

class WrappingTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeRow: ''
    };
  }

  createTableHeader(headers, className) {
    if (headers) {
      return (
        <div
          className={WrappingTable.getClassName(className, Style.headerGroup)}
        >
          {this.objectToArray(headers).map((header, headerCount) => {
            return (
              <div
                className={Style.headerGroupColumn}
                id={'headerColumnId-' + headerCount}
                key={'headerColumnKey-' + headerCount}
              >
                {header}
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  }

  createTableRowGroup(itemsSource, className, noItemsTemplate) {
    if (itemsSource.length !== 0) {
      return (
        <div
          className={WrappingTable.getClassName(
            this.props.className,
            Style.rowGroup
          )}
        >
          {itemsSource.map((rowItems, rowCount) => {
            return this.createTableRow(
              rowItems,
              rowCount,
              this.props.className
            );
          })}
        </div>
      );
    } else {
      if (this.props.showNoItemsTemplate) {
        const NoItemsTemplate = noItemsTemplate
          ? noItemsTemplate
          : WrappingTable.defaultNoItemsTemplate;
        return (
          <div
            className={WrappingTable.getClassName(
              this.props.className,
              Style.rowGroup
            )}
          >
            <NoItemsTemplate />
          </div>
        );
      } else return null;
    }
  }

  createTableRow(rowItems, rowCount, className) {
    return (
      <div
        className={
          WrappingTable.getClassName(className, Style.row) +
          ' ' +
          this.isActiveRow('rowId-' + rowCount)
        }
        id={'rowId-' + rowCount}
        key={'rowKey-' + rowCount + Date.now()}
        onClick={(event) => {
          this.setState({
            activeRow: 'rowId-' + rowCount
          });
          this.props.handleRowItemClick(event, rowItems);
        }}
      >
        {this.objectToArray(rowItems).map((rowItem, rowItemCount) => {
          return WrappingTable.createTableRowColumn(rowItem, rowItemCount);
        })}
      </div>
    );
  }

  static createTableRowColumn(columnItem, columnItemCount, className) {
    return (
      <div
        className={WrappingTable.getClassName(className, Style.rowColumn)}
        id={'rowColumnId-' + columnItemCount}
        key={'rowColumnKey-' + columnItemCount}
      >
        {columnItem}
      </div>
    );
  }

  static getClassName(className, defaultClassName) {
    if (className) {
      return className + '-' + defaultClassName;
    } else {
      return defaultClassName;
    }
  }

  objectToArray(obj) {
    const array = [];

    Object.keys(obj).forEach((key) => {
      array.push(obj[key]);
    });

    return array;
  }

  static defaultNoItemsTemplate() {
    return (
      <p>
        No items to display
        <br />
        (Try changing your filters)
      </p>
    );
  }

  render() {
    const { header, className, itemSource } = this.props;

    return (
      <div
        className={WrappingTable.getClassName(className, Style.wrappingTable)}
      >
        {this.createTableHeader(header, className)}
        {this.createTableRowGroup(
          itemSource,
          WrappingTable.getClassName(className, Style.rowGroup),
          this.props.noItemsTemplate
        )}
      </div>
    );
  }

  isActiveRow(selectedRowId) {
    if (this.props.active && selectedRowId === this.state.activeRow)
      return Style.activeRow;
    else return '';
  }
}

WrappingTable.propTypes = {
  itemSource: PropTypes.array.isRequired,
  className: PropTypes.string,
  header: PropTypes.object
};

WrappingTable.defaultProps = {
  showNoItemsTemplate: false
};

export default WrappingTable;
-------------------------------------------------------------------------------
  -------------------------------------------------------------------------------
.\wrappingTable\WrappingTable.less
-------------------------------------------------------------------------------
  @import '../../../theme/colors';

.wrappingTable {
  width: 100%;
  overflow: auto;
  display: table;
  border-collapse: separate;
  font-size: 14px;
  font-weight: 600;
}

.headerGroup {
  display: table-header-group;
  font-family: 'Avenir Next Demi Bold', Arial, Helvetica, sans-serif;
}

.headerGroupColumn {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: table-cell;
  color: @color-dark-grey;
  padding: 20px 15px 15px 0;
  font-size: 11px;
  letter-spacing: 2px;
&:first-child {
    padding-left: 30px;
  }
&:last-child {
    padding-right: 30px;
  }
}

.rowGroup {
  display: table-row-group;
  font-family: 'Avenir Next Medium', Arial, Helvetica, sans-serif;
}

.row {
  line-height: 18px;
  display: table-row;
&:hover {
    background-color: @color-blue-textarea;
    cursor: pointer;
  }
&:last-child .rowColumn {
    border: 0;
  }
}

.rowColumn {
  vertical-align: middle;
  display: table-cell;
  padding: 18px 15px 18px 0;
  border-bottom: 1px solid @color-grey;
  word-wrap: break-word;
  word-break: break-word;
&:first-child {
    padding-left: 30px;
  }
&:last-child {
    padding-right: 30px;
  }
}

.activeRow {
  background-color: @color-light-grey;
}

@media (max-width: 1000px) {
.headerGroup {
    display: none;
  }

.row {
    display: grid;
  }

.rowColumn {
    padding: 5px 30px;
  &:not(:last-child) {
      border: 0;
    }
  &:last-child {
      padding-bottom: 10px;
    }
  &:first-child {
      padding-top: 10px;
    }
  }
}