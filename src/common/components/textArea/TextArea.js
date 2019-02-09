// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
// LOCAL imports
import Styles from './TextArea.less';

class TextArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocus: false,
      charRemaining: this.props.maxLength
    };
  }

  get styles() {
    return Object.assign({}, Styles, this.props.styles);
  }

  calcCharRemaining = ({ target: { value } }) => {
    this.setState(prevState => {
      return Object.assign({}, prevState, {
        charRemaining: this.props.maxLength - value.length
      });
    });
  };

  onTextAreaFocus = () => {
    this.toggleTextAreaFocus();
    this.props.onFocus();
  };

  onTextAreaBlur = () => {
    this.toggleTextAreaFocus();
    this.props.onBlur();
  };

  onTextAreaChange = ({ target: { value } }) => {
    this.props.onChange(value);
  };

  toggleTextAreaFocus = () => {
    this.setState(prevState => {
      return Object.assign({}, prevState, {
        isFocus: !prevState.isFocus
      });
    });
  };

  render() {
    return (
      <div
        className={[
          this.styles.textAreaContainer,
          this.props.readOnly ? this.styles.readonly : null,
          this.props.disabled ? this.styles.disabled : null,
          this.state.isFocus ? this.styles.focus : null,
          this.props.error ? this.styles.error : null
        ].join(' ')}
      >
        <textarea
          className={this.styles.textArea}
          placeholder={
            this.props.error ? this.props.errorMsg : this.props.placeholder
          }
          readOnly={this.props.readOnly}
          disabled={this.props.disabled}
          required={this.props.required}
          minLength={this.props.minLength}
          maxLength={this.props.maxLength}
          defaultValue={this.props.value}
          onFocus={this.onTextAreaFocus}
          onBlur={this.onTextAreaBlur}
          onKeyUp={this.calcCharRemaining}
          onKeyDown={this.calcCharRemaining}
          onChange={this.onTextAreaChange}
        />
        {this.props.maxLength &&
          !this.props.readonly && (
            <div
              className={this.styles.charCounter}
              style={{ visibility: this.state.isFocus ? 'visible' : 'hidden' }}
            >
              {this.state.charRemaining} characters remaining
            </div>
          )}
      </div>
    );
  }
}

TextArea.propTypes = {
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  styles: PropTypes.object,
  error: PropTypes.bool,
  errorMsg: PropTypes.string
};

TextArea.defaultProps = {
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  value: undefined,
  readOnly: false,
  disabled: false,
  required: false,
  minLength: null,
  maxLength: null,
  styles: {},
  error: false,
  errorMsg: 'Value is required'
};

export default TextArea;
