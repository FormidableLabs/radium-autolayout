// @flow
import type { Element } from "react";

import React, { Component } from "react";
import uuid from "node-uuid";

type Props = {
  name: string,
  children: ?ReactPropTypes.node,
  style: ?Object
};

export default (ComposedComponent: ReactClass): ReactClass =>
class extends Component {
  uniqueName: string;

  constructor(props: Props) {
    super(props);
    this.uniqueName = `${props.name}-${uuid.v4()}`;
  }

  render(): ?Element {
    return <ComposedComponent {...this.props} name={this.uniqueName} />;
  }
};
