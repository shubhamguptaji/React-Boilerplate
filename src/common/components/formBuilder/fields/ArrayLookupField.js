// GLOBAL import
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import indexOf from 'lodash/indexOf';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import uniqWith from 'lodash/uniqWith';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import uuid from 'uuid/v1';
// LOCAL import
import {
  Autocomplete,
  TextBlock,
  WrappingGrid,
  Button,
  IconButton
} from '../../';
import { crossIcon } from '../../../../assets/icons/svgPaths';
import styles from './styles.less';
import { layoutConstants } from '../utils';

export default class ArrayLookupField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataChanged: false,
      data: this.prepareValues(this.props.value)
    };
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.value, this.props.value)) {
      this.setState({
        data: this.prepareValues(this.props.value)
      });
    }
  }

  prepareValues = (values) => {
    let preparedValues = values.slice();

    if (!isArray(preparedValues)) preparedValues = [];

    while (preparedValues.length < this.props.minValueCount) {
      preparedValues.push(null);
    }

    return preparedValues;
  };

  riseOnValueChanged() {
    this.props.onChange(this.state.data.filter((value) => !isNull(value)));
  }

  get count() {
    return this.state.data ? this.state.data.length : 0;
  }

  get canAddAnotherEntity() {
    return (
      indexOf(this.state.data, null) === -1 &&
      (isFunction(this.props.comparator)
        ? uniqWith(this.state.data, this.props.comparator).length === this.count
        : true)
    );
  }

  onSelectedChanged = (index, entity) => {
    this.setState(
      (prev) => {
        const cloneData = cloneDeep(prev.data);
        cloneData[index] = entity;
        return { data: cloneData, dataChanged: true };
      },
      () => this.riseOnValueChanged()
    );
  };

  addAnotherEntity = () => {
    this.setState(
      (prev) => {
        const cloneData = cloneDeep(prev.data);
        cloneData.push(null);
        return { data: cloneData, dataChanged: false };
      },
      () => this.riseOnValueChanged()
    );
  };

  removeEntity = (index, entity) => {
    this.setState(
      (prev) => {
        if (this.count === 1 && entity == null) return undefined;

        const cloneData = cloneDeep(prev.data);
        cloneData.splice(index, 1);

        if (cloneData.length === 0) {
          cloneData.push(null);
        }

        const dataChanged = entity != null;

        return { data: cloneData, dataChanged: dataChanged };
      },
      () => this.riseOnValueChanged()
    );
  };

  render() {
    const data = this.state.data;

    const rows = data.map((value, index) => {
      const valid = this.props.isValid
        ? this.props.isValid
        : this.props.errorMsg === 'Value is required' && !isEmpty(value);

      return (
        <FieldRow
          key={uuid()}
          {...this.props}
          isValid={valid}
          index={index}
          value={value}
          excludeValues={data}
          onChange={this.onSelectedChanged}
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

ArrayLookupField.defaultProps = {
  value: [null],
  onChange: (v) => {},
  isEnabled: true,
  isReadOnly: false,
  isValid: true,
  isOptional: false
};

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
    onChange,
    isEnabled,
    isReadOnly,
    isValid,
    excludeValues,
    minValueCount,
    onRemove,
    isOptional
  } = props;

  const canRemove = excludeValues.length > minValueCount || isOptional;

  const items = [
    {
      content: !index && (
        <TextBlock className={styles.title} textTrimming='None'>
          {title}
        </TextBlock>
      ),
      customStyle: { margin: 'auto 0', width: '220px' }
    },
    {
      content: (
        <div className={styles.input}>
          <Autocomplete
            key={value}
            {...props}
            selected={value}
            disabled={!isEnabled}
            readOnly={isReadOnly}
            error={!isValid}
            onChange={(x) => onChange(index, x)}
          />
        </div>
      )
    },
    {
      content: (
        <div style={{ display: 'flex' }}>
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
      customStyle: { margin: 'auto 0' }
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