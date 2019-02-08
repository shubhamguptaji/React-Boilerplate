// GLOBAL import
import React from 'react';
import PropTypes from 'prop-types';
// LOCAL import
import { Autocomplete, Dropdown } from '..';
import Styles from './ClientLegalEntity.less';

export default class ClientLegalEntity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listValue: props.value && props.value.list ? props.value.list : null,
      lookupValue:
        props.value && props.value.lookup ? props.value.lookup : null,
      showLookupField: props.showLookupField
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.showLookupField !== state.showLookupField) {
      if (nextProps.showLookupField) {
        nextProps.onChange(state.lookupValue, 'lookup');
      } else {
        nextProps.onChange(state.listValue, 'list');
      }

      return { showLookupField: nextProps.showLookupField };
    }

    return null;
  }

  saveListValue = (listValue) => {
    this.setState({ listValue }, () => {
      this.props.onChange(this.state.listValue, 'list');
    });
  };

  saveLookupValue = (lookupValue) => {
    this.setState({ lookupValue }, () => {
      this.props.onChange(this.state.lookupValue, 'lookup');
    });
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
            selected={!this.state.showLookupField ? this.state.listValue : ' '}
            placeholder={placeholder ? placeholder.list : null}
            source={source.items}
            disabled={!isEnabled || this.state.showLookupField}
            readOnly={isReadOnly}
            error={!isValid}
            onChange={this.saveListValue}
          />
        </div>
        {this.state.showLookupField && (
          <div className={Styles.lookupInput}>
            <Autocomplete
              {...this.props}
              name={id}
              selected={
                this.state.showLookupField ? this.state.lookupValue : ' '
              }
              placeholder={placeholder ? placeholder.lookup : null}
              source={source.provider}
              disabled={!isEnabled}
              readOnly={isReadOnly}
              error={!isValid}
              onChange={this.saveLookupValue}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

ClientLegalEntity.fieldsShape = {
  list: PropTypes.any,
  lookup: PropTypes.any
};

ClientLegalEntity.propTypes = {
  value: PropTypes.shape(ClientLegalEntity.fieldsShape),
  placeholder: PropTypes.shape(ClientLegalEntity.fieldsShape),
  source: PropTypes.shape(ClientLegalEntity.fieldsShape),
  id: PropTypes.string,
  showLookupField: PropTypes.bool,
  isEnabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isValid: PropTypes.bool,
  onChange: PropTypes.func
};

ClientLegalEntity.defaultProps = {
  showLookupField: false,
  value: null,
  isEnabled: true,
  isReadOnly: false,
  isValid: true,
  onChange: () => {}
};


