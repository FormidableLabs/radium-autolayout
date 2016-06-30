// @flow
/* eslint-env worker */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
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

type RegistrationArgs = {
  viewName: string,
  size?: {
    width: number,
    height: number
  },
  spacing?: Array<number>,
};

type SpacingArgs = {
  viewName: string,
  spacing: Array<number>
};

type SizeArgs = {
  viewName: string,
  size: {
    width: number,
    height: number
  }
};

type IntrinsicsArgs = {
  viewName: string,
  subviewName: string,
  intrinsics: {
    intrinsicWidth: number,
    intrinsicHeight: number
  }
};

type ConstraintsArgs = {
  viewName: string,
  constraints: Array<ConstraintBuilder>
};

type InitializeArgs = {
  viewName: string,
  layoutProps: Object,
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

  registerView({ viewName, size, spacing }: RegistrationArgs): bool {
    const view = new View();
    this.views[viewName] = view;

    if (size) {
      view.setSize(size.width, size.height);
    }

    if (spacing) {
      view.setSpacing(spacing);
    }

    return true;
  }

  deregisterView({ viewName }: RegistrationArgs): bool {
    this.views[viewName] = null;
    return true;
  }

  setSpacing({ viewName, spacing }: SpacingArgs): ?{ [key: string]: Layout } {
    const view = this.views[viewName];
    if (!view) {
      console.warn("no view for name:", viewName);
      return null;
    }
    view.setSpacing(spacing);
    return this.subviews({ viewName });
  }

  setSize({ viewName, size }: SizeArgs): ?{ [key: string]: Layout } {
    const view = this.views[viewName];
    if (!view) {
      console.warn("no view for name:", viewName);
      return null;
    }
    view.setSize(size.width, size.height);
    return this.subviews({ viewName });
  }

  addIntrinsics(
    { viewName, subviewName, intrinsics }: IntrinsicsArgs
  ): ?{ [key: string]: Layout } {
    const view = this.views[viewName] || null;
    if (!view) {
      console.warn("no view for name:", viewName);
      return null;
    }

    const subview = this.getSubview(view, subviewName);
    if (!subview) {
      console.warn("no subview for name:", subviewName);
      return null;
    }

    subview.intrinsicWidth =
      intrinsics.intrinsicWidth || subview.intrinsicWidth;
    subview.intrinsicHeight =
      intrinsics.intrinsicHeight || subview.intrinsicHeight;

    return this.subviews({ viewName });
  }

  addConstraints(
    { viewName, constraints }: ConstraintsArgs
  ): ?{ [key: string]: Layout } {
    const view = this.views[viewName];
    if (!view) {
      console.warn("no view for name:", viewName);
      return null;
    }

    if (!constraints.length) {
      console.warn("empty constraints");
      return null;
    }

    view.addConstraints(constraints);
    return this.subviews({ viewName });
  }

  removeConstraints(
    { viewName, constraints }: ConstraintsArgs
  ): ?{ [key: string]: Layout } {
    const view = this.views[viewName];
    if (!view) {
      console.warn("no view for name:", viewName);
      return null;
    }

    if (!constraints.length) {
      console.warn("empty constraints");
      return null;
    }

    view.removeConstraints(constraints);
    return this.subviews({ viewName });
  }

  initializeSubviews(
    { viewName, layoutProps }: InitializeArgs
  ): ?{ [key: string]: Layout } {
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

  subviews({ viewName }: RegistrationArgs): ?{ [key: string]: Layout } {
    const view = this.views[viewName];
    if (!view || !view.subViews) {
      console.warn("subviews() failed for:", viewName);
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
