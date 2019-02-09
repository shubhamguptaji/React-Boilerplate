// GLOBAL import
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isNull from 'lodash/isNull';
import get from 'lodash/get';
import uuid from 'uuid/v1';
// LOCAL import
import {
  TextBlock,
  WrappingGrid,
  IconButton,
  Button,
  Dropdown,
  Autocomplete
} from '../../';
import { crossIcon } from '../../../../assets/icons/svgPaths';
import styles from './styles.less';
import { layoutConstants } from '../utils';

export default class ArrayThirdPartyField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: isArray(props.value) && !isEmpty(props.value) ? props.value : [{}]
    };
  }

  get count() {
    return this.state.data ? this.state.data.length : 0;
  }

  get canAddAnotherEntity() {
    return this.state.data.every(
      (value) =>
        isObject(value) && !isEmpty(value.name) && !isEmpty(value.domicile)
    );
  }

  static isNameWasSet(data) {
    return !isEmpty(get(data, 'name'));
  }

  riseOnValueChanged() {
    this.props.onChange(this.state.data.filter((value) => !isEmpty(value)));
  }

  onSelectedChanged = (index, entity, type) => {
    this.setState(
      (prevState) => {
        const cloneData = prevState.data.slice();

        if (isNull(entity)) {
          cloneData[index] = {};
        } else if (cloneData[index]) {
          cloneData[index][type] = entity;

          if (type === 'name') {
            cloneData[index]['domicile'] = {
              label: entity.country,
              value: entity.countryCode
            };
          }
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

        return { data: cloneData };
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

        if (!cloneData.length) {
          cloneData.push({});
        }

        return { data: cloneData };
      },
      () => this.riseOnValueChanged()
    );
  };

  render() {
    const data = this.state.data;

    const rows = data.map((value, index) => {
      const thirdPartyRow = [];

      thirdPartyRow.push(
        <NameRow
          key={uuid()}
          {...this.props}
          index={index}
          value={value.name}
          selectedData={data}
          onChange={this.onSelectedChanged}
          onRemove={this.removeEntity}
        />
      );

      if (ArrayThirdPartyField.isNameWasSet(value)) {
        thirdPartyRow.push(
          <DomicileRow
            key={uuid()}
            {...this.props}
            index={index}
            value={value.domicile}
            onChange={this.onSelectedChanged}
          />
        );
      }

      return thirdPartyRow;
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

function NameRow(props) {
  const {
    index,
    title,
    value,
    placeholder,
    source,
    selectedData,
    isEnabled,
    isReadOnly,
    isValid,
    onChange,
    onRemove,
    isOptional
  } = props;

  const canRemove = selectedData.length > 1 || isOptional;

  const items = [
    {
      content: (
        <TextBlock className={styles.title} textTrimming='None'>
          {title.name}
        </TextBlock>
      ),
      width: 220,
      customStyle: { margin: '15px 0' }
    },
    {
      content: (
        <div className={styles.input}>
          <Autocomplete
            {...props}
            source={source.name}
            placeholder={placeholder.name}
            selected={value}
            disabled={!isEnabled}
            readOnly={isReadOnly}
            error={!isValid}
            onChange={(x) => onChange(index, x, 'name')}
          />
        </div>
      ),
      width: 350
    },
    {
      content: (
        <div className={styles.thirdColumn}>
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
      customStyle: { margin: '5px 0' }
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

function DomicileRow(props) {
  const {
    index,
    title,
    value,
    source,
    placeholder,
    domicileInputComponent,
    domicileElementComponent,
    isEnabled,
    isReadOnly,
    isValid,
    isOptional,
    onChange
  } = props;

  const items = [
    {
      content: (
        <TextBlock className={styles.title} textTrimming='None'>
          {title.domicile}
        </TextBlock>
      ),
      width: 220,
      customStyle: { margin: '15px 0' }
    },
    {
      content: (
        <div className={styles.input}>
          <Dropdown
            {...props}
            source={source.domicile}
            placeholder={placeholder.domicile}
            inputComponent={domicileInputComponent}
            elementComponent={domicileElementComponent}
            selected={value}
            disabled={!isEnabled}
            readOnly={isReadOnly}
            error={!isValid}
            onChange={(x) => onChange(index, x, 'domicile')}
          />
        </div>
      ),
      width: 350
    },
    {
      content: (
        <div className={styles.thirdColumn}>
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
  addButtonName: '+ ADD ANOTHER THIRD PARTY'
};