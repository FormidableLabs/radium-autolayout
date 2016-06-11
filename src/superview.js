// @flow
/* eslint-disable new-cap */
import type { SubView } from "autolayout";
import type { Element } from "react";
import type LayoutClient from "./layout-client";
import type ConstraintBuilder from "./constraint-builder";

import { Component, PropTypes, createElement } from "react";
import isEqual from "lodash.isequal";
import UUID from "./uuid";
import extractLayoutProps from "./extract-layout-props";

type Props = {
  name: string,
  constraints: ?Array<ConstraintBuilder>,
  container: ReactClass,
  children: ReactPropTypes.node,
  width: number,
  height: number,
  spacing: Array<number>,
  style: Object
};

type State = {
  subviews: ?Array<SubView>
};

type Context = {
  client: LayoutClient
};

class Superview extends Component {
  props: Props;
  state: State;

  static childContextTypes = {
    subviews: PropTypes.object
  };

  static contextTypes = {
    client: PropTypes.object
  };

  constructor(props: Props, context: Context) {
    super(props, context);

    this.state = {
      subviews: null
    };
  }

  componentDidMount() {
    const {
      constraints, container, children, name, width, height, spacing
    } = this.props;
    const size = { width, height };
    const { client } = this.context;

    const element = createElement(container, null, children);
    const layoutProps = extractLayoutProps(element)
      .concat(constraints ? {
        constraints: constraints.map((c) => c.build())
      } : []);

    client.registerView(name, size, spacing)
      .then(() => client.run("initializeSubviews", {
        viewName: name, layoutProps
      }))
      .then((layout) => this.onLayout(layout));
  }

  componentWillReceiveProps(nextProps: Props) {
    const { name: viewName, width, height } = nextProps;
    const { width: oldWidth, height: oldHeight } = this.props;

    const sameSize = width === oldWidth && height === oldHeight;
    const sameConstraints = isEqual(
      this.props.constraints,
      nextProps.constraints
    );

    if (sameSize && sameConstraints) {
      return;
    }

    const onlyHasNewSize = !sameSize && sameConstraints;

    const resizePromise = this.context.client.run("setSize", {
      viewName, size: { width, height }
    });

    const reconstrainPromise = this.context.client.run("removeConstraints", {
      viewName,
      constraints: this.props.constraints &&
        this.props.constraints.map((c) => c.build()) || []
    })
    .then(() => this.context.client.run("addConstraints", {
      viewName,
      constraints: nextProps.constraints &&
        nextProps.constraints.map((c) => c.build()) || []
    }))
    .then(() => resizePromise);

    const layoutPromise = onlyHasNewSize
      ? resizePromise
      : reconstrainPromise;

    layoutPromise
      .then((layout) => this.onLayout(layout));
  }

  onLayout(subviews: Array<SubView>) {
    this.setState({ subviews }, () => this.forceUpdate());
  }

  getChildContext(): { subviews: ?Array<SubView> } {
    return { subviews: this.state.subviews };
  }

  render(): ?Element {
    const { container, children, width, height, style } = this.props;
    const newProps = {
      style: { width, height, ...style}
    };

    return createElement(container, newProps, children);
  }
}

export default UUID(Superview);
