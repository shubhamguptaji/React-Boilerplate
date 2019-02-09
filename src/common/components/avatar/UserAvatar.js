//IN: extracted and updated code from react-user-avatar library

import React from 'react';
import initials from 'initials';
import addPx from 'add-px';
import contrast from 'contrast';

// from https://flatuicolors.com/
const defaultColors = [
  '#2ecc71', // emerald
  '#3498db', // peter river
  '#8e44ad', // wisteria
  '#e67e22', // carrot
  '#e74c3c', // alizarin
  '#1abc9c', // turquoise
  '#2c3e50' // midnight blue
];

function sumChars(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }

  return sum;
}

class UserAvatar extends React.Component {
  render() {
    const {
      borderRadius = '100%',
      src,
      srcset,
      name,
      color,
      colors = defaultColors,
      style,
      className,
      numberOfLettersInAvatar = 2
    } = this.props;

    let size = this.props.size;

    if (!name) throw new Error('UserAvatar requires a name');

    let abbr = initials(name);
    if (numberOfLettersInAvatar && numberOfLettersInAvatar <= abbr.length) {
      abbr = abbr.substring(0, numberOfLettersInAvatar);
    }

    size = addPx(size);

    const imageStyle = {
      display: 'block',
      objectFit: 'cover',
      objectPosition: 'top',
      borderRadius
    };

    const innerStyle = {
      lineHeight: size,
      textAlign: 'center',
      borderRadius
    };

    if (size) {
      imageStyle.width = innerStyle.width = innerStyle.maxWidth = size;
      imageStyle.height = innerStyle.height = innerStyle.maxHeight = size;
    }

    let inner = [className, 'UserAvatar'];
    const classes = [className, 'UserAvatar'];
    if (src || srcset) {
      inner = (
        <img
          className="UserAvatar--img"
          style={imageStyle}
          src={src}
          srcSet={srcset}
          alt={name}
        />
      );
    } else {
      let background;
      if (color) {
        background = color;
      } else {
        // pick a deterministic color from the list
        const i = sumChars(name) % colors.length;
        background = colors[i];
      }

      innerStyle.backgroundColor = background;

      inner = abbr;
    }

    if (innerStyle.backgroundColor) {
      classes.push(`UserAvatar--${contrast(innerStyle.backgroundColor)}`);
    }

    return (
      <div aria-label={name} className={classes.join(' ')} style={style}>
        <div className="UserAvatar--inner" style={innerStyle}>
          {inner}
        </div>
      </div>
    );
  }
}

export default UserAvatar;
