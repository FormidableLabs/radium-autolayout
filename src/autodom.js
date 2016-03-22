/* eslint-disable new-cap */
import { DOM as DOMFactories } from "react";
import Subview from "./subview";

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

export default Object.keys(DOMFactories)
  .filter((key) => whitelist.indexOf(key) !== -1)
  .reduce((acc, key) => {
    acc[key] = transformers[key]
      ? Subview(key, transformers[key])
      : Subview(key);
    return acc;
  }, {});
