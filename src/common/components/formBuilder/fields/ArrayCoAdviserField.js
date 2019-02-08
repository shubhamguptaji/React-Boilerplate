// GLOBAL import
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isBoolean from 'lodash/isBoolean';
import isNull from 'lodash/isNull';
import get from 'lodash/get';
import map from 'lodash/map';
import find from 'lodash/find';
import uuid from 'uuid/v1';
// LOCAL import
import { TextBlock, WrappingGrid, IconButton, Button, Dropdown } from '../../';
import CoAdviser from '../../coAdviser/CoAdviser';
import { crossIcon } from '../../../../assets/icons/svgPaths';
import styles from './styles.less';
import { layoutConstants } from '../utils';

export default class ArrayCoAdviserField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data:
        isArray(props.value) && !isEmpty(props.value)
          ? this.prepareCoAdviserValues(props.value)
          : [{}],
      activeFields:
        isArray(props.value) && !isEmpty(props.value)
          ? map(
          props.value,
          (value) => (this.isListValue(value.name) ? 'list' : 'lookup')
          )
          : []
    };
  }

  get count() {
    return this.state.data ? this.state.data.length : 0;
  }

  get canAddAnotherEntity() {
    return this.state.data.every(
      (value) =>
        isObject(value) &&
        !isEmpty(value.domicile) &&
        (!isEmpty(value.list) || !isEmpty(value.lookup))
    );
  }

  static isNameWasSet(data) {
    return !isEmpty(get(data, 'list')) || !isEmpty(get(data, 'lookup'));
  }

  isListValue(value) {
    return find(get(this.props, 'source.items', []), {
      id: get(value, 'id')
    });
  }

  prepareCoAdviserValues(coAdvisers) {
    return map(coAdvisers, (coAdviser) => {
      const inSource = this.isListValue(coAdviser.name);
      return {
        list: inSource ? coAdviser.name : null,
        lookup: !inSource ? coAdviser.name : null,
        domicile: coAdviser.domicile
      };
    });
  }

  riseOnValueChanged() {
    this.props.onChange(
      this.state.data.filter(isObject).map((value, index) => {
        return {
          name: value[this.state.activeFields[index]],
          domicile: value.domicile
        };
      })
    );
  }

  onSelectedChanged = (index, entity, type) => {
    this.setState(
      (prevState) => {
        const cloneData = prevState.data.slice();
        const cloneActiveFields = prevState.activeFields.slice();

        if (isNull(entity)) {
          cloneData[index] = {};
        } else if (cloneData[index]) {
          cloneData[index][type] = entity;
        }

        if (isNull(entity)) {
          cloneActiveFields[index] = null;
        } else if (type !== 'domicile') {
          cloneActiveFields[index] = type;
        }

        return { data: cloneData, activeFields: cloneActiveFields };
      },
      () => this.riseOnValueChanged()
    );
  };

  addAnotherEntity = () => {
    this.setState(
      (prevState) => {
        const cloneData = prevState.data.slice();
        cloneData.push({});

        const cloneActiveFields = prevState.activeFields.slice();
        cloneActiveFields.push(null);

        return { data: cloneData, activeFields: cloneActiveFields };
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

        const cloneActiveFields = prevState.activeFields.slice();
        cloneActiveFields.splice(index, 1);

        if (!cloneData.length) {
          cloneData.push({});
        }

        return { data: cloneData, activeFields: cloneActiveFields };
      },
      () => this.riseOnValueChanged()
    );
  };

  render() {
    const data = this.state.data;

    const rows = data.map((value, index) => {
      const coAdviserRow = [];
      const domicileIsValid = isBoolean(this.props.isValid)
        ? this.props.isValid
        : get(this.props.isValid, `[${index}]`);
      const domicileErrorMsg = isBoolean(this.props.errorMsg)
        ? this.props.errorMsg
        : get(this.props.errorMsg, `[${index}]`);

      coAdviserRow.push(
        <NameRow
          key={uuid()}
          {...this.props}
          isValid={true}
          errorMsg={''}
          index={index}
          value={value}
          selectedData={data}
          disableLookupField={this.state.activeFields[index] === 'list'}
          disableListField={this.state.activeFields[index] === 'lookup'}
          onChange={this.onSelectedChanged}
          onToggle={this.toggleFieldVisibility}
          onRemove={this.removeEntity}
        />
      );

      if (ArrayCoAdviserField.isNameWasSet(value)) {
        coAdviserRow.push(
          <DomicileRow
            key={uuid()}
            {...this.props}
            isValid={domicileIsValid}
            errorMsg={domicileErrorMsg}
            index={index}
            value={value.domicile}
            onChange={this.onSelectedChanged}
          />
        );
      }

      return coAdviserRow;
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
          <CoAdviser
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
    onChange
  } = props;

  const items = [
    {
      content: !index && (
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
      content: <div />,
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
  addButtonName: '+ ADD ANOTHER CO-ADVISER'
};