// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import find from 'lodash/find';
import get from 'lodash/get';
// LOCAL imports
import FormProperty from './FormProperty';
import { performPredicateAndBindContext } from './utils';

class FormSection extends React.Component {
  constructor(props) {
    super(props);
    this.formData = this.props.formData;
    this.form = this.props.form;
    this.propertyRefs = [];

    this.state = {
      isVisible: this.isVisible,
      isEnabled: this.isEnabled
    };

    this.props.onStateChanged(this.props.id, null, this);
  }

  get isVisible() {
    return performPredicateAndBindContext.bind(this)(this.props.visible);
  }

  get isEnabled() {
    return performPredicateAndBindContext.bind(this)(this.props.enabled);
  }

  componentWillUnmount() {
    this.formData = null;
    this.propertyRefs = null;
  }

  isSectionUnchanged = prevState =>
    prevState.isVisible === this.isVisible &&
    prevState.isEnabled === this.isEnabled;

  invalidateState = () =>
    new Promise(resolve => {
      const promises = [];
      this.setState(
        prevState => {
          if (this.isSectionUnchanged(prevState)) {
            this.propertyRefs.forEach(property => {
              promises.push(property.invalidateState());
            });

            return undefined;
          }

          return Object.assign({}, prevState, {
            isVisible: this.isVisible,
            isEnabled: this.isEnabled
          });
        },
        () => Promise.all(promises).then(() => resolve())
      );
    });

  setPropertyValueByDependencies = propertyPath =>
    new Promise(resolve => {
      const property = get(propertyPath.split('.'), '[1]');
      const propertyRef = find(
        this.propertyRefs,
        propertyRef => property === propertyRef.props.id
      );

      if (propertyRef) {
        propertyRef.setValueByDependencies();
      }

      resolve();
    });

  onChangeProxy = onChange => (property, value) => {
    isFunction(onChange) && onChange(property, value);
    this.onPropertyChangeHandler(property, value);
  };

  onPropertyChangeHandler = (property, value) => {
    this.props.onChange(this.props.id, property, value);
  };

  render() {
    this.propertyRefs = [];
    const sectionId = this.props.id;
    const { title, properties, appearance, index, onStateChanged } = this.props;

    const formProperties = Object.entries(properties).map(
      ([propertyId, propertyInfo]) => {
        const propertyKey = `${sectionId}.${propertyId}`;
        const onChange = propertyInfo.onChange;

        return (
          <FormProperty
            onValidChange={this.props.onValidChange}
            settings={this.props.settings}
            {...propertyInfo}
            id={propertyId}
            key={propertyKey}
            sectionId={sectionId}
            onChange={this.onChangeProxy(onChange)}
            formData={this.formData}
            form={this.form}
            appearance={appearance}
            ref={x => {
              if (x) {
                this.propertyRefs.push(x);
              }
            }}
            onStateChanged={onStateChanged}
          />
        );
      }
    );

    const SectionView = appearance.resolveBySection(sectionId);

    return (
      <SectionView
        index={index}
        title={title}
        isVisible={this.state.isVisible}
        isEnabled={this.state.isEnabled}
        formProperties={formProperties}
      />
    );
  }
}

FormSection.defaultProps = {
  title: 'undefined',
  visible: true,
  enabled: true,
  properties: [],
  formData: {},
  onChange: () => {},
  hideIfEmpty: true
};

FormSection.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  title: PropTypes.string,
  visible: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  enabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  properties: PropTypes.object,
  formData: PropTypes.object,
  hideIfEmpty: PropTypes.bool
};

export default FormSection;
