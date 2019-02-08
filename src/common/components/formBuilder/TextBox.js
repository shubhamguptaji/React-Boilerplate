import React from 'react';
import PropTypes from 'prop-types';

export default class TextBox extends React.Component {
  render() {
    const onChange = this.props.onChange;
    const value = this.props.value;

    return (
      <input defaultValue={value} onChange={(e) => onChange(e.target.value)} />
    );
  }
}

TextBox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func
};

TextBox.defaultProps = {
  onChange: () => {}
};