import React, { Component, PropTypes } from "react";
import LayoutClient from "./layout-client";

export default class AutoLayout extends Component {
  constructor(props) {
    super(props);
    this.client = new LayoutClient();
  }

  componentWillUnmount() {
    this.client.terminate();
  }

  render() {
    return <div>{this.props.children}</div>;
  }

  getChildContext() {
    return {
      client: this.client
    };
  }

  static childContextTypes = {
    client: PropTypes.instanceOf(LayoutClient)
  };

  static propTypes = {
    children: PropTypes.node
  };
}

