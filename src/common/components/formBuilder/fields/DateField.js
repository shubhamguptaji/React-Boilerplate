// GLOBAL import
import React from 'react';
// LOCAL import
import DatePicker from '../../datePicker/DatePicker';
import { TextBlock, WrappingGrid } from '../../';
import styles from './styles.less';
import { layoutConstants } from '../utils';

export default function DateField(props) {
  const {
    id,
    title,
    isOptional,
    isEnabled,
    isReadOnly,
    isValid,
    onChange
  } = props;

  const items = [
    {
      content: (
        <TextBlock className={styles.title} textTrimming="None">
          {title}
        </TextBlock>
      ),
      customStyle: { margin: 'auto 0' }
    },
    {
      content: (
        <div className={styles.input}>
          <DatePicker
            displayFormat="DD MMM YYYY"
            {...props}
            name={id}
            time={false}
            onChange={onChange}
            disabled={!isEnabled}
            readOnly={isReadOnly}
            error={!isValid}
          />
        </div>
      ),
      width: 350
    },
    {
      content: (
        <div>
          {isOptional && (
            <TextBlock className={styles.optional} textTrimming="None">
              optional
            </TextBlock>
          )}
        </div>
      ),
      customStyle: { margin: 'auto 0' },
      width: layoutConstants.thirdColumnWidth
    }
  ];

  return <WrappingGrid className={styles.fieldContainer} itemSource={items} />;
}
