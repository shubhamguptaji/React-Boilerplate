// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as CheckboxSemantic } from 'semantic-ui-react';

// LOCAL imports
import Styles from './Checkbox.less';

export default class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formattedValue: JSON.stringify(this.props.value)
    };
  }

  get styles() {
    return Object.assign({}, Styles, this.props.styles);
  }

  onChange = (e, { checked }) => {
    this.props.onChange(checked);
  };

  render() {
    return (
      <CheckboxSemantic
        label={this.props.label}
        value={this.state.formattedValue}
        name={this.props.name}
        checked={this.props.checked}
        readOnly={this.props.readOnly}
        disabled={this.props.disabled}
        required={this.props.required}
        onChange={this.onChange}
        className={[
          this.styles.checkboxButton,
          this.props.error ? Styles.error : null,
          this.props.disabled ? Styles.disabled : null
        ].join(' ')}
      />
    );
  }
}

Checkbox.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.any,
  name: PropTypes.string,
  checked: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  styles: PropTypes.object
};

Checkbox.defaultProps = {
  onChange: () => {},
  label: null,
  value: undefined,
  name: null,
  checked: false,
  readOnly: false,
  disabled: false,
  required: false,
  error: false,
  styles: {}
};