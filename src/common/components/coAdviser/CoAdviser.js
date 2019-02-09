// GLOBAL import
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
// LOCAL import
import { Autocomplete, Dropdown } from '..';
import Styles from './CoAdviser.less';

export default class CoAdviser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listValue: props.value && props.value.list ? props.value.list : null,
      lookupValue:
        props.value && props.value.lookup ? props.value.lookup : null,
      disableLookupField: props.disableLookupField,
      disableListField: props.disableListField
    };
  }

  saveListValue = (listValue) => {
    const isValue = !isEmpty(listValue);

    this.setState(
      {
        listValue,
        lookupValue: '',
        disableLookupField: isValue,
        disableListField: !isValue
      },
      () => {
        this.props.onChange(this.state.listValue, 'list');
      }
    );
  };

  saveLookupValue = (lookupValue) => {
    const isValue = !isEmpty(lookupValue);

    this.setState(
      {
        lookupValue,
        listValue: '',
        disableListField: isValue,
        disableLookupField: !isValue
      },
      () => {
        this.props.onChange(this.state.lookupValue, 'lookup');
      }
    );
  };

  render() {
    const {
      id,
      placeholder,
      source,
      isEnabled,
      isReadOnly,
      isValid
    } = this.props;

    return (
      <React.Fragment>
        <div className={Styles.listInput}>
          <Dropdown
            {...this.props}
            name={id}
            selected={this.state.listValue}
            placeholder={placeholder ? placeholder.list : null}
            source={source.items}
            disabled={!isEnabled || this.state.disableListField}
            readOnly={isReadOnly}
            error={!isValid}
            onChange={this.saveListValue}
          />
        </div>
        <div className={Styles.lookupInput}>
          <Autocomplete
            {...this.props}
            name={id}
            selected={this.state.lookupValue}
            placeholder={placeholder ? placeholder.lookup : null}
            source={source.provider}
            disabled={!isEnabled || this.state.disableLookupField}
            readOnly={isReadOnly}
            error={!isValid}
            onChange={this.saveLookupValue}
          />
        </div>
      </React.Fragment>
    );
  }
}

CoAdviser.fieldsShape = {
  list: PropTypes.any,
  lookup: PropTypes.any
};

CoAdviser.propTypes = {
  value: PropTypes.shape(CoAdviser.fieldsShape),
  placeholder: PropTypes.shape(CoAdviser.fieldsShape),
  source: PropTypes.shape(CoAdviser.fieldsShape),
  id: PropTypes.string,
  disableListField: PropTypes.bool,
  disableLookupField: PropTypes.bool,
  isEnabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isValid: PropTypes.bool,
  onChange: PropTypes.func
};

CoAdviser.defaultProps = {
  value: null,
  disableListField: false,
  disableLookupField: false,
  isEnabled: true,
  isReadOnly: false,
  isValid: true,
  onChange: () => {}
};