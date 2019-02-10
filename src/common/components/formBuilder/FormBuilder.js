// GLOBAL imports
import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import set from 'lodash/set';
import get from 'lodash/get';
import find from 'lodash/find';
import unset from 'lodash/unset';
import isEmpty from 'lodash/isEmpty';
// LOCAL imports
import FormAppearance from './utils';
import FormSection from './FormSection';

class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.formAppearance = new FormAppearance(props.uiSchema);
    this.formDependencies = this.constructDependencies();
    this.formData = Object.assign({}, this.props.formData);
    this.form = this.mapFormData();
    this.errorMap = {};
    this.sectionRefs = [];
    this.settings = { liveValidation: this.props.liveValidation };
  }

  constructDependencies() {
    const dependencies = {};

    for (const sectionKey in this.props.schema.sections) {
      for (const propertyKey in this.props.schema.sections[sectionKey]
        .properties) {
        const property = this.props.schema.sections[sectionKey].properties[
          propertyKey
        ];
        if (
          !property.hasOwnProperty('dependsOn') ||
          !isArray(property.dependsOn)
        ) {
          continue;
        }

        property.dependsOn.forEach(dependOn => {
          if (!dependencies.hasOwnProperty(dependOn)) {
            dependencies[dependOn] = [];
          }

          dependencies[dependOn].push(`${sectionKey}.${propertyKey}`);
        });
      }
    }

    return dependencies;
  }

  mapFormData() {
    const mappedFormData = {};
    for (const section in this.props.formData) {
      for (const property in this.props.formData[section]) {
        const propertyPath = `${section}.${property}`;
        set(mappedFormData, propertyPath, {
          value: get(this.props.formData, propertyPath)
        });
      }
    }

    return mappedFormData;
  }

  componentDidUpdate() {
    Object.assign(this.formData, this.props.formData);
    Object.assign(this.form, this.props.form);
  }

  componentWillUnmount() {
    this.formData = null;
    this.sectionRefs = null;
  }

  createSection = ([sectionKey, sectionInfo], index) => {
    const sectionId = sectionKey;
    const onChange = sectionInfo.onChange;

    return (
      <FormSection
        index={index}
        onValidChange={this.onValidChangeHandler}
        settings={this.settings}
        {...sectionInfo}
        onChange={this.onChangeProxy(onChange)}
        formData={this.formData}
        form={this.form}
        appearance={this.formAppearance}
        dependencies={this.formDependencies}
        ref={section => {
          if (section) {
            this.sectionRefs.push(section);
          }
        }}
        id={sectionId}
        key={sectionId}
        onStateChanged={this.onStateChangedHandler}
      />
    );
  };

  onValidChangeHandler = (property, section, error) => {
    const hasError = isArray(error)
      ? error.some(item => !isEmpty(item))
      : error;
    if (hasError) {
      set(this.errorMap, `${section}.${property}`, error);
    } else {
      unset(this.errorMap, `${section}.${property}`);

      if (isEmpty(get(this.errorMap, section))) {
        unset(this.errorMap, section);
      }
    }

    this.props.onError(this.errorMap);
  };

  onChangeProxy = onChange => (section, property, value) => {
    isFunction(onChange) && onChange(section, property, value);
    this.onSectionChangeHandler(section, property, value);
  };

  onStateChangedHandler = (section, property, state) => {
    if (property) {
      const propState = {
        get isOptional() {
          return state.isOptional;
        },
        get isVisible() {
          return state.isVisible;
        },
        get isEnabled() {
          return state.isEnabled;
        },
        get isValid() {
          return state.isValid;
        },
        get errorMessage() {
          return state.errorMessage;
        },
        get isReadOnly() {
          return state.isReadOnly;
        },
        get value() {
          return state.value;
        },
        get bounds() {
          return state.bounds;
        }
      };
      set(this.form, `${section}.${property}`, propState);
    } else {
      const sectionState = {
        get isVisible() {
          return state.isVisible;
        },
        get isEnabled() {
          return state.isEnabled;
        }
      };
      set(this.form, `${section}`, sectionState);
    }
  };

  onSectionChangeHandler = (section, property, value) => {
    const changedPropertyPath = `${section}.${property}`;
    set(this.formData, changedPropertyPath, value);
    set(this.form, changedPropertyPath, { value: value });

    if (this.formDependencies.hasOwnProperty(changedPropertyPath)) {
      this.formDependencies[changedPropertyPath].forEach(dependency => {
        const dependencySection = get(dependency.split('.'), '[0]');
        const sectionRef = find(
          this.sectionRefs,
          sectionRef => dependencySection === sectionRef.props.id
        );

        if (sectionRef) {
          sectionRef.setPropertyValueByDependencies(dependency);
        }
      });
    }

    this.sectionRefs.forEach(section => {
      section.invalidateState();
    });

    this.props.onChange(section, property, this.formData);
  };

  submit = (withValidation = true) => {
    set(
      this.settings,
      'liveValidation',
      withValidation
        ? (this.settings.liveValidation = true)
        : (this.settings.liveValidation = false)
    );

    const promises = [];

    this.sectionRefs.forEach(s => promises.push(s.invalidateState()));

    Promise.all(promises).then(() => {
      this.props.onSubmit(this.formData);
    });
  };

  render() {
    this.sectionRefs = [];
    const sections = Object.entries(this.props.schema.sections);
    return sections.map(this.createSection);
  }
}

FormBuilder.defaultProps = {
  formData: {},
  liveValidation: false,
  schema: {},
  uiSchema: {},
  onChange: () => {},
  onSubmit: () => {},
  onError: () => {}
};

FormBuilder.propTypes = {
  formData: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onError: PropTypes.func
};

export default FormBuilder;
