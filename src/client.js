import { Children } from "react";

export default class ConstraintClient {
  constructor(props, callback) {
    this.viewName = props.viewName;
    this.workerPool = props.workerPool;
    this.workerPool.registerView(props.viewName, callback);

    const { size, spacing, constraints } = props;

    if (size) {
      this.setSize(size);
    }

    if (spacing) {
      this.setSpacing(spacing);
    }

    if (constraints) {
      this.addConstraints(constraints);
    }
  }

  setSize(size) {
    this.workerPool.routeMessage({
      type: "setSize",
      payload: {
        viewName: this.viewName,
        width: size.width,
        height: size.height
      }
    });
  }

  setSpacing(spacing) {
    this.workerPool.routeMessage({
      type: "setSpacing",
      payload: {
        viewName: this.viewName,
        spacing
      }
    });
  }

  addConstraints(constraints) {
    this.workerPool.routeMessage({
      type: "addConstraints",
      payload: {
        viewName: this.viewName,
        constraints: constraints.map((c) => c.build())
      }
    });
  }

  initializeSubviews(element) {
    const layoutProps = this.extractLayoutProps(element);
    this.workerPool.routeMessage({
      type: "initializeSubviews",
      payload: {
        viewName: this.viewName,
        layoutProps
      }
    });
  }

  extractLayoutProps(element, acc = []) {
    if (!element || !element.props) {
      return null;
    }

    const {
      constraints: rawConstraints,
      children,
      intrinsicWidth,
      intrinsicHeight,
      viewName
    } = element.props;

    if (children) {
      Children.forEach(children, (child) => {
        return this.extractLayoutProps(child, acc);
      });
    }

    const constraints = rawConstraints
      ? rawConstraints.map((c) => c.build())
      : null;

    acc.push({
      constraints: constraints || null,
      intrinsicWidth: intrinsicWidth || null,
      intrinsicHeight: intrinsicHeight || null,
      viewName: viewName || null
    });

    return acc;
  }

  deregister() {
    this.workerPool.deregisterView(this.viewName);
  }
}

