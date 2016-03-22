import { Children } from "react";

const extractLayoutProps = (element, acc = []) => {
  if (!element || !element.props) {
    return null;
  }

  const {
    constraints: rawConstraints,
    children,
    intrinsicWidth,
    intrinsicHeight,
    name
  } = element.props;

  if (children) {
    Children.forEach(children, (child) => {
      return extractLayoutProps(child, acc);
    });
  }

  const constraints = rawConstraints
    ? rawConstraints.map((c) => c.build())
    : null;

  acc.push({
    constraints: constraints || null,
    intrinsicWidth: intrinsicWidth || null,
    intrinsicHeight: intrinsicHeight || null,
    name: name || null
  });

  return acc;
};

export default extractLayoutProps;
