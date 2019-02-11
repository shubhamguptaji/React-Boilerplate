import React from 'react';
import { shallow, mount } from 'enzyme';
import FileIcon from './FileIcon';

describe('FileIcon', () => {
  test('renders without crashing', () => {
    shallow(<FileIcon />);
  });

  test('renders image for docx', () => {
    mount(<FileIcon name={'test.docx'} />);
  });
});
