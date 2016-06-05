/* eslint-disable new-cap */
import type { Layout } from "./engine";
import Subview from "./subview";

const transformers = {
  rect: (layout: Layout): Object => {
    return {
      transformType: "props",
      props: {
        x: layout.left,
        y: layout.top,
        width: layout.width,
        height: layout.height
      }
    };
  },
  line: (layout: Layout): Object => {
    return {
      transformType: "props",
      props: {
        x1: layout.left,
        x2: layout.right,
        y1: layout.top,
        y2: layout.bottom
      }
    };
  },
  text: (layout: Layout): Object => {
    return {
      transformType: "props",
      props: {
        x: layout.left,
        y: layout.top
      }
    };
  },
  circle: (layout: Layout): Object => {
    return {
      transformType: "props",
      props: {
        cx: layout.left + layout.width / 2,
        cy: layout.top + layout.height / 2,
        r: layout.width / 2
      }
    };
  },
  ellipse: (layout: Layout): Object => {
    return {
      transformType: "props",
      props: {
        cx: layout.left + layout.width / 2,
        cy: layout.top + layout.height / 2,
        rx: layout.width / 2,
        ry: layout.height / 2
      }
    };
  }
};

export const AutoSVG = Object.keys(transformers).reduce((acc, key) => {
  acc[key] = Subview({
    layoutTransformer: transformers[key]
  })(key);
  return acc;
}, {});

export const animateSVG = (args: AnimatedDOMArgs) =>
  Object.keys(transformers).reduce((acc, key) => {
    acc[key] = Subview({
      ...args,
      layoutTransformer: transformers[key]
    })(key);
    return acc;
  }, {});
