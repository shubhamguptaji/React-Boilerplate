import React from 'react';
import ReactDOM from 'react-dom';
import get from 'lodash/get';
import map from 'lodash/map';
import isFunction from 'lodash/isFunction';
import isBoolean from 'lodash/isBoolean';
import isArray from 'lodash/isArray';
import { performPredicateAndBindContext, required } from './utils';
import PropTypes from 'prop-types';

class FormProperty extends React.Component {
  constructor(props) {
    super(props);
    this.formData = this.props.formData;
    this.form = this.props.form;

    this.state = {
      isOptional: this.isOptional,
      isVisible: this.isVisible,
      isEnabled: this.isEnabled,
      isValid: this.isValid,
      errorMsg: this.errorMessage,
      isReadOnly: this.isReadOnly
    };

    this.props.onStateChanged(this.props.sectionId, this.props.id, this);
  }

  get isReadOnly() {
    return performPredicateAndBindContext.bind(this)(
      this.props.readOnly,
      false
    );
  }

  get isOptional() {
    return performPredicateAndBindContext.bind(this)(
      this.props.optional,
      false
    );
  }

  get isRequired() {
    return !this.isOptional;
  }

  get isVisible() {
    return performPredicateAndBindContext.bind(this)(this.props.visible);
  }

  get isEnabled() {
    return performPredicateAndBindContext.bind(this)(this.props.enabled);
  }

  get isValid() {
    if (!this.validationEnabled) {
      return true;
    }

    if (this.isRequired) {
      const result = performPredicateAndBindContext.bind(this)(required);
      const valid = isBoolean(result) ? result : !result;
      if (!valid) {
        return valid;
      }
    }

    const result = performPredicateAndBindContext.bind(this)(this.props.valid);
    return isBoolean(result)
      ? result
      : isArray(result)
        ? map(result, value => !value)
        : !result;
  }

  get errorMessage() {
    if (!this.validationEnabled) {
      return undefined;
    }

    if (this.isRequired) {
      const result = performPredicateAndBindContext.bind(this)(required);
      const errMsg = isBoolean(result) ? undefined : result.toString();
      if (errMsg) {
        return errMsg;
      }
    }

    const result = performPredicateAndBindContext.bind(this)(this.props.valid);
    return isBoolean(result)
      ? undefined
      : isArray(result)
        ? result
        : result.toString();
  }

  get propertyPath() {
    return `${this.props.sectionId}.${this.props.id}`;
  }

  get value() {
    return get(this.formData, this.propertyPath);
  }

  get bounds() {
    const compNode = ReactDOM.findDOMNode(this);
    return compNode ? compNode.getBoundingClientRect() : null;
  }

  get validationEnabled() {
    return this.props.settings.liveValidation;
  }

  prepareFieldProps = () => {
    const clone = Object.assign({}, this.props);
    delete clone.readOnly;
    delete clone.visible;
    delete clone.enabled;
    delete clone.valid;
    delete clone.optional;
    return Object.assign(clone, {
      isOptional: this.isOptional,
      isEnabled: this.state.isEnabled,
      isValid: this.state.isValid,
      errorMsg: this.state.errorMsg,
      isReadOnly: this.state.isReadOnly,
      value: this.value,
      onChange: this.onChangeHandler
    });
  };

  onChangeHandler = value => {
    this.props.onChange(this.props.id, value);
  };

  invalidateState = () =>
    new Promise(resolve => {
      this.setState(
        prevState => {
          if (this.hasUnchanged(prevState)) {
            return undefined;
          }
          return Object.assign({}, prevState, {
            isOptional: this.isOptional,
            isVisible: this.isVisible,
            isEnabled: this.isEnabled,
            isReadOnly: this.isReadOnly,
            isValid: this.isValid,
            errorMsg: this.errorMessage
          });
        },
        () => resolve()
      );
    });

  setValueByDependencies = () =>
    new Promise(resolve => {
      const dependsValue = performPredicateAndBindContext.bind(this)(
        this.props.dependsValue
      );
      this.onChangeHandler(dependsValue);
      this.forceUpdate();
      resolve();
    });

  hasUnchanged = prevState =>
    prevState.isOptional === this.isOptional &&
    prevState.isVisible === this.isVisible &&
    prevState.isEnabled === this.isEnabled &&
    prevState.isValid === this.isValid &&
    prevState.errorMsg === this.errorMessage &&
    prevState.isReadOnly === this.isReadOnly;

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isValid !== this.state.isValid) {
      isFunction(this.props.onValidChange) &&
        this.props.onValidChange(
          this.props.id,
          this.props.sectionId,
          this.errorMessage
        );
    }
  }

  render() {
    if (!this.state.isVisible) {
      return null;
    }

    const fieldProperties = this.prepareFieldProps();
    const Field = this.props.appearance.resolveByProperty(
      this.propertyPath,
      this.props.type
    );

    return <Field {...fieldProperties} />;
  }
}

FormProperty.defaultProps = {
  onChange: () => {},
  onValidChange: () => {},
  title: undefined,
  visible: true,
  enabled: true,
  valid: true,
  readOnly: false,
  formData: {}
};

FormProperty.propTypes = {
  onValidChange: PropTypes.func,
  id: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOf([
    'string',
    'number',
    'enum',
    'array',
    'static',
    'object',
    'bool',
    'date',
    'unknown'
  ]),
  readOnly: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  visible: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  enabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  valid: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  formData: PropTypes.object,
  onChange: PropTypes.func
};

export default FormProperty;
