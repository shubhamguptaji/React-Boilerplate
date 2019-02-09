// GLOBAL import
import React from 'react';
// LOCAL import
import TextArea from '../../textArea/TextArea';
import { TextBlock, WrappingGrid } from '../../';
import styles from './styles.less';
import { layoutConstants } from '../utils';

export default function TextAreaField(props) {
  const { id, title, isOptional, isEnabled, isReadOnly, isValid } = props;

  const items = [
    {
      content: (
        <TextBlock className={styles.title} textTrimming='None'>
          {title}
        </TextBlock>
      )
    },
    {
      content: (
        <div className={styles.input}>
          <TextArea
            {...props}
            name={id}
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
            <TextBlock className={styles.optional} textTrimming='None'>
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