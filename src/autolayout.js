import { Component, PropTypes, createElement } from "react";
import ConstraintClient from "./client";

export default class AutoLayout extends Component {
  constructor(props) {
    super(props);

    this.constraintClient = new ConstraintClient(props, (message) => {
      this.onLayout(message);
    });

    this.state = {
      subviews: {}
    };
  }

  componentWillMount() {
    // Extract constraints and other layout props from the children
    const rawElementTree = createElement(
      this.props.container, null, this.props.children
    );
    this.constraintClient.initializeSubviews(rawElementTree);
  }

  componentWillUnmount() {
    this.constraintClient.deregister();
  }

  getChildContext() {
    return {
      subviews: this.state.subviews
    };
  }

  onLayout(message) {
    const { subviews } = message.payload;
    if (subviews) {
      this.setState({
        subviews: message.payload.subviews
      });
    }
  }

  render() {
    return createElement(
      this.props.container, null, this.props.children
    );
  }

  static childContextTypes = {
    subviews: PropTypes.object
  };

  static propTypes = {
    container: PropTypes.string,
    children: PropTypes.node
  };
}

