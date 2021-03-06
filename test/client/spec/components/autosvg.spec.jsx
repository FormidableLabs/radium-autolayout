import React, { PropTypes } from "react";
import { mount } from "enzyme";
import { AutoSVG, animateSVG } from "src/autosvg";
import { Motion, spring, presets } from "react-motion";

const mountOptions = {
  context: {
    subviews: {
      foo: {
        layout: {
          width: 100,
          height: 50,
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

describe("AutoSVG", () => {
  it("can position a <rect />", () => {
    const result = mount(
      <AutoSVG.rect name="foo" />, mountOptions
    );
    const node = result.find("rect").node;
    expect(node.getAttribute("x")).to.equal("10");
    expect(node.getAttribute("y")).to.equal("20");
    expect(node.getAttribute("width")).to.equal("100");
    expect(node.getAttribute("height")).to.equal("50");
  });

  it("can position a <line />", () => {
    const result = mount(
      <AutoSVG.line name="foo" />, mountOptions
    );
    const node = result.find("line").node;
    expect(node.getAttribute("x1")).to.equal("10");
    expect(node.getAttribute("x2")).to.equal("100");
    expect(node.getAttribute("y1")).to.equal("20");
    expect(node.getAttribute("y2")).to.equal("50");
  });

  it("can position a <text />", () => {
    const result = mount(
      <AutoSVG.text name="foo" />, mountOptions
    );
    const node = result.find("text").node;
    expect(node.getAttribute("x")).to.equal("10");
    expect(node.getAttribute("y")).to.equal("20");
  });

  it("can position a <circle />", () => {
    const result = mount(
      <AutoSVG.circle name="foo" />, mountOptions
    );
    const node = result.find("circle").node;

    const { top, left, width, height } =
      mountOptions.context.subviews.foo.layout;
    expect(node.getAttribute("cx")).to.equal((left + width / 2).toString(10));
    expect(node.getAttribute("cy")).to.equal((top + height / 2).toString(10));
    expect(node.getAttribute("r")).to.equal((width / 2).toString(10));
  });

  it("can position an <ellipse />", () => {
    const result = mount(
      <AutoSVG.ellipse name="foo" />, mountOptions
    );
    const node = result.find("ellipse").node;

    const { top, left, width, height } =
      mountOptions.context.subviews.foo.layout;
    expect(node.getAttribute("cx")).to.equal((left + width / 2).toString(10));
    expect(node.getAttribute("cy")).to.equal((top + height / 2).toString(10));
    expect(node.getAttribute("rx")).to.equal((width / 2).toString(10));
    expect(node.getAttribute("ry")).to.equal((height / 2).toString(10));
  });

  it("can provide animated versions of its components", () => {
    // TODO: we should use mockRAF like react-motion does to
    // test that the tweening actually works. As of now, this
    // is more of a smoke test that the component actually
    // instantiates correctly.
    const animatedMountOptions = {
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

    const MotionAutoSVG = animateSVG({
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
      <MotionAutoSVG.rect
        name="animated"
        intrinsicWidth={300}
        intrinsicHeight={45}
      >
        Whoa this is an animated subview!!!
      </MotionAutoSVG.rect>,
      animatedMountOptions
    );

    expect(result.find(Motion)).to.have.lengthOf(1);
    expect(result.find("rect")).to.have.lengthOf(1);

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
