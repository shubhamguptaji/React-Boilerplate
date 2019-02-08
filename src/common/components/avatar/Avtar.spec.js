import React from 'react';
import { shallow, mount } from 'enzyme';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders without crashing', () => {
    shallow(<Avatar />);
  });
  it('renders correct height width', () => {
    const wrapper = mount(
      <Avatar
        name={'Firstname Lastname'}
        src={
          'data:image/jpeg;base64,R0lGODlhlgDCALMAAP///+rv8/r7/LfG1PX3+dbe5tvj6uDn7dHa4+Xr8LzK18fS3fDz9szW4MHO2rLC0SH5BAAAAAAALAAAAACWAMIAAAT/8MlJq7046827/2AojmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter/gsHhMLpvP6LR6zW673/C4fE6v2+/4vH7P7/v/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+gggCjpAAEDRIAAZmjAa4BDKOoqiEFB4ajFQ0ADA+0IAEAuMIVub8fwcMVAwACvgEGAgIJAxMDCdLUDwqltwMGBKYG1Xu51gcACb7NCbG3DwPSBQXSAwMF4QULD8EHCOirypUiJUDBOoMPCDh7YADAvgcLABiQkOxBAQAFJlzMqKfVK2jk/45VVEhBAAGKxIKRg3cMj7kLIomZohAOpYSaFGZ2JAYzID9iJCeYtPlzJTOfLnlaiCkB3cOIE39K2KgRo8AMTOHJoyeAXDAD+/r9a5kUq8+K8LBNW4lAGgJ44MStDEW3rt27ePPq3ct3ky27aEMFbgQt2lprarVxI/Wu0ahp7iTEEzCv3r18Dx0DQBi04VOJRB9lDSphqFRIWXXeTKnU8VmgC0ufPC36dVOHEqCGdpR1cuWuKMHWnoD2Wja2bvsqX868ufPn0KkMJt6aw/RA12l7yP4nO3cM3/t4r74hfJgBB8IRGEfRgGFtuWMROODVYSwB9ImiV89egoIA0hhg3v8XA4RjwFgEVPNYOwC8ww0DCDSkzk+qFBBMglIVKBGC1SggzQHRvITGRW9NZdUonC10kQMSxBLcBA1llAyJVWWEDioPOCDiGcEg4KOPtGQl2QII4KSSNbQk0+OPCNBC2gMuqhHOQDP1FowpArBWzEnJTDnQSappxyMAcymgoG0/FVBNRUdKlqQwbfpXzZNRpkGjBDrektpsD2SJEkcMWTUjACXm2OADN+K545j+cGVQVl8hAGA6A1yZgIWmrMlao9IY5CF+IZJXxjfqHYBQbwk0Y8B/DHwTQAOl1idZXPMhlCOAAriHVHS89urrr8AGK+ywxBZr7LHIJqvsssw26+wts9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwZhABADs='
        }
      />
    );
    expect(wrapper.find('div.UserAvatar--inner').prop('style')).toHaveProperty(
      'width',
      '40px'
    );
    expect(wrapper.find('div.UserAvatar--inner').prop('style')).toHaveProperty(
      'height',
      '40px'
    );
  });

  it('renders initials when image is missing', () => {
    const wrapper = mount(<Avatar name={'Firstname Lastname'} />);
    expect(wrapper.find('div.UserAvatar--inner').text()).toEqual('SG');
  });
  it('renders initials when user image is not enabled on intranet', () => {
    const wrapper = mount(
      <Avatar
        name={'Firstname Lastname'}
        src={
          'data:image/jpeg;base64,R0lGODlhlgDCALMAAP///+rv8/r7/LfG1PX3+dbe5tvj6uDn7dHa4+Xr8LzK18fS3fDz9szW4MHO2rLC0SH5BAAAAAAALAAAAACWAMIAAAT/8MlJq7046827/2AojmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter/gsHhMLpvP6LR6zW673/C4fE6v2+/4vH7P7/v/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+gggCjpAAEDRIAAZmjAa4BDKOoqiEFB4ajFQ0ADA+0IAEAuMIVub8fwcMVAwACvgEGAgIJAxMDCdLUDwqltwMGBKYG1Xu51gcACb7NCbG3DwPSBQXSAwMF4QULD8EHCOirypUiJUDBOoMPCDh7YADAvgcLABiQkOxBAQAFJlzMqKfVK2jk/45VVEhBAAGKxIKRg3cMj7kLIomZohAOpYSaFGZ2JAYzID9iJCeYtPlzJTOfLnlaiCkB3cOIE39K2KgRo8AMTOHJoyeAXDAD+/r9a5kUq8+K8LBNW4lAGgJ44MStDEW3rt27ePPq3ct3ky27aEMFbgQt2lprarVxI/Wu0ahp7iTEEzCv3r18Dx0DQBi04VOJRB9lDSphqFRIWXXeTKnU8VmgC0ufPC36dVOHEqCGdpR1cuWuKMHWnoD2Wja2bvsqX868ufPn0KkMJt6aw/RA12l7yP4nO3cM3/t4r74hfJgBB8IRGEfRgGFtuWMROODVYSwB9ImiV89egoIA0hhg3v8XA4RjwFgEVPNYOwC8ww0DCDSkzk+qFBBMglIVKBGC1SggzQHRvITGRW9NZdUonC10kQMSxBLcBA1llAyJVWWEDioPOCDiGcEg4KOPtGQl2QII4KSSNbQk0+OPCNBC2gMuqhHOQDP1FowpArBWzEnJTDnQSappxyMAcymgoG0/FVBNRUdKlqQwbfpXzZNRpkGjBDrektpsD2SJEkcMWTUjACXm2OADN+K545j+cGVQVl8hAGA6A1yZgIWmrMlao9IY5CF+IZJXxjfqHYBQbwk0Y8B/DHwTQAOl1idZXPMhlCOAAriHVHS89urrr8AGK+ywxBZr7LHIJqvsssw26+wts9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwZhABADs='
        }
      />
    );
    expect(wrapper.find('div.UserAvatar--inner').text()).toEqual('SG');
  });
});