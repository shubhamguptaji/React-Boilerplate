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
import {
  TextBlock,
  WrappingGrid,
  Icon,
  IconButton,
  Button,
  Autocomplete,
  Tooltip
} from '../../';
import { crossIcon, infoQuestionIcon } from '../../../../assets/icons/svgPaths';
import styles from './styles.less';
import { layoutConstants } from '../utils';

export default class ArrayClientLegalEntityUCField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: isArray(props.value) && !isEmpty(props.value) ? props.value : [null]
    };
  }

  get count() {
    return this.state.data ? this.state.data.length : 0;
  }

  get canAddAnotherEntity() {
    return this.state.data.every(isObject);
  }

  riseOnValueChanged() {
    this.props.onChange(this.state.data.filter(isObject));
  }

  onSelectedChanged = (index, entity) => {
    this.setState(
      (prevState) => {
        const cloneData = prevState.data.slice();
        cloneData[index] = entity;

        return { data: cloneData };
      },
      () => this.riseOnValueChanged()
    );
  };

  addAnotherEntity = () => {
    this.setState(
      (prevState) => {
        const cloneData = prevState.data.slice();
        cloneData.push(null);

        return { data: cloneData };
      },
      () => this.riseOnValueChanged()
    );
  };

  removeEntity = (index, entity) => {
    this.setState(
      (prevState) => {
        if (this.count === 1 && entity === null) return undefined;

        const cloneData = prevState.data.slice();
        cloneData.splice(index, 1);

        if (!cloneData.length) {
          cloneData.push(null);
        }

        return { data: cloneData };
      },
      () => this.riseOnValueChanged()
    );
  };

  render() {
    const data = this.state.data;
    const rows = [];

    rows.push(<LabelRow key={uuid()} />);

    data.forEach((value, index) => {
      const entityIsValid = isBoolean(this.props.isValid)
        ? this.props.isValid
        : get(this.props.isValid, `[${index}]`);
      const entityErrorMsg = isString(this.props.errorMsg)
        ? this.props.errorMsg
        : get(this.props.errorMsg, `[${index}]`);

      rows.push(
        <FieldRow
          key={uuid()}
          {...this.props}
          isValid={entityIsValid}
          errorMsg={entityErrorMsg}
          index={index}
          value={value}
          selectedData={data}
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

function LabelRow() {
  const tooltipMsg =
    'EMEA Doc Retention Team: Search for Spider client.<br><br>NOTE: If client does not exist please go to Spider and create new client.';

  const items = [
    {
      content: '',
      customStyle: { margin: 'auto 0', width: '220px' }
    },
    {
      content: (
        <div
          className={[styles.input, styles.clientLegalEntityLabel].join(' ')}
        >
          <span
            className={[styles.title, styles.clientLegalEntityTitle].join(' ')}
          >
            EMEA-only : Choose from Spider
          </span>
          <Tooltip message={tooltipMsg}>
            <Icon path={infoQuestionIcon} className={styles.questionIcon} />
          </Tooltip>
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
      content: '',
      customStyle: { margin: 'auto 0', width: '220px' }
    },
    {
      content: (
        <div className={styles.input}>
          <Autocomplete
            {...props}
            selected={value}
            disabled={!isEnabled}
            readOnly={isReadOnly}
            error={!isValid}
            onChange={(x) => onChange(index, x)}
          />
        </div>
      ),
      width: 350
    },
    {
      content: (
        <div>
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