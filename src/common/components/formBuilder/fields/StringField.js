// GLOBAL import
import React from 'react';
// LOCAL import
import { TextBlock, WrappingGrid, Text } from '../../';
import styles from './styles.less';
import { layoutConstants } from '../utils';

export default function StringField(props) {
  const {
    id,
    title,
    isOptional,
    isEnabled,
    isReadOnly,
    errorMsg,
    isValid
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
          <Text
            {...props}
            name={id}
            disabled={!isEnabled}
            readOnly={isReadOnly}
            errorMsg={errorMsg}
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
