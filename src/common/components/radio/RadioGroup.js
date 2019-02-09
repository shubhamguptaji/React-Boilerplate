// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
// LOCAL imports
import Radio from './Radio';

export default class RadioGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: get(this.props, 'value', '')
    };
  }

  onSelected = value => {
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    return (
      <React.Fragment>
        {this.props.source &&
          this.props.source.map(option => {
            const optionLabel =
              option.label !== undefined && option.label !== null
                ? option.label
                : option;
            const optionValue =
              option.value !== undefined && option.value !== null
                ? option.value
                : option;

            return (
              <Radio
                {...this.props}
                key={optionValue}
                label={optionLabel}
                value={optionValue}
                checked={isEqual(optionValue, this.state.value)}
                onChange={this.onSelected}
              />
            );
          })}
      </React.Fragment>
    );
  }
}

RadioGroup.propTypes = {
  onChange: PropTypes.func,
  source: PropTypes.arrayOf(PropTypes.any).isRequired,
  value: PropTypes.any,
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  vertical: PropTypes.bool,
  error: PropTypes.bool
};

RadioGroup.defaultProps = {
  onChange: () => {},
  name: null,
  readOnly: false,
  disabled: false,
  required: false,
  vertical: false,
  error: false
};
