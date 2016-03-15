// @flow
import type { Element } from "react";
import React, { Component, PropTypes, createElement } from "react";

type Props = {
  name: string,
  children: ?ReactPropTypes.node
};

export default (ComposedComponent: ReactClass): ReactClass =>
class extends Component {
  props: Props;

  static contextTypes = {
    subviews: PropTypes.object
  };

  render(): ?Element {
    const zeroLayout = {
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    const { name } = this.props;
    const { subviews } = this.context;
    const layout = subviews &&
      name &&
      subviews[name] &&
      subviews[name].layout
        ? subviews[name].layout
        : zeroLayout;

    // Is this an AutoDOM component?
    if (typeof ComposedComponent === "string") {
      const style = {
        width: layout.width || 0,
        height: layout.height || 0,
        top: layout.top || 0,
        left: layout.left || 0
      };
      return createElement(
        ComposedComponent,
        {...this.props, style},
        this.props.children
      );
    }

    return (
      <ComposedComponent
        {...this.props}
        layout={layout}
      />
    );
  }
};

