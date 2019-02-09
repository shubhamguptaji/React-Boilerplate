// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

// LOCAL imports
import { Icon, IconButton } from '..';
import { searchIcon, crossIcon } from '../../../assets/icons/svgPaths';
import Styles from './Text.less';

class Text extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocus: false,
      showClearButton: false
    };

    this.showClearButton = false;
    this.onTextChangeThrottled = debounce(
      this.onTextChangeThrottled,
      this.props.throttleTime
    );
  }

  get styles() {
    return Object.assign({}, Styles, this.props.styles);
  }

  componentDidUpdate() {
    if (!isUndefined(this.props.value) && !isNull(this.props.value)) {
      this.refs.searchInput.value = this.props.value;
    }
  }

  onTextFocus = () => {
    if (!this.props.readOnly && !this.props.disabled) {
      this.toggleTextFocus();
      this.props.onFocus();
    }
  };

  onTextBlur = () => {
    if (!this.props.readOnly && !this.props.disabled) {
      this.toggleTextFocus();
      this.props.onBlur();
    }
  };

  onTextChangeThrottled = text => {
    this.props.onChange(text);
  };

  onTextChange = ({ target: { value } }) => {
    if (!this.props.readOnly && !this.props.disabled) {
      if (this.props.showClearButton) {
        this.setState(prevState => {
          return Object.assign({}, prevState, {
            showClearButton: !!value
          });
        });
      }

      this.onTextChangeThrottled(value);
    }
  };

  toggleTextFocus = () => {
    this.setState(prevState => {
      return Object.assign({}, prevState, {
        isFocus: !prevState.isFocus
      });
    });
  };

  onClearClicked = () => {
    this.refs.searchInput.value = '';
    this.setState(prevState => {
      return Object.assign({}, prevState, {
        showClearButton: false
      });
    });

    this.props.onChange();
  };

  render() {
    const valueProp = this.props.readOnly
      ? { value: this.props.value }
      : { defaultValue: this.props.value };

    return (
      <div
        className={[
          this.styles.textContainer,
          this.props.readOnly ? this.styles.readonly : null,
          this.props.disabled ? this.styles.disabled : null,
          this.state.isFocus ? this.styles.focus : null,
          this.props.error ? this.styles.error : null
        ].join(' ')}
      >
        {this.props.showSearchIcon && (
          <Icon
            className={this.styles.searchIcon}
            viewBox={'0 0 25 25'}
            path={searchIcon}
          />
        )}
        <input
          ref={'searchInput'}
          className={this.styles.text}
          type={this.props.type}
          name={this.props.name}
          placeholder={
            this.props.error ? this.props.errorMsg : this.props.placeholder
          }
          readOnly={this.props.readOnly}
          disabled={this.props.disabled}
          required={this.props.required}
          min={this.props.minValue}
          max={this.props.maxValue}
          minLength={this.props.minLength}
          maxLength={this.props.maxLength}
          {...valueProp}
          onFocus={this.onTextFocus}
          onBlur={this.onTextBlur}
          onChange={this.onTextChange}
          onKeyUp={this.props.onKeyUp}
        />
        {this.state.showClearButton && (
          <IconButton
            className={this.styles.clearIcon}
            onClick={this.onClearClicked}
            path={crossIcon}
          />
        )}
      </div>
    );
  }
}

Text.propTypes = {
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyUp: PropTypes.func,
  value: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  styles: PropTypes.object,
  throttleTime: PropTypes.number,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
  showSearchIcon: PropTypes.bool,
  showClearButton: PropTypes.bool
};

Text.defaultProps = {
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onKeyUp: () => {},
  value: undefined,
  type: 'text',
  name: null,
  readOnly: false,
  disabled: false,
  required: false,
  minValue: null,
  maxValue: null,
  minLength: null,
  maxLength: null,
  styles: {},
  throttleTime: 300,
  error: false,
  errorMsg: 'Value is required',
  showSearchIcon: false,
  showClearIcon: false
};

export default Text;
