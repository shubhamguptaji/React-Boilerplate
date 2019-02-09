import React, { Component } from 'react';
import fileExtension from 'file-extension';

const importAll = (r) => {
  const images = {};
  r.keys().map((item, index) => {
    return (images[item.replace('./', '')] = r(item));
  });
  return images;
};

const fileExtensionImages = importAll(
  require.context('../../../assets/img/fileIcons', false, /\.(png|jpe?g|svg)$/)
);

export const getFileExtensionKey = (filename) => {
  const extension = fileExtension(filename);
  switch (extension.toUpperCase()) {
    case 'PNG':
    case 'JPEG':
    case 'BMP':
    case 'JPG':
    case 'GIF':
      return 'cs-i-img.png';
    case 'XLS':
    case 'XLSX':
      return 'xls.png';
    case 'PDF':
      return 'pdf.png';
    case 'TXT':
      return 'txt.png';
    case 'PPT':
    case 'PPTX':
      return 'ppt.png';
    case 'MSG':
      return 'msg.png';
    case 'DOC':
    case 'DOCX':
      return 'doc.png';
    default:
      return 'other.png';
  }
};

const getFileImage = (filename) => {
  const key = getFileExtensionKey(filename);
  return fileExtensionImages[key];
};

export default class FileIcon extends Component {
  render() {
    const { fileName, className } = this.props;
    const image = getFileImage(fileName);
    return <img src={image} alt={fileName} className={className} />;
  }
}