// GLOBAL imports
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

// LOCAL imports
import Styles from './Autocomplete.less';
import { DefaultInput, DefaultElement } from '../../templates';
import {
  handlePanelNavigation,
  isNavigationKey,
  isDropdownNavigationKey,
  isSubmitKey
} from '../../utils/keyboardUtils';

export default class Autocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      provider: isFunction(props.source) ? props.source : null,
      source: isArray(props.source)
        ? props.source
        : props.selected
        ? [props.selected]
        : [],
      showAutocompletePanel: false,
      autocompletePanelDirection: 'down',
      loading: false,
      selected: props.selected ? props.selected : null,
      lastSelected: props.selected,
      lastSearch: ''
    };

    this.searchValueDebounced = debounce(
      this.searchValueDebounced,
      this.props.throttleTime
    );

    this.maxPanelHeight = 300;
  }

  get styles() {
    return Object.assign({}, Styles, this.props.styles);
  }

  get inFocus() {
    return document.activeElement === this.refs.autocompleteBlock;
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
    window.addEventListener('resize', this.handleResizeListener);
  };

  componentWillUnmount = () => {
    window.removeEventListener('click', this.handleClickListener);
    window.removeEventListener('scroll', this.handleScrollListener, true);
    document.removeEventListener('keydown', this.handleKeyDownListener);
    window.addEventListener('resize', this.handleResizeListener);
  };

  handleResizeListener = () => {
    if (!this.props.readOnly && !this.props.disabled) {
      if (this.state.showAutocompletePanel) {
        this.calcPanelAttributes();
      }
    }
  };

  handleClickListener = ({ target }) => {
    if (!this.props.readOnly && !this.props.disabled) {
      if (
        (this.state.showAutocompletePanel &&
          !this.refs.autocompleteBlock.contains(target) &&
          !this.refs.autocompletePanel.contains(target)) ||
        Array.from(this.refs.autocompletePanel.querySelectorAll('ul li')).some(
          el => el.contains(target)
        )
      ) {
        this.setState(
          prevState =>
            Object.assign(prevState, {
              showAutocompletePanel: this.isPanelShown(false)
            }),
          () => {
            this.calcPanelAttributes();
            if (this.state.showAutocompletePanel) {
              this.refs.autocompletePanel.focus();
            }
          }
        );
      }
    }
  };

  handleScrollListener = ({ target }) => {
    if (
      !this.props.readOnly &&
      !this.props.disabled &&
      !this.refs.autocompletePanel.contains(target)
    ) {
      const autocompleteInputBounds = this.refs.autocompleteBlock.getBoundingClientRect();
      if (
        autocompleteInputBounds.bottom + this.maxPanelHeight >=
          window.innerHeight &&
        this.state.autocompletePanelDirection !== 'up'
      ) {
        this.setState({
          autocompletePanelDirection: 'up'
        });
      } else if (
        autocompleteInputBounds.bottom + this.maxPanelHeight <
          window.innerHeight &&
        this.state.autocompletePanelDirection !== 'down'
      ) {
        this.setState({
          autocompletePanelDirection: 'down'
        });
      }

      if (this.state.showAutocompletePanel) {
        this.calcPanelAttributes();
      }
    }
  };

  handleKeyDownListener = e => {
    if (!this.props.readOnly && !this.props.disabled) {
      if (
        this.state.showAutocompletePanel &&
        (this.refs.autocompletePanel.contains(e.target) ||
          this.refs.autocompleteInput.contains(e.target))
      ) {
        if (isDropdownNavigationKey(e.keyCode)) {
          e.preventDefault();
        }
        handlePanelNavigation(e, this.refs.autocompletePanel);
      } else if (isSubmitKey(e.keyCode) && this.inFocus) {
        this.refs.autocompleteInput.querySelector('input').focus();
      }
    }
  };

  isPanelShown = value =>
    typeof value !== 'undefined' ? value : !this.state.showAutocompletePanel;

  calcPanelAttributes = () => {
    const autocompleteInputBounds = this.refs.autocompleteBlock.getBoundingClientRect();
    const autocompletePanelHeight = get(
      this.refs.autocompletePanel.getBoundingClientRect(),
      'height',
      0
    );
    this.refs.autocompletePanel.style.width = `${
      autocompleteInputBounds.width
    }px`;
    this.refs.autocompletePanel.style.left = `${autocompleteInputBounds.left +
      window.pageXOffset}px`;

    if (this.state.autocompletePanelDirection === 'down') {
      this.refs.autocompletePanel.style.top = `${autocompleteInputBounds.bottom +
        window.pageYOffset}px`;
    } else if (this.state.autocompletePanelDirection === 'up') {
      this.refs.autocompletePanel.style.top = `${autocompleteInputBounds.top +
        window.pageYOffset -
        autocompletePanelHeight}px`;
    }
  };

  selectOption = option => {
    this.setState(
      prevState => Object.assign({}, prevState, { selected: option }),
      () => {
        this.props.onChange(option);
        this.refs.autocompleteBlock.focus();
      }
    );
  };

  searchValueDebounced = queryString => {
    this.setState(
      prevState =>
        Object.assign({}, prevState, {
          loading: true,
          lastSearch: queryString,
          showAutocompletePanel: this.isPanelShown(false)
        }),
      () => {
        this.state.provider(queryString).then(data => {
          if (this.state.lastSearch === queryString) {
            this.setState(
              prevState =>
                Object.assign({}, prevState, {
                  source: data,
                  loading: false,
                  showAutocompletePanel: this.isPanelShown(true)
                }),
              () => this.calcPanelAttributes()
            );
          }
        });
      }
    );
  };

  searchValue = (event, queryString) => {
    this.calcPanelAttributes();

    if (isNavigationKey(event.keyCode)) {
      return;
    }

    if (!queryString) {
      this.setState(prevState =>
        Object.assign({}, prevState, {
          loading: false,
          source: !prevState.provider ? this.props.source : [],
          showAutocompletePanel: this.isPanelShown(false)
        })
      );
    } else if (this.state.provider) {
      this.searchValueDebounced(queryString);
    } else {
      this.setState(prevState =>
        Object.assign({}, prevState, {
          showAutocompletePanel: this.isPanelShown(true),
          source:
            this.props.source &&
            this.props.source.filter(
              option =>
                option[this.props.searchField]
                  .toString()
                  .toLowerCase()
                  .indexOf(queryString.toLowerCase()) !== -1
            )
        })
      );
    }
  };

  clearValue = () => {
    this.setState(
      prevState =>
        Object.assign(prevState, {
          loading: false,
          selected: null,
          showAutocompletePanel: this.isPanelShown(false)
        }),
      () => {
        this.calcPanelAttributes();
        this.props.onChange(null);
      }
    );
  };

  isSelectedOption = option =>
    this.state.selected !== null && isEqual(this.state.selected, option);

  renderAutocompletePanel = () => {
    const AutocompleteElement = this.props.elementComponent;

    return ReactDOM.createPortal(
      <span
        className={[
          this.styles.autocompletePanel,
          this.state.showAutocompletePanel ? this.styles.active : null
        ].join(' ')}
        ref="autocompletePanel"
        tabIndex="-1"
      >
        <ul>
          {this.state.source &&
            this.state.source instanceof Array &&
            this.state.source
              .filter(option => !isEqual(this.state.selected, option))
              .map((option, index) => (
                <li
                  key={JSON.stringify(option)}
                  onClick={() => this.selectOption(option)}
                >
                  <AutocompleteElement
                    data={option}
                    index={index}
                    isSelected={this.isSelectedOption(option)}
                  />
                </li>
              ))}
          {this.state.source &&
            this.state.source instanceof Array &&
            !this.state.source.filter(
              option => !isEqual(this.state.selected, option)
            ).length && (
              <li
                className={this.styles.autocompleteElementNoOptions}
                onClick={() => this.refs.autocompleteBlock.focus()}
              >
                {this.props.emptyMessage}
              </li>
            )}
        </ul>
      </span>,
      document.body
    );
  };

  renderAutocompleteInput = () => {
    const AutocompleteInput = this.props.inputComponent;

    return (
      <span className={this.styles.autocompleteInput} ref="autocompleteInput">
        <input
          type="text"
          tabIndex="-1"
          readOnly={this.props.readOnly || this.props.disabled}
          key={JSON.stringify(this.state.selected)}
          placeholder={
            this.props.error ? this.props.errorMsg : this.props.placeholder
          }
          defaultValue={
            !this.props.error && this.state.selected
              ? AutocompleteInput(this.state.selected)
              : undefined
          }
          className={[
            this.props.readOnly ? Styles.readonly : null,
            this.props.disabled ? Styles.disabled : null,
            this.props.error ? Styles.error : null
          ].join(' ')}
          onKeyUp={e => this.searchValue(e, e.target.value)}
        />
        <span className={Styles.autocompleteIcon}>
          {this.state.loading && (
            <span className={Styles.loadingIcon}>
              <div />
              <div />
              <div />
              <div />
            </span>
          )}
          {!this.state.loading &&
            !this.props.disabled &&
            !this.props.readOnly &&
            !!this.state.selected && (
              <span className={Styles.crossIcon} onClick={this.clearValue}>
                &#10005;
              </span>
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
          this.styles.autocomplete,
          this.props.readOnly ? this.styles.readonly : null,
          this.props.disabled ? this.styles.disabled : null,
          this.state.isFocus ? this.styles.focus : null,
          this.props.error ? this.styles.error : null
        ].join(' ')}
        ref="autocompleteBlock"
        {...tabIndexProperty}
      >
        {this.renderAutocompleteInput()}
        {this.renderAutocompletePanel()}
      </div>
    );
  }
}

Autocomplete.propTypes = {
  source: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.func
  ]).isRequired,
  searchField: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  selected: PropTypes.any,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  elementComponent: PropTypes.func,
  inputComponent: PropTypes.func,
  throttleTime: PropTypes.number,
  styles: PropTypes.object,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
  emptyMessage: PropTypes.string
};

Autocomplete.defaultProps = {
  onChange: () => {},
  searchField: 'label',
  readOnly: false,
  required: false,
  disabled: false,
  elementComponent: DefaultElement,
  inputComponent: DefaultInput,
  throttleTime: 300,
  styles: {},
  error: false,
  errorMsg: 'Value is required',
  emptyMessage: 'There is no options.'
};
