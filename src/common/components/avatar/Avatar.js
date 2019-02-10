import React, { Component } from 'react';
import UserAvatar from './UserAvatar';
import './Avatar.css';

const base64Mime = 'data:image/jpeg;base64,';

export default class Avatar extends Component {
  ensureBase64Format(src) {
    if (!src) {
      return src;
    }

    if (src.startsWith(base64Mime)) {
      return src;
    }
    return base64Mime + src;
  }

  render() {
    const { name } = this.props;
    let { src } = this.props;

    src = this.ensureBase64Format(src);

    if (
      src ===
      'data:image/jpeg;base64,R0lGODlhlgDCALMAAP///+rv8/r7/LfG1PX3+dbe5tvj6uDn7dHa4+Xr8LzK18fS3fDz9szW4MHO2rLC0SH5BAAAAAAALAAAAACWAMIAAAT/8MlJq7046827/2AojmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter/gsHhMLpvP6LR6zW673/C4fE6v2+/4vH7P7/v/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+gggCjpAAEDRIAAZmjAa4BDKOoqiEFB4ajFQ0ADA+0IAEAuMIVub8fwcMVAwACvgEGAgIJAxMDCdLUDwqltwMGBKYG1Xu51gcACb7NCbG3DwPSBQXSAwMF4QULD8EHCOirypUiJUDBOoMPCDh7YADAvgcLABiQkOxBAQAFJlzMqKfVK2jk/45VVEhBAAGKxIKRg3cMj7kLIomZohAOpYSaFGZ2JAYzID9iJCeYtPlzJTOfLnlaiCkB3cOIE39K2KgRo8AMTOHJoyeAXDAD+/r9a5kUq8+K8LBNW4lAGgJ44MStDEW3rt27ePPq3ct3ky27aEMFbgQt2lprarVxI/Wu0ahp7iTEEzCv3r18Dx0DQBi04VOJRB9lDSphqFRIWXXeTKnU8VmgC0ufPC36dVOHEqCGdpR1cuWuKMHWnoD2Wja2bvsqX868ufPn0KkMJt6aw/RA12l7yP4nO3cM3/t4r74hfJgBB8IRGEfRgGFtuWMROODVYSwB9ImiV89egoIA0hhg3v8XA4RjwFgEVPNYOwC8ww0DCDSkzk+qFBBMglIVKBGC1SggzQHRvITGRW9NZdUonC10kQMSxBLcBA1llAyJVWWEDioPOCDiGcEg4KOPtGQl2QII4KSSNbQk0+OPCNBC2gMuqhHOQDP1FowpArBWzEnJTDnQSappxyMAcymgoG0/FVBNRUdKlqQwbfpXzZNRpkGjBDrektpsD2SJEkcMWTUjACXm2OADN+K545j+cGVQVl8hAGA6A1yZgIWmrMlao9IY5CF+IZJXxjfqHYBQbwk0Y8B/DHwTQAOl1idZXPMhlCOAAriHVHS89urrr8AGK+ywxBZr7LHIJqvsssw26+wts9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwZhABADs='
    ) {
      src = '';
    }

    return <UserAvatar name={name} src={src} size="40" color="#E9EDF2" />;
  }
}
