/* eslint-env worker */
import { View } from "autolayout";

class Engine {
  constructor() {
    this.views = {};
  }

  registerView(viewName) {
    this.views[viewName] = new View();
  }

  deregisterView(viewName) {
    this.views[viewName] = null;
  }

  setSpacingFor(viewName, spacing) {
    const view = this.views[viewName];
    if (!view) {
      return;
    }
    view.setSpacing(spacing);
    this.getSubviewsFor(viewName);
  }

  setSizeFor(viewName, width, height) {
    const view = this.views[viewName];
    if (!view) {
      return;
    }
    view.setSize(width, height);
    this.getSubviewsFor(viewName);
  }

  addIntrinsicsFor(viewName, subviewName, intrinsics) {
    const view = this.views[viewName];
    if (!view) {
      return;
    }

    const subview = view.subviews[viewName];
    if (!subview) {
      return;
    }

    subview.intrinsicWidth = intrinsics.intrinsicWidth || subview.intrinsicWidth;
    subview.intrinsicHeight = intrinsics.intrinsicHeight || subview.intrinsicHeight;
    this.getSubviewsFor(viewName);
  }

  addConstraintsFor(viewName, constraints) {
    const view = this.views[viewName];
    if (!view) {
      return;
    }
    view.addConstraints(constraints);
    this.getSubviewsFor(viewName);
  }

  initializeSubviewsFor(viewName, layout) {
    const constraints = layout
      .map((element) => element.constraints)
      .filter((constraint) => constraint)
      .reduce((prev, curr) => prev.concat(curr));
    this.addConstraintsFor(viewName, constraints);

    layout.forEach((item) => {
      const { subviewName, intrinsicWidth, intrinsicHeight } = item;
      this.addIntrinsicsFor(
        viewName,
        subviewName,
        { intrinsicWidth, intrinsicHeight }
      );
    });
  }

  getSubviewsFor(viewName) {
    const view = this.views[viewName];
    if (!view) {
      return;
    }

    const subviews = Object.keys(view.subviews)
      .reduce((acc, key) => {
        const subview = view.subviews[key];
        const layout = {
          width: subview.width,
          height: subview.height,
          left: subview.left,
          top: subview.top,
          right: subview.right,
          bottom: subview.bottom
        };
        return {...acc, [key]: { layout }};
      }, {});

    postMessage({
      type: "subviews",
      payload: { viewName, subviews }
    });
  }
}

const engine = new Engine();

onmessage = ({ data: message }) => {
  const {
    width,
    height,
    spacing,
    constraints,
    viewName,
    subviewName,
    intrinsicWidth,
    intrinsicHeight
  } = message.payload;

  switch (message.type) {
  case "registerView":
    engine.registerView(viewName);
    break;
  case "deregisterView":
    engine.deregisterView(viewName);
    break;
  case "setSize":
    engine.setSizeFor(viewName, width, height);
    break;
  case "setSpacing":
    engine.setSpacingFor(viewName, spacing);
    break;
  case "addConstraints":
    engine.addConstraintsFor(viewName, constraints);
    break;
  case "addIntrinsics":
    engine.addIntrinsicsFor(
      viewName,
      subviewName,
      { intrinsicWidth, intrinsicHeight }
    );
    break;
  case "initializeSubviews":
    engine.initializeSubviewsFor(
      viewName, message.payload.layoutProps
    );
    break;
  case "getSubviews":
    engine.getSubviewsFor(viewName);
    break;
  default:
    break;
  }
};
