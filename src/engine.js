// @flow
/* eslint-env worker */
import type { SubView } from "autolayout";
import type ConstraintBuilder from "./constraint-builder";
import View from "autolayout/lib/kiwi/View";

export type Layout = {
  width: number,
  height: number,
  left: number,
  top: number,
  right: number,
  bottom: number
};

export type WorkerArgs = {
  viewName: string,
  subviewName?: string,
  layoutProps?: Object,
  size?: {
    width: number,
    height: number
  },
  spacing?: Array<number>,
  intrinsics?: {
    intrinsicWidth: number,
    intrinsicHeight: number
  },
  constraints?: Array<ConstraintBuilder>
};

// Decorates engine methods to post a "callback"
// message to the main thread with the method
// name and result.
const postCallback = (
  viewName: string,
  callbackName: string,
  method: (args: WorkerArgs) => bool | Layout
) => {
  return (args: WorkerArgs) => {
    const result = method(args);
    postMessage({
      viewName, method: callbackName, result
    });
  };
};

export default class Engine {
  views: { [key: string]: ?View };

  constructor() {
    this.views = {};
  }

  registerView(args: WorkerArgs): bool {
    const { viewName } = args;
    const view = new View();
    this.views[viewName] = view;

    const size = args.size || null;
    if (size) {
      view.setSize(size.width, size.height);
    }

    if (args.spacing) {
      view.setSpacing(args.spacing);
    }

    return true;
  }

  deregisterView(args: WorkerArgs): bool {
    const { viewName } = args;
    this.views[viewName] = null;
    return true;
  }

  setSpacing(args: WorkerArgs): ?{ [key: string]: Layout } {
    const { viewName } = args;
    const view = this.views[viewName];
    if (!view) {
      return null;
    }
    const spacing = args.spacing || null;
    if (!spacing) {
      return null;
    }
    view.setSpacing(spacing);
    return this.subviews({ viewName });
  }

  setSize(args: WorkerArgs): ?{ [key: string]: Layout } {
    const { viewName } = args;
    const view = this.views[viewName];
    const size = args.size;
    if (!view || !size) {
      return null;
    }
    view.setSize(size.width, size.height);
    return this.subviews({ viewName });
  }

  addIntrinsics(args: WorkerArgs): ?{ [key: string]: Layout } {
    const { viewName } = args;
    const subviewName = args.subviewName || null;
    if (!subviewName) {
      return null;
    }
    const view = this.views[viewName] || null;
    if (!view) {
      return null;
    }
    const subview = this.getSubview(view, subviewName);
    const intrinsics = args.intrinsics || null;

    if (!subview || !intrinsics) {
      return null;
    }

    subview.intrinsicWidth =
      intrinsics.intrinsicWidth || subview.intrinsicWidth;
    subview.intrinsicHeight =
      intrinsics.intrinsicHeight || subview.intrinsicHeight;

    return this.subviews({ viewName });
  }

  addConstraints(args: WorkerArgs): ?{ [key: string]: Layout } {
    const { viewName } = args;
    const view = this.views[viewName];
    if (!view) {
      return null;
    }
    const constraints = args.constraints || null;
    if (!constraints || !constraints.length) {
      return null;
    }
    view.addConstraints(constraints);
    return this.subviews({ viewName });
  }

  removeConstraints(args: WorkerArgs): ?{ [key: string]: Layout } {
    const { viewName } = args;
    const view = this.views[viewName];
    if (!view) {
      return null;
    }
    const constraints = args.constraints || null;
    if (!constraints || !constraints.length) {
      return null;
    }
    view.removeConstraints(constraints);
    return this.subviews({ viewName });
  }

  initializeSubviews(args: WorkerArgs): ?{ [key: string]: Layout } {
    const { viewName } = args;
    const layoutProps = args.layoutProps || null;
    if (!layoutProps) {
      return null;
    }
    const constraints = layoutProps
      .map((element) => element.constraints)
      .filter((constraint) => constraint)
      .reduce((prev, curr) => prev.concat(curr), []);
    this.addConstraints({ viewName, constraints });

    layoutProps.forEach((item) => {
      const {
        name: subviewName,
        intrinsicWidth,
        intrinsicHeight
      } = item;
      if (subviewName && intrinsicWidth && intrinsicHeight) {
        this.addIntrinsics({
          viewName, subviewName, intrinsics: {
            intrinsicWidth, intrinsicHeight
          }
        });
      }
    });

    return this.subviews({ viewName });
  }

  subviews(args: WorkerArgs): ?{ [key: string]: Layout } {
    const view = this.views[args.viewName];
    if (!view || !view.subViews) {
      return null;
    }

    return Object.keys(view.subViews)
      .reduce((acc, key) => {
        const subview = view.subViews[key];
        const layout = {
          width: subview.width,
          height: subview.height,
          left: subview.left,
          top: subview.top,
          right: subview.right,
          bottom: subview.bottom
        };
        acc[key] = { layout };
        return acc;
      }, {});
  }

  getSubview(view: View, subviewName: string): ?SubView {
    const subviews = view.subViews || null;
    if (!subviews) {
      return null;
    }
    const subview = subviews[subviewName];
    return subview || null;
  }
}

const engine = new Engine();

onmessage = ({ data: message }) => {
  const { method, args } = message;
  // $FlowIssue: doesn't support dynamic lookup yet
  if (engine[method]) {
    postCallback(args.viewName, method, engine[method].bind(engine))(args);
  }
};
