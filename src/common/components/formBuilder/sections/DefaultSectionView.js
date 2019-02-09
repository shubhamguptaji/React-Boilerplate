import React from 'react';
import styles from './DefaultSectionView.less';
import { Line, TextBlock } from '../../';

class DefaultSectionView extends React.Component {
  render() {
    const { index, title, isVisible, formProperties } = this.props;

    if (!isVisible) return null;
    else
      return (
        <div>
          {index > 0 && <Line />}
          <div className={styles.container}>
            <TextBlock className={styles.header}>{title}</TextBlock>
            {formProperties.map((item, index) => {
              return item;
            })}
            {/* {formProperties} */}
          </div>
        </div>
      );
  }
}

export default DefaultSectionView;
