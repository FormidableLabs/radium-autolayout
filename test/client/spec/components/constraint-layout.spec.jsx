/* eslint-disable new-cap,no-magic-numbers */
import React from "react";
import ConstraintLayout, { View } from "src";
import { mount } from "enzyme";

describe("ConstraintLayout component", () => {
  it("should instantiate a LayoutClient", () => {
    const result = mount(
      <ConstraintLayout>
        <View
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
    expect(client.views).to.have.property("main");
  });
});

describe("View component", () => {
  it("should create a container from a tag name and dimensions", () => {
    const result = mount(
      <ConstraintLayout>
        <View
          name="main"
          container="div"
          width={400}
          height={250}
        />
      </ConstraintLayout>
    );
    const view = result.find(View);
    const container = view.find("div");
    expect(container.length).to.equal(1);
    expect(container.node.style.width).to.equal("400px");
    expect(container.node.style.height).to.equal("250px");
  });
});
