/* eslint-disable new-cap,no-unused-expressions */
import React from "react";
import ConstraintLayout, { AutoDOM, constrain, Superview } from "src";
import { mount } from "enzyme";

describe("ConstraintLayout component", () => {
  it("should instantiate a LayoutClient", () => {
    const result = mount(
      <ConstraintLayout>
        <Superview
          name="main"
          container="div"
          width={400}
          height={250}
        />
      </ConstraintLayout>
    );
    const client = result.node.client;
    expect(client.workers).to.be.an("array");
    expect(client.views).to.be.an("object");
    expect(Object.keys(client.views)).to.have.lengthOf(1);
    expect(
      Object.keys(client.views)
        .every((key) => key.indexOf("main") !== -1)
    ).to.be.true;
  });
});

describe("Superview component", () => {
  it("should create a container from a tag name and dimensions", () => {
    const result = mount(
      <ConstraintLayout>
        <Superview
          name="main"
          container="div"
          width={400}
          height={250}
        />
      </ConstraintLayout>
    );
    const view = result.find(Superview);
    const container = view.find("div");
    expect(container.length).to.equal(1);
    expect(container.node.style.width).to.equal("400px");
    expect(container.node.style.height).to.equal("250px");
  });

  it("should layout subviews correctly when using multiple superviews", () => {
    const superviews = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
      const superviewName = `main-${index}`;
      const subviewName = `paragraph-lol-${index}`;
      return (
        <Superview
          key={index}
          name={superviewName}
          container="div"
          width={400}
          height={250}
        >
          <AutoDOM.div
            name={subviewName}
            intrinsicWidth={100}
            intrinsicHeight={100}
            constraints={[
              constrain.subview(subviewName).centerX
                .to.equal.superview.centerX,
              constrain.subview(subviewName).centerY
                .to.equal.superview.centerY
            ]}
          >
            <p>I'm a paragraph lol</p>
          </AutoDOM.div>
        </Superview>
      );
    });
    const result = mount(
      <ConstraintLayout>
        {superviews}
      </ConstraintLayout>
    );

    const client = result.node.client;
    expect(client.workers).to.be.an("array");
    expect(client.views).to.be.an("object");
    expect(Object.keys(client.views))
      .to.have.lengthOf(superviews.length);
    expect(
      Object.keys(client.views)
        .every((key) => key.indexOf("main") !== -1)
    ).to.be.true;
  });
});
