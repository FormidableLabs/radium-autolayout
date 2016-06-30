/* eslint-env mocha */
import React, { PropTypes } from "react";
import { mount } from "enzyme";
import { AutoDOM, animateDOM, whitelist } from "src/autodom";
import { Motion, spring, presets } from "react-motion";

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

  it("can provide animated versions of its components", () => {
    // TODO: we should use mockRAF like react-motion does to
    // test that the tweening actually works. As of now, this
    // is more of a smoke test that the component actually
    // instantiates correctly.
    const mountOptions = {
      context: {
        subviews: {
          foo: {
            layout: {
              width: 300,
              height: 45,
              top: 20,
              right: 100,
              bottom: 50,
              left: 10
            }
          }
        }
      },
      childContextTypes: {
        subviews: PropTypes.object
      }
    };

    const MotionAutoDOM = animateDOM({
      animatorClass: Motion,
      animatorProps: (layout) => ({
        style: {
          width: spring(layout.width, presets.wobbly),
          height: spring(layout.height, presets.wobbly),
          top: spring(layout.top, presets.wobbly),
          right: spring(layout.right, presets.wobbly),
          bottom: spring(layout.bottom, presets.wobbly),
          left: spring(layout.left, presets.wobbly)
        }
      })
    });

    const result = mount(
      <MotionAutoDOM.p
        name="animated"
        intrinsicWidth={300}
        intrinsicHeight={45}
      >
        Whoa this is an animated subview!!!
      </MotionAutoDOM.p>,
      mountOptions
    );

    expect(result.find(Motion)).to.have.lengthOf(1);
    expect(result.find("p")).to.have.lengthOf(1);

    result.setContext({
      subviews: {
        foo: {
          layout: {
            width: 300,
            height: 45,
            top: 10,
            right: 50,
            bottom: 250,
            left: 100
          }
        }
      }
    });

    expect(result.context().subviews.foo.layout).to.deep.equal({
      width: 300,
      height: 45,
      top: 10,
      right: 50,
      bottom: 250,
      left: 100
    });
  });
});
