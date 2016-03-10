import React, { Component, PropTypes } from "react";

export default (ComposedComponent) => class extends Component {
  extractLayout(subview, zeroLayout) {
    return {
      layout: subview ? {
        name: subview.name,
        top: subview.top,
        right: subview.right,
        bottom: subview.bottom,
        left: subview.left,
        width: subview.width,
        height: subview.height
      } : zeroLayout
    };
  }

  render() {
    const zeroLayout = {
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    const { viewName } = this.props;
    const { subviews } = this.context;
    const layout = subviews &&
      viewName &&
      subviews[viewName] &&
      subviews[viewName].layout
        ? subviews[viewName].layout
        : zeroLayout;

    return (
      <ComposedComponent
        {...this.props}
        layout={layout}
      />
    );
  }

  static contextTypes = {
    subviews: PropTypes.object
  };

  static propTypes = {
    viewName: PropTypes.string
  };
};

