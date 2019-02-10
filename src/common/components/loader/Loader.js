import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import './loader.css';

const defaultLoaderClass = 'loader';
const defaultLoadingTextClass = 'loadingText';
const defaultLoaderType = 'bubbles';
const defaultLoaderColor = '#78c043';

export default class Loader extends Component {
  render() {
    const { loading, children, loadingText } = this.props;

    const type = this.props.type ? this.props.type : defaultLoaderType;
    const loaderClass = this.props.loaderClass
      ? this.props.loaderClass
      : defaultLoaderClass;
    const loadingTextClass = this.props.loadingTextClass
      ? this.props.loadingTextClass
      : defaultLoadingTextClass;

    if (loading) {
      return (
        <div className={loaderClass}>
          <div className={loadingTextClass}>{loadingText}</div>
          <ReactLoading
            type={type}
            color={defaultLoaderColor}
            className="loadingIndicator"
          />
        </div>
      );
    }
    return children;
  }
}
