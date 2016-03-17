// @flow
import type { Element } from "react";
import type { Layout } from "./engine";
import React, { Component, PropTypes, createElement } from "react";

export type Props = {
  name: string,
  children: ?ReactPropTypes.node
};

export type Transformer = (
  ComposedComponent: ReactClass,
  props: Props,
  layout: Layout
) => Element;

export type LayoutTransform = {
  transformType: string,
  props: Object
};

export type LayoutTransformer = (layout: Layout) => LayoutTransform;

const transformer = (
  ComposedComponent: ReactClass,
  props: Props,
  layout: Layout,
  layoutTransformer: LayoutTransformer
): Element => {
  const layoutProps = layoutTransformer(layout);
  const newProps = layoutProps.transformType === "style"
    ? {...props, style: layoutProps.props}
    : {...props, ...layoutProps.props}

  return createElement(
    ComposedComponent, newProps, props.children
  );
}
// The default DOM layout map.
// Absolutely positions with style attributes.
const defaultLayoutTransformer = (layout: Layout): Object => {
  return {
    transformType: "style",
    props: {
      width: layout.width,
      height: layout.height,
      top: layout.top,
      left: layout.left
    }
  };
};

export default (
  ComposedComponent: ReactClass,
  layoutTransformer: LayoutTransformer = defaultLayoutTransformer
): ReactClass =>
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
      return transformer(
        ComposedComponent,
        this.props,
        layout,
        layoutTransformer
      );
    }

    // If not, pass the layout props to the wrapped component
    return (
      <ComposedComponent
        {...this.props}
        layout={layout}
      />
    );
  }
};
