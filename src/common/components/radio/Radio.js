// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import { Radio as RadioSemantic } from 'semantic-ui-react';

// LOCAL imports
import Styles from './Radio.less';

export default class Radio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formattedValue: JSON.stringify(this.props.value)
    };
  }

  get styles() {
    return Object.assign({}, Styles, this.props.styles);
  }

  onSelected = () => {
    this.props.onChange(this.props.value);
  };

  render() {
    return (
      <RadioSemantic
        label={this.props.label}
        value={this.state.formattedValue}
        name={this.props.name}
        checked={this.props.checked}
        readOnly={this.props.readOnly}
        disabled={this.props.disabled}
        required={this.props.required}
        onChange={this.onSelected}
        className={[
          this.styles.radioButton,
          this.props.vertical ? this.styles.vertical : null,
          this.props.readOnly ? this.styles.readonly : null,
          this.props.disabled ? this.styles.disabled : null,
          this.props.error ? this.styles.error : null
        ].join(' ')}
      />
    );
  }
}

Radio.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.any,
  name: PropTypes.string,
  checked: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  vertical: PropTypes.bool,
  error: PropTypes.bool,
  styles: PropTypes.object
};

Radio.defaultProps = {
  onChange: () => {},
  label: null,
  value: undefined,
  name: null,
  checked: false,
  readOnly: false,
  disabled: false,
  required: false,
  vertical: false,
  error: false,
  styles: {}
};
