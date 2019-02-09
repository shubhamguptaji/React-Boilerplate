//GLOBAL import
import isBoolean from 'lodash/isBoolean';
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import omit from 'lodash/omit';
import uuid from 'uuid/v1';
//LOCAL import
import { TextBlock, WrappingGrid } from '../../index';
import { layoutConstants } from '../utils';
import EnumRadioField from './EnumRadioField';
import styles from './styles.less';

export default class ArrayClientLegalEntityClassificationField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: isObject(props.value) && !isEmpty(props.value) ? props.value : {},
      le:
        isObject(props.value) && !isEmpty(get(props.value, 'le'))
          ? get(props.value, 'le')
          : [],
      uc:
        isObject(props.value) && !isEmpty(get(props.value, 'uc'))
          ? get(props.value, 'uc')
          : []
    };
  }

  static getDerivedStateFromProps(props, state) {
    const prevLe = state.le;
    const prevUc = state.uc;
    const le = map(
      props.formData.signorAndInvolvedEntityDetails.clientLegalEntity,
      value => {
        return value.list ? value.list : value.lookup;
      }
    );
    const uc =
      props.formData.signorAndInvolvedEntityDetails.clientLegalEntityOther;
    if (!isEqual(prevLe, le) || !isEqual(prevUc, uc)) {
      const data = { le, uc };
      return { data, le, uc };
    }
    return null;
  }

  render() {
    const data = this.state.data;
    const uc = this.state.uc;
    const title = this.props.title;
    const rows = [];

    rows.push(<LabelRow key={uuid()} title={title} />);
    if (get(data, 'le')) {
      data.le.concat(uc).forEach((value, index) => {
        const entityIsValid = isBoolean(this.props.isValid)
          ? this.props.isValid
          : get(this.props.isValid, `[${index}]`);
        const alternativeProps = omit(this.props, ['title']);

        if (!isEmpty(value)) {
          if (!!value.id && !isEqual(value.id, '-1')) {
            rows.push(
              <FieldRow
                key={uuid()}
                {...alternativeProps}
                isValid={entityIsValid}
                index={index}
                value={value}
                onChange={this.onSelectedChanged}
              />
            );
          }
        }
      });
    }
    return <React.Fragment>{rows}</React.Fragment>;
  }
}

function LabelRow(props) {
  const items = [
    {
      content: (
        <TextBlock className={styles.expandedTitle} textTrimming="None">
          {props.title}
        </TextBlock>
      ),
      width: 570,
      customStyle: { margin: 'auto 0', width: '570px' }
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
  const { value, isEnabled, isReadOnly, isValid } = props;

  const items = [
    {
      content: (
        <TextBlock className={styles.title} textTrimming="None">
          {value && !!value.name ? value.name : ''}
        </TextBlock>
      ),
      width: 220,
      customStyle: { margin: 'auto 0', width: '220px' }
    },
    {
      content: (
        <div className={styles.input}>
          <EnumRadioField
            {...props}
            id={value.id}
            isValid={isValid}
            isReadOnly={isReadOnly}
            isEnabled={isEnabled}
            value={value.id}
          />
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
  return (
    <WrappingGrid
      key={value}
      className={styles.fieldContainer}
      itemSource={items}
    />
  );
}
