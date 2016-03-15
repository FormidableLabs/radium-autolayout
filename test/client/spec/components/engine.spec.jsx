/* eslint-disable no-magic-numbers */

// Help PhantomJS out
require("babel-polyfill");

import React from "react";
import { AutoDOM, constrain } from "src";
import Engine from "src/engine";
import extractLayoutProps from "src/extract-layout-props";

describe("Engine", () => {
  it("should initialize a views dictionary upon construction", () => {
    const engine = new Engine();
    expect(engine).to.have.property("views");
    expect(Object.keys(engine.views).length).to.equal(0);
  });

  it("should register a view without spacing provided", () => {
    const engine = new Engine();
    engine.registerView({
      viewName: "test",
      size: {
        width: 200,
        height: 150
      }
    });
    const view = engine.views.test;
    expect(view).to.have.property("width", 200);
    expect(view).to.have.property("height", 150);
  });

  it("should register a view with spacing provided", () => {
    const engine = new Engine();
    engine.registerView({
      viewName: "test",
      size: {
        width: 200,
        height: 150
      },
      spacing: [10]
    });
    const view = engine.views.test;
    expect(view).to.have.property("width", 200);
    expect(view).to.have.property("height", 150);
    expect(view).to.have.property("_spacing");
    expect(JSON.stringify(view._spacing))
      .to.equal(JSON.stringify([10, 10, 10, 10, 10, 10, 1]));
  });

  it("should deregister a view", () => {
    const engine = new Engine();
    engine.registerView({
      viewName: "test",
      size: {
        width: 200,
        height: 150
      },
      spacing: [10]
    });
    engine.deregisterView({ viewName: "test" });
    expect(engine).to.have.deep.property("views.test", null);
  });

  it("should set a view's spacing", () => {
    const engine = new Engine();
    engine.registerView({
      viewName: "test",
      size: {
        width: 200,
        height: 150
      },
      spacing: [10]
    });
    engine.setSpacing({
      viewName: "test",
      spacing: [20]
    });

    const view = engine.views.test;
    expect(view).to.have.property("_spacing");
    expect(JSON.stringify(view._spacing))
      .to.equal(JSON.stringify([20, 20, 20, 20, 20, 20, 1]));
  });

  it("should set a view's width and height", () => {
    const engine = new Engine();
    engine.registerView({
      viewName: "test",
      size: {
        width: 200,
        height: 150
      }
    });

    engine.setSize({
      viewName: "test",
      size: {
        width: 300,
        height: 200
      }
    });

    const view = engine.views.test;
    expect(view).to.have.property("width", 300);
    expect(view).to.have.property("height", 200);
  });

  it("should initialize subviews from extracted component props", () => {
    const engine = new Engine();
    engine.registerView({
      viewName: "test",
      size: {
        width: 200,
        height: 150
      }
    });

    const element = (
      <AutoDOM.div
        name="testSubview"
        intrinsicWidth={200}
        intrinsicHeight={100}
        constraints={[
          constrain().subview("testSubview").centerX
            .to.equal.superview.centerX
        ]}
      >
        <p>test</p>
      </AutoDOM.div>
    );
    const layoutProps = extractLayoutProps(element);
    const subviews = engine.initializeSubviews({
      viewName: "test",
      layoutProps
    });
    const { testSubview } = subviews;
    const { layout } = testSubview;

    // There aren't values we can assert on here;
    // just assert that the properties exist
    expect(layout).to.have.property("width");
    expect(layout).to.have.property("height");
    expect(layout).to.have.property("top");
    expect(layout).to.have.property("right");
    expect(layout).to.have.property("bottom");
    expect(layout).to.have.property("left");
  });

  it("should add constraints to the view", () => {
    const engine = new Engine();
    engine.registerView({
      viewName: "test",
      size: {
        width: 200,
        height: 150
      }
    });

    const subviews = engine.addConstraints({
      viewName: "test",
      constraints: [
        constrain().subview("testSubview").centerX
          .to.equal.superview.centerX.build()
      ]
    });

    const { layout } = subviews.testSubview;

    expect(layout).to.have.property("width");
    expect(layout).to.have.property("height");
    expect(layout).to.have.property("top");
    expect(layout).to.have.property("right");
    expect(layout).to.have.property("bottom");
    expect(layout).to.have.property("left");
  });

  it("should add intrinsic width and height to a subview", () => {
    const engine = new Engine();
    engine.registerView({
      viewName: "test",
      size: {
        width: 200,
        height: 150
      }
    });

    engine.addConstraints({
      viewName: "test",
      constraints: [
        constrain().subview("testSubview").centerX
          .to.equal.superview.centerX.build()
      ]
    });

    const subviews = engine.addIntrinsics({
      viewName: "test",
      name: "testSubview",
      intrinsics: {
        intrinsicWidth: 50,
        intrinsicHeight: 20
      }
    });
    const { layout } = subviews.testSubview;

    expect(layout).to.have.property("width", 50);
    expect(layout).to.have.property("height", 20);
  });
});

