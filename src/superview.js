// @flow
import type { SubView } from "autolayout";
import type { Element } from "react";
import type LayoutClient from "./layout-client";

import { Component, PropTypes, createElement } from "react";
import extractLayoutProps from "./extract-layout-props";

type Props = {
  name: string,
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

export default class Superview extends Component {
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
      container, children, name, width, height, spacing
    } = this.props;
    const size = { width, height };
    const { client } = this.context;

    const element = createElement(container, null, children);
    const layoutProps = extractLayoutProps(element);

    client.registerView(name, size, spacing, () => {
      client.run("initializeSubviews", {
        viewName: name, layoutProps
      }, (layout) => this.onLayout(layout));
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { name: viewName, width, height } = nextProps;
    const { width: oldWidth, height: oldHeight } = this.props;
    if (width === oldWidth && height === oldHeight) {
      return;
    }
    this.context.client.run("setSize", {
      viewName, size: { width, height }
    }, (layout) => this.onLayout(layout));
  }

  onLayout(subviews: Array<SubView>) {
    this.setState({ subviews });
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
