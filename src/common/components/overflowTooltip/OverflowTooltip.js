import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Popup } from 'semantic-ui-react';

function isTextOverflow(element) {
  return element.clientWidth < element.scrollWidth;
}

export default class OverflowTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      overflow: false
    };
  }

  resize = () => this.forceUpdate();

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.checkOverflow();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  forceUpdate() {
    this.checkOverflow();
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({ overflow: false });
  }

  componentDidUpdate() {
    this.checkOverflow();
  }

  checkOverflow() {
    const element = ReactDOM.findDOMNode(this);
    const overflow = isTextOverflow(element);

    if (overflow !== this.state.overflow) {
      this.setState({ overflow: overflow });
    }
  }

  render() {
    const styleObj = {
      background: '#f8fafb', //color-light-grey
      fontFamily: 'Avenir Next Medium',
      fontWeight: 'lighter',
      color: '#7f8fa4', //color-dark-grey;
      fontSize: '10pt',
      borderStyle: 'none',
      borderRadius: '4px',
      padding: '0.75em'
    };

    styleObj.opacity = this.state.overflow ? '1' : '0';

    return (
      <Popup
        trigger={this.props.children}
        content={this.props.title}
        style={styleObj}
        basic
        hideOnScroll
      />
    );
  }
}

OverflowTooltip.displayName = 'OverflowTooltip';
OverflowTooltip.propTypes = {
  children: PropTypes.node.isRequired
};
