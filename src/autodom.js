/* eslint-disable new-cap */
import { DOM as DOMFactories } from "react";
import Subview from "./subview";

type AnimatedDOMArgs = {
  animatorClass: ReactClass,
  animatorProps: (layout: Layout) => Object,
};

// This is to override any DOM nodes that can't
// use the default position: absolute transform
const transformers = {};

export const whitelist = [
  // block level elements (should all be safe)
  "address", "article", "aside", "blockquote",
  "canvas", "dd", "div", "dl", "fieldset",
  "figcaption", "figure", "footer", "form",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "header", "hgroup", "hr", "li", "main",
  "nav", "noscript", "ol", "output", "p", "pre",
  "section", "table", "ul", "video", "div",
  "img", "blockquote",

  // safe inline elements
  "img", "span", "button", "input", "label",
  "select", "textarea"
];

const safeDOMFactories = Object.keys(DOMFactories)
  .filter((key) => whitelist.indexOf(key) !== -1);

export const AutoDOM = safeDOMFactories.reduce((acc, key) => {
  acc[key] = transformers[key]
    ? Subview({
      layoutTransformer: transformers[key]
    })(key)
    : Subview()(key);
  return acc;
}, {});

export const animateDOM = (args: AnimatedDOMArgs) =>
  safeDOMFactories.reduce((acc, key) => {
    acc[key] = transformers[key]
      ? Subview({
        ...args,
        layoutTransformer: transformers[key]
      })(key)
      : Subview(args)(key);
    return acc;
  }, {});
