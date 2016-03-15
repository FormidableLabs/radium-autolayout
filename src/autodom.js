/* eslint-disable new-cap */
import { DOM as DOMFactories } from "react";
import Subview from "./subview.js";

export default Object.keys(DOMFactories)
  .reduce((acc, key) => {
    return {...acc, [key]: Subview(key)};
  }, {});
