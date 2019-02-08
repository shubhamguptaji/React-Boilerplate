// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
// LOCAL imports
import Checkbox from './Checkbox';
import {
  addUniqueArrayValue,
  removeUniqueArrayValue
} from '../../utils/arrayUtils';

export default class CheckboxGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value ? props.value : []
    };
  }

  onSelected = (value, state) => {
    this.setState((prevState) => {
      const newValue = state
        ? addUniqueArrayValue(prevState.value, value)
        : removeUniqueArrayValue(prevState.value, value);

      this.props.onChange(newValue);
      return Object.assign({}, prevState, { value: newValue });
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.props.source &&
        this.props.source.map((option) => {
          const optionLabel =
            option.label !== undefined && option.label !== null
              ? option.label
              : option;
          const optionValue =
            option.value !== undefined && option.value !== null
              ? option.value
              : option;

          return (
            <Checkbox
              {...this.props}
              key={optionValue}
              label={optionLabel}
              value={optionValue}
              checked={this.state.value.includes(optionValue)}
              onChange={(state) => this.onSelected(optionValue, state)}
            />
          );
        })}
      </React.Fragment>
    );
  }
}

CheckboxGroup.propTypes = {
  onChange: PropTypes.func,
  source: PropTypes.arrayOf(PropTypes.any).isRequired,
  value: PropTypes.arrayOf(PropTypes.any),
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool
};

CheckboxGroup.defaultProps = {
  onChange: () => {},
  name: null,
  readOnly: false,
  disabled: false,
  required: false,
  error: false
};