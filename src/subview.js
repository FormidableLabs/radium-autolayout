// @flow
import type { Element } from "react";
import type { Layout } from "./engine";
import React, { Component, PropTypes, createElement } from "react";

export type Props = {
  name: string,
  children: ?ReactPropTypes.node,
  style: ?Object
};

export type Transformer = (
  ComposedComponent: ReactClass,
  props: Props,
  layout: Layout
) => Element;

export type LayoutTransform = {
  props: Object,
  style: Object
};

export type LayoutTransformer = (layout: Layout) => LayoutTransform;

const transformer = ( // eslint-disable-line max-params
  ComposedComponent: ReactClass,
  props: Props,
  layout: Layout,
  layoutTransformer: LayoutTransformer
): Element => {
  const layoutProps = layoutTransformer(layout);
  const newProps = {
    ...props,
    ...layoutProps.props,
    style: {
      ...props.style,
      ...layoutProps.style
    }
  };

  return createElement(
    ComposedComponent, newProps, props.children
  );
};

// The default DOM layout map.
// Absolutely positions with style attributes.
const defaultLayoutTransformer = (layout: Layout): Object => {
  return {
    style: {
      position: "absolute",
      width: layout.width,
      height: layout.height,
      top: layout.top,
      left: layout.left
    }
  };
};

type SubviewArgs = {
  animatorClass?: ReactClass,
  animatorProps?: (layout: Layout) => Object,
  layoutTransformer?: LayoutTransformer
};

export default (args: SubviewArgs = {}): // eslint-disable-line space-infix-ops
(ComposedComponent: ReactClass) => ReactClass => {
  const {
    animatorClass: Animator,
    animatorProps,
    layoutTransformer
  } = args;

  return (ComposedComponent: ReactClass): ReactClass =>
    class extends Component {
      props: Props;

      static contextTypes = {
        subviews: PropTypes.object
      };

      createSubviewElement(layout: Layout) {
        // Is this an AutoDOM component?
        if (typeof ComposedComponent === "string") {
          return transformer(
            ComposedComponent,
            this.props,
            layout,
            layoutTransformer || defaultLayoutTransformer
          );
        }

        // If not, pass the layout props to the enhanced component
        return (
          <ComposedComponent
            {...this.props}
            layout={layout}
          />
        );
      }

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
        const layout =
          subviews &&
          name &&
          subviews[name] &&
          subviews[name].layout ||
          zeroLayout;

        return Animator && animatorProps ? (
          <Animator {...animatorProps(layout)}>
            {(interpolatedLayout) =>
              this.createSubviewElement(interpolatedLayout)
            }
          </Animator>
        ) : this.createSubviewElement(layout);
      }
    };
};
