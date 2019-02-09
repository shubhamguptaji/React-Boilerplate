import StringField from './fields/StringField';
import DateField from './fields/DateField';
import EnumRadioField from './fields/EnumRadioField';
import UnknownField from './fields/UnknownField';
import DefaultSectionView from './sections/DefaultSectionView';
import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import isDate from 'lodash/isDate';
import isNull from 'lodash/isNull';
import get from 'lodash/get';

class FormAppearance {
  constructor(uiSchema) {
    this.defaultUiSchema = {
      string: StringField,
      number: StringField,
      static: StringField,
      bool: StringField,
      enum: EnumRadioField,
      date: DateField
    };

    this.uiSchema = Object.assign(this.defaultUiSchema, uiSchema);
  }

  resolveByProperty(path, propOrType) {
    const view = get(this.uiSchema, path, undefined);

    if (!isUndefined(view)) return view;

    return isUndefined(this.uiSchema[propOrType])
      ? UnknownField
      : this.uiSchema[propOrType];
  }

  resolveBySection(section) {
    return DefaultSectionView;
  }
}

export function performPredicate(predicate, arg, undefinedValue = true) {
  if (isUndefined(predicate)) {
    return undefinedValue;
  }

  if (isFunction(predicate)) {
    return predicate(arg);
  }

  if (isBoolean(predicate)) {
    return predicate;
  }

  return undefined;
}

export function performPredicateAndBindContext(
  predicate,
  undefinedValue = true
) {
  if (isUndefined(predicate)) {
    return undefinedValue;
  }

  if (isFunction(predicate)) {
    return predicate(this);
  }

  if (isBoolean(predicate)) {
    return predicate;
  }

  return undefined;
}

export function required(self) {
  return (
    isBoolean(self.value) ||
    isDate(self.value) ||
    (isEmpty(self.value) ||
    (isArray(self.value) ? self.value.every(isNull) : false)
      ? 'Value is required'
      : '')
  );
}

export function between(min, max, propertyName = undefined) {
  const betweenMsg = `Should be between ${min} and ${max} characters`;
  return propertyName ? `Invalid ${propertyName}. ${betweenMsg}` : betweenMsg;
}

export const layoutConstants = {
  thirdColumnWidth: 120
};

export default FormAppearance;
