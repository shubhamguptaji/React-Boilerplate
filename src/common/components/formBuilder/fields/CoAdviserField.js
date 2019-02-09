// GLOBAL import
import React from 'react';
// LOCAL import
import { TextBlock, WrappingGrid } from '../../';
import styles from './styles.less';
import CoAdviser from '../../coAdviser/CoAdviser';
import { layoutConstants } from '../utils';

export default class CoAdviserField extends React.Component {
  saveValue = value => {
    this.props.onChange(value);
  };

  render() {
    const { title, isOptional, isEnabled, isReadOnly, isValid } = this.props;

    const row = [
      {
        content: (
          <TextBlock className={styles.title} textTrimming="None">
            {title}
          </TextBlock>
        ),
        customStyle: { margin: '15px 0' }
      },
      {
        content: (
          <div className={styles.input}>
            <CoAdviser
              {...this.props}
              disabled={!isEnabled}
              readOnly={isReadOnly}
              error={!isValid}
              onChange={this.saveValue}
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
        width: layoutConstants.thirdColumnWidth,
        customStyle: { margin: '10px 0' }
      }
    ];

    return <WrappingGrid className={styles.fieldContainer} itemSource={row} />;
  }
}
