import React, { Component } from 'react';
import Avatar from '../../common/components/avatar/Avatar';
import UserAvatar from '../../common/components/avatar/UserAvatar';
import Accordion from '../../common/components/accordion/Accordion';
import Badge from '../../common/components/badge/Badge';
import Button from '../../common/components/button/Button';
// import IconButton from '../../common/components/button/IconButton';
// import ProgressButton from '../../common/components/button/ProgressButton';
import Checkbox from '../../common/components/checkbox/Checkbox';
import CheckboxGroup from '../../common/components/checkbox/CheckBoxGroup';
import CircleBadge from '../../common/components/circleBadge/CircleBadge';
// import ClientLegalEntity from '../../common/components/clientLegalEntity/ClientLegalEntity';
import DetailsField from '../../common/components/detailsField/DetailsField';

class Example extends Component {
  render() {
    return (
      <div>
        <Avatar name="Shubham" src="" />
        <Accordion />
        <Badge text="hello" />
        <Button />
        <Checkbox />
        <CheckboxGroup source={['1', '2']} />
        <CircleBadge />
        <DetailsField />
        {/* <ClientLegalEntity /> */}
        {/* <ProgressButton /> */}
        {/* <IconButton /> */}
        <UserAvatar name="Shubham" />
        <h1>Example</h1>
      </div>
    );
  }
}

export default Example;
