import React from 'react';
import { TextBlock, WrappingGrid } from '../../';
import styles from './styles.less';

export default class StringField extends React.Component {
  render() {
    const { title } = this.props;
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
        content: <TextBlock className={styles.input}>UNKNOWN FIELD</TextBlock>
      }
    ];
    return (
      <WrappingGrid className={styles.fieldContainer} itemSource={items} />
    );
  }
}
