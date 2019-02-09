// GLOBAL import
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isBoolean from 'lodash/isBoolean';
import isString from 'lodash/isString';
import get from 'lodash/get';
import uuid from 'uuid/v1';
// LOCAL import
import { TextBlock, WrappingGrid, Icon, IconButton, Button } from '../../';
import ClientLegalEntity from '../../clientLegalEntity/ClientLegalEntity';
import { searchIcon, crossIcon } from '../../../../assets/icons/svgPaths';
import styles from './styles.less';
import { layoutConstants } from '../utils';

export default class ArrayClientLegalEntityField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: isArray(props.value) && !isEmpty(props.value) ? props.value : [{}],
      showLookupFields:
        isArray(props.value) && !isEmpty(props.value)
          ? props.value.map((value) => !isEmpty(value.lookup))
          : []
    };
  }

  get count() {
    return this.state.data ? this.state.data.length : 0;
  }

  get canAddAnotherEntity() {
    return this.state.data.every(
      (value) => isObject(value) && (value.list || value.lookup)
    );
  }

  riseOnValueChanged() {
    this.props.onChange(
      this.state.data.filter(isObject).map((value, index) => {
        return {
          list: !this.state.showLookupFields[index] ? value.list : null,
          lookup: this.state.showLookupFields[index] ? value.lookup : null
        };
      })
    );
  }

  toggleFieldVisibility = (index) => {
    this.setState((prevState) => {
      const showFields = this.state.showLookupFields.slice();
      showFields[index] = !this.state.showLookupFields[index];
      return Object.assign({}, prevState, { showLookupFields: showFields });
    });
  };

  onSelectedChanged = (index, entity, type) => {
    this.setState(
      (prevState) => {
        const cloneData = prevState.data.slice();
        if (cloneData[index]) {
          cloneData[index][type] = entity;
        }
        return { data: cloneData };
      },
      () => this.riseOnValueChanged()
    );
  };

  addAnotherEntity = () => {
    this.setState(
      (prevState) => {
        const cloneData = prevState.data.slice();
        cloneData.push({});

        const cloneShowFields = prevState.showLookupFields.slice();
        cloneShowFields.push(false);

        return { data: cloneData, showLookupFields: cloneShowFields };
      },
      () => this.riseOnValueChanged()
    );
  };

  removeEntity = (index, entity) => {
    this.setState(
      (prevState) => {
        if (this.count === 1 && entity === {}) return undefined;

        const cloneData = prevState.data.slice();
        cloneData.splice(index, 1);

        const cloneShowFields = prevState.showLookupFields.slice();
        cloneShowFields.splice(index, 1);

        if (!cloneData.length) {
          cloneData.push(null);
        }

        return { data: cloneData, showLookupFields: cloneShowFields };
      },
      () => this.riseOnValueChanged()
    );
  };

  render() {
    const data = this.state.data;

    const rows = data.map((value, index) => {
      const entityIsValid = isBoolean(this.props.isValid)
        ? this.props.isValid
        : get(this.props.isValid, `[${index}]`);
      const entityErrorMsg = isString(this.props.errorMsg)
        ? this.props.errorMsg
        : get(this.props.errorMsg, `[${index}]`);

      return (
        <FieldRow
          key={uuid()}
          {...this.props}
          isValid={entityIsValid}
          errorMsg={entityErrorMsg}
          index={index}
          value={value}
          selectedData={data}
          showLookupField={this.state.showLookupFields[index]}
          onChange={this.onSelectedChanged}
          onToggle={this.toggleFieldVisibility}
          onRemove={this.removeEntity}
        />
      );
    });

    rows.push(
      <LastRow
        key={uuid()}
        {...this.props}
        canAddAnotherEntity={this.canAddAnotherEntity}
        addAnotherEntity={this.addAnotherEntity}
      />
    );

    return <React.Fragment>{rows}</React.Fragment>;
  }
}

function LastRow(props) {
  const { canAddAnotherEntity, addAnotherEntity } = props;
  const items = [
    {
      content: '',
      customStyle: { margin: 'auto 0', width: '220px' }
    },
    {
      content: (
        <div className={styles.input}>
          <Button
            type='text'
            enabled={canAddAnotherEntity}
            onClick={addAnotherEntity}
          >
            {props.addButtonName}
          </Button>
        </div>
      ),
      width: 350
    },
    {
      content: <div />,
      width: layoutConstants.thirdColumnWidth,
      customStyle: { margin: 'auto 0' }
    }
  ];

  return <WrappingGrid className={styles.fieldContainer} itemSource={items} />;
}

function FieldRow(props) {
  const {
    index,
    title,
    value,
    selectedData,
    isEnabled,
    isReadOnly,
    isValid,
    onChange,
    onToggle,
    onRemove,
    isOptional
  } = props;

  const canRemove = selectedData.length > 1 || isOptional;

  const items = [
    {
      content: !index && (
        <TextBlock className={styles.title} textTrimming='None'>
          {title}
        </TextBlock>
      ),
      width: 220,
      customStyle: { margin: '15px 0' }
    },
    {
      content: (
        <div className={styles.input}>
          <ClientLegalEntity
            {...props}
            selected={value}
            disabled={!isEnabled}
            readOnly={isReadOnly}
            error={!isValid}
            onChange={(x, type) => onChange(index, x, type)}
          />
        </div>
      ),
      width: 350
    },
    {
      content: (
        <div>
          <Button
            className={styles.toggleButton}
            onClick={() => onToggle(index)}
          >
            <Icon
              viewBox={'0 0 25 25'}
              path={searchIcon}
              className={styles.toggleIcon}
            />
          </Button>
          {canRemove && (
            <IconButton
              path={crossIcon}
              className={styles.remove}
              onClick={() => onRemove(index, value)}
            />
          )}
          {isOptional && (
            <TextBlock className={styles.optional} textTrimming='None'>
              optional
            </TextBlock>
          )}
        </div>
      ),
      width: layoutConstants.thirdColumnWidth,
      customStyle: { margin: '10px 0' }
    }
  ];
  return (
    <WrappingGrid
      key={value}
      className={styles.fieldContainer}
      itemSource={items}
    />
  );
}

LastRow.defaultProps = {
  addButtonName: '+ ADD ANOTHER ENTITY'
};