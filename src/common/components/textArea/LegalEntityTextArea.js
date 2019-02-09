// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import isEqual from 'lodash/isEqual';
// LOCAL imports
import Styles from './TextArea.less';

class LegalEntityTextArea extends React.Component {
  constructor(props) {
    super(props);

    const valueLengthProps =
      props.value && !isEmpty(props.value) ? props.value.length : 0;

    this.state = {
      isFocus: false,
      charRemaining: props.maxLength - valueLengthProps,
      temporalValue: props.value
    };
  }

  get styles() {
    return Object.assign({}, Styles, this.props.styles);
  }

  componentDidUpdate(prevProps) {
    if (!isUndefined(this.props.value) && !isNull(this.props.value)) {
      if (!isEqual(prevProps.value, this.props.value)) {
        this.refs.legalTextArea.value = this.props.value;
      }
    }
  }

  calcCharRemaining = ({ target: { value } }) => {
    this.setState(prevState => {
      return Object.assign({}, prevState, {
        charRemaining: this.props.maxLength - value.length
      });
    });
  };

  onLegalTextAreaFocus = () => {
    this.toggleLegalTextAreaFocus();
    this.props.onFocus();
  };

  onLegalTextAreaBlur = () => {
    this.toggleLegalTextAreaFocus();
    const { temporalValue } = this.state;
    this.props.onBlur(temporalValue);
  };

  onLegalTextAreaChange = ({ target: { value } }) => {
    //this.props.onChange(value);
    this.setState(prevState => {
      return Object.assign({}, prevState, {
        temporalValue: value
      });
    });
  };

  toggleLegalTextAreaFocus = () => {
    this.setState(prevState => {
      return Object.assign({}, prevState, {
        isFocus: !prevState.isFocus
      });
    });
  };

  render() {
    return (
      <div
        //ref={'legalTextArea'}
        className={[
          this.styles.textAreaContainer,
          this.props.readOnly ? this.styles.readonly : null,
          this.props.disabled ? this.styles.disabled : null,
          this.state.isFocus ? this.styles.focus : null,
          this.props.error ? this.styles.error : null
        ].join(' ')}
      >
        <textarea
          ref={'legalTextArea'}
          id={this.props.id}
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
          onFocus={this.onLegalTextAreaFocus}
          onBlur={this.onLegalTextAreaBlur}
          onKeyUp={this.calcCharRemaining}
          onKeyDown={this.calcCharRemaining}
          onChange={this.onLegalTextAreaChange}
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

LegalEntityTextArea.propTypes = {
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
  errorMsg: PropTypes.string,
  id: PropTypes.string
};

LegalEntityTextArea.defaultProps = {
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
  errorMsg: 'Value is required',
  id: ''
};

export default LegalEntityTextArea;
