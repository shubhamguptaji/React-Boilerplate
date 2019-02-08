// GLOBAL imports
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import includes from 'lodash/includes';
import get from 'lodash/get';

// LOCAL imports
import Styles from './Dropdown.less';
import { DefaultInput, DefaultElement } from '../../templates';
import { toggleArrayValue } from '../../utils/arrayUtils';
import {
  handlePanelNavigation,
  isSubmitKey,
  isDropdownNavigationKey
} from '../../utils/keyboardUtils';
import { defaultComparator } from '../../utils/misc';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    const defaultSelectedValue = props.multiple ? [] : null;

    this.state = {
      showDropdownPanel: false,
      dropdownPanelDirection: 'down',
      selected: props.selected ? props.selected : defaultSelectedValue,
      lastSelected: props.selected,
      searchableText: props.selected ? get(props.selected, 'label') : ''
    };

    this.maxPanelHeight = 300;
  }

  get styles() {
    return Object.assign({}, Styles, this.props.styles);
  }

  get inFocus() {
    return document.activeElement === this.refs.dropdownBlock;
  }

  static getDerivedStateFromProps = (nextProps, state) => {
    if (!isEqual(nextProps.selected, state.lastSelected)) {
      return {
        selected: nextProps.selected,
        lastSelected: nextProps.selected
      };
    }

    return null;
  };

  componentDidMount = () => {
    window.addEventListener('click', this.handleClickListener);
    window.addEventListener('scroll', this.handleScrollListener, true);
    document.addEventListener('keydown', this.handleKeyDownListener);
  };

  componentWillUnmount = () => {
    window.removeEventListener('click', this.handleClickListener);
    window.removeEventListener('scroll', this.handleScrollListener, true);
    document.removeEventListener('keydown', this.handleKeyDownListener);
  };

  handleClickListener = ({ target }) => {
    if (!this.props.readOnly && !this.props.disabled) {
      if (
        (this.state.showDropdownPanel &&
          !this.refs.dropdownBlock.contains(target) &&
          !this.refs.dropdownPanel.contains(target)) ||
        (!this.props.multiple &&
          Array.from(this.refs.dropdownPanel.querySelectorAll('ul li')).some(
            (el) => el.contains(target)
          ))
      ) {
        this.toggleDropdownPanel(false);
      } else if (this.refs.dropdownInput.contains(target)) {
        this.toggleDropdownPanel();
      }
    }
  };

  handleInputType = (event) => {
    this.setState({
      searchableText: event.target.value
    });

    //IN: handle when we cleared the input
    if (isEmpty(event.target.value)) {
      this.setState({
        selected: null
      });
    }
  };

  handleScrollListener = ({ target }) => {
    if (
      !this.props.readOnly &&
      !this.props.disabled &&
      !this.refs.dropdownPanel.contains(target)
    ) {
      const dropdownInputBounds = this.refs.dropdownBlock.getBoundingClientRect();
      if (
        dropdownInputBounds.bottom + this.maxPanelHeight >=
        window.innerHeight &&
        this.state.dropdownPanelDirection !== 'up'
      ) {
        this.setState({
          dropdownPanelDirection: 'up'
        });
      } else if (
        dropdownInputBounds.bottom + this.maxPanelHeight < window.innerHeight &&
        this.state.dropdownPanelDirection !== 'down'
      ) {
        this.setState({
          dropdownPanelDirection: 'down'
        });
      }

      if (this.state.showDropdownPanel) {
        this.calcPanelAttributes();
      }
    }
  };

  handleKeyDownListener = (event) => {
    if (!this.props.readOnly && !this.props.disabled) {
      if (
        this.state.showDropdownPanel &&
        (this.refs.dropdownPanel.contains(event.target) ||
          this.refs.dropdownInput.contains(event.target))
      ) {
        if (isDropdownNavigationKey(event.keyCode)) {
          event.preventDefault();
          handlePanelNavigation(event, this.refs.dropdownPanel);
        }
      } else if (isSubmitKey(event.keyCode) && this.inFocus) {
        this.toggleDropdownPanel();
      }
    }
  };

  toggleDropdownPanel = (value) => {
    this.setState(
      {
        showDropdownPanel: !isUndefined(value)
          ? value
          : !this.state.showDropdownPanel
      },
      () => {
        this.calcPanelAttributes();
        if (this.state.showDropdownPanel && !this.props.searchable) {
          this.refs.dropdownPanel.focus();
        }
      }
    );
  };

  calcPanelAttributes = () => {
    const dropdownInputBounds = this.refs.dropdownBlock.getBoundingClientRect();
    const dropdownPanelHeight = get(
      this.refs.dropdownPanel.getBoundingClientRect(),
      'height',
      0
    );
    this.refs.dropdownPanel.style.width = `${dropdownInputBounds.width}px`;
    this.refs.dropdownPanel.style.left = `${dropdownInputBounds.left +
    window.pageXOffset}px`;

    if (this.state.dropdownPanelDirection === 'down') {
      this.refs.dropdownPanel.style.top = `${dropdownInputBounds.bottom +
      window.pageYOffset}px`;
    } else if (this.state.dropdownPanelDirection === 'up') {
      this.refs.dropdownPanel.style.top = `${dropdownInputBounds.top +
      window.pageYOffset -
      dropdownPanelHeight}px`;
    }
  };

  selectOption = (option) => {
    this.setState(
      (prevState) => {
        const selected = this.props.multiple
          ? toggleArrayValue(prevState.selected, option)
          : option;
        this.props.onChange(selected);
        return Object.assign({}, prevState, {
          selected: selected,
          searchableText: selected.label
        });
      },
      () => {
        this.refs.dropdownBlock.focus();
      }
    );
  };

  isSelectedOption = (option) => {
    return (
      !isNull(this.state.selected) &&
      (this.props.multiple
        ? this.state.selected.some((selectedOption) =>
          isEqual(selectedOption, option)
        )
        : isEqual(this.state.selected, option))
    );
  };

  dropdownInputValue = () => {
    if (this.props.searchable) {
      return this.state.searchableText;
    } else {
      const DropdownInput = this.props.inputComponent;
      return !this.props.error && this.state.selected
        ? DropdownInput(this.state.selected)
        : '';
    }
  };

  renderDropdownPanel = () => {
    const DropdownElement = this.props.elementComponent;

    return ReactDOM.createPortal(
      <span
        className={[
          this.styles.dropdownPanel,
          this.state.showDropdownPanel ? this.styles.active : null
        ].join(' ')}
        ref='dropdownPanel'
        tabIndex='-1'
        datauitestid='dropdownPanel'
      >
        <ul>
          {this.props.source &&
          this.props.source instanceof Array &&
          this.props.source
            .filter(
              (option) =>
                !this.props.excludeOptions.some((excludeOption) =>
                  this.props.comparator(excludeOption, option)
                )
            )
            .filter(
              (option) =>
                this.props.searchable &&
                !isEmpty(this.state.searchableText) &&
                isEmpty(this.state.selected)
                  ? includes(
                  option.label.toLowerCase(),
                  this.state.searchableText.toLowerCase()
                  )
                  : true
            )
            .map((option, index) => {
              return (
                <li
                  key={JSON.stringify(option)}
                  onClick={() => this.selectOption(option)}
                >
                  <DropdownElement
                    data={option}
                    index={index}
                    isSelected={this.isSelectedOption(option)}
                  />
                </li>
              );
            })}
          {this.props.source &&
          this.props.source instanceof Array &&
          !this.props.source.filter(
            (option) => !this.props.excludeOptions.includes(option)
          ).length && (
            <li
              className={this.styles.dropdownElementNoOptions}
              onClick={() => this.refs.dropdownBlock.focus()}
            >
              {this.props.emptyMessage}
            </li>
          )}
        </ul>
      </span>,
      document.body
    );
  };

  renderDropdownInput = () => {
    return (
      <span className={this.styles.dropdownInput} ref='dropdownInput'>
        <input
          type='text'
          tabIndex='-1'
          readOnly={!this.props.searchable}
          onChange={this.handleInputType}
          placeholder={
            this.props.error ? this.props.errorMsg : this.props.placeholder
          }
          value={this.dropdownInputValue()}
          className={[
            this.props.readOnly ? Styles.readonly : null,
            this.props.disabled ? Styles.disabled : null,
            this.props.error ? Styles.error : null
          ].join(' ')}
          datauitestid={
            this.props.datauitestid ? this.props.datauitestid : null
          }
        />
        <span
          className={[
            Styles.dropdownIcon,
            this.props.readOnly || this.props.disabled ? Styles.disabled : null
          ].join(' ')}
        >
          {this.props.loading && (
            <span className={Styles.loadingIcon}>
              <div />
              <div />
              <div />
              <div />
            </span>
          )}
          {!this.props.loading && (
            <span
              className={
                this.state.showDropdownPanel ? Styles.caretUp : Styles.caretDown
              }
            />
          )}
        </span>
      </span>
    );
  };

  render() {
    const tabIndexProperty =
      !this.props.readOnly && !this.props.disabled ? { tabIndex: '0' } : {};
    return (
      <div
        className={[
          this.styles.dropdown,
          this.props.readOnly ? this.styles.readonly : null,
          this.props.disabled ? this.styles.disabled : null,
          this.props.error ? this.styles.error : null
        ].join(' ')}
        ref='dropdownBlock'
        {...tabIndexProperty}
      >
        {this.renderDropdownInput()}
        {this.renderDropdownPanel()}
      </div>
    );
  }
}

Dropdown.propTypes = {
  source: PropTypes.arrayOf(PropTypes.any).isRequired,
  excludeOptions: PropTypes.arrayOf(PropTypes.any),
  comparator: PropTypes.func,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  selected: PropTypes.any,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  elementComponent: PropTypes.func,
  inputComponent: PropTypes.func,
  styles: PropTypes.object,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
  emptyMessage: PropTypes.string,
  searchable: PropTypes.bool
};

Dropdown.defaultProps = {
  onChange: () => {},
  excludeOptions: [],
  comparator: defaultComparator,
  multiple: false,
  required: false,
  readOnly: false,
  disabled: false,
  loading: false,
  elementComponent: DefaultElement,
  inputComponent: DefaultInput,
  styles: {},
  error: false,
  errorMsg: 'Value is required',
  emptyMessage: 'There is no options.',
  searchable: false
};