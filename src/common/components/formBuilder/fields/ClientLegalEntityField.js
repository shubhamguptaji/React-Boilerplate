// GLOBAL import
import React from 'react';
import isEmpty from 'lodash/isEmpty';
// LOCAL import
import { TextBlock, WrappingGrid, Icon } from '../../';
import styles from './styles.less';
import Button from '../../button/Button';
import ClientLegalEntity from '../../clientLegalEntity/ClientLegalEntity';
import { searchIcon } from '../../../../assets/icons/svgPaths';
import { layoutConstants } from '../utils';

export default class ClientLegalEntityField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLookupField: props.value && !isEmpty(props.value.lookup)
    };
  }

  toggleFieldsVisibility = () => {
    this.setState({
      showLookupField: !this.state.showLookupField
    });
  };

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
            <ClientLegalEntity
              {...this.props}
              showLookupField={this.state.showLookupField}
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
            <Button
              className={styles.toggleButton}
              onClick={this.toggleFieldsVisibility}
            >
              <Icon
                viewBox={'0 0 25 25'}
                path={searchIcon}
                className={styles.toggleIcon}
              />
            </Button>
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
