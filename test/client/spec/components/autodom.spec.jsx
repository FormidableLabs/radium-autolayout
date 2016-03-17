/* eslint-env mocha */
import React, { PropTypes } from "react";
import { mount } from "enzyme";
import AutoDOM, { whitelist } from "src/autodom";

describe("AutoDOM", () => {
  whitelist.forEach((element) => {
    it(`can absolutely position <${element} /> `, () => {
      const AutoComponent = AutoDOM[element];
      const result = mount(<AutoComponent name="foo" />, {
        context: {
          subviews: {
            foo: {
              layout: {
                "width": 100,
                "height": 50,
                "top": 0,
                "right": 100,
                "bottom": 50,
                "left": 0
              }
            }
          }
        },
        childContextTypes: {
          subviews: PropTypes.object
        }
      });
      const style = result.find(element).node.style;
      expect(style).to.have.property("width", "100px");
      expect(style).to.have.property("height", "50px");
      expect(style).to.have.property("top", "0px");
      expect(style).to.have.property("left", "0px");
    });
  });
});
