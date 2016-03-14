/* eslint-disable no-magic-numbers */

// Help PhantomJS out
require("babel-polyfill");

import { constrain } from "src";

describe("Constraint builder", () => {
  it("should create a simple subview -> superview equality", () => {
    const constraint = constrain().subview("test").width
      .to.equal.superview.width.build();
    expect(constraint).to.have.deep.property("view1", "test");
    expect(constraint).to.have.deep.property("attr1", "width");
    expect(constraint).to.have.deep.property("relation", "equ");
    expect(constraint).to.have.deep.property("view2", null);
    expect(constraint).to.have.deep.property("attr2", "width");
  });

  it("should create a simple subview -> subview equality", () => {
    const constraint = constrain().subview("test").width
      .to.equal.subview("otherTest").width.build();
    expect(constraint).to.have.deep.property("view1", "test");
    expect(constraint).to.have.deep.property("attr1", "width");
    expect(constraint).to.have.deep.property("relation", "equ");
    expect(constraint).to.have.deep.property("view2", "otherTest");
    expect(constraint).to.have.deep.property("attr2", "width");
  });

  it("should create a simple subview -> superview inequality", () => {
    const constraint = constrain().subview("test").height
      .to.be.lessThanOrEqualTo.superview.height.build();
    expect(constraint).to.have.deep.property("view1", "test");
    expect(constraint).to.have.deep.property("attr1", "height");
    expect(constraint).to.have.deep.property("relation", "leq");
    expect(constraint).to.have.deep.property("view2", null);
    expect(constraint).to.have.deep.property("attr2", "height");
  });

  it("should create a simple subview -> subview inequality", () => {
    const constraint = constrain().subview("test").height
      .to.be.greaterThanOrEqualTo.subview("otherTest").height.build();
    expect(constraint).to.have.deep.property("view1", "test");
    expect(constraint).to.have.deep.property("attr1", "height");
    expect(constraint).to.have.deep.property("relation", "geq");
    expect(constraint).to.have.deep.property("view2", "otherTest");
    expect(constraint).to.have.deep.property("attr2", "height");
  });

  it("should support all layout attributes", () => {
    const supportedAttributes = [
      "width", "height",
      "top", "left", "bottom", "right",
      "centerX", "centerY"
    ];

    for (const attribute of supportedAttributes) {
      const constraint = constrain().subview("test")[attribute]
        .to.equal.superview[attribute].build();

      expect(constraint).to.have.deep.property("view1", "test");
      expect(constraint).to.have.deep.property("attr1", attribute);
      expect(constraint).to.have.deep.property("relation", "equ");
      expect(constraint).to.have.deep.property("view2", null);
      expect(constraint).to.have.deep.property("attr2", attribute);
    }
  });

  it("should constrain a subview to a constant", () => {
    const constraint = constrain().subview("test").left
      .to.equal.constant(10).build();
    expect(constraint).to.have.deep.property("view1", "test");
    expect(constraint).to.have.deep.property("attr1", "left");
    expect(constraint).to.have.deep.property("relation", "equ");
    expect(constraint).to.have.deep.property("attr2", "const");
    expect(constraint).to.have.deep.property("constant", 10);
  });

  it("should constrain a superview to a constant", () => {
    const constraint = constrain().superview.left
      .to.equal.constant(20).build();
    expect(constraint).to.have.deep.property("view1", null);
    expect(constraint).to.have.deep.property("attr1", "left");
    expect(constraint).to.have.deep.property("relation", "equ");
    expect(constraint).to.have.deep.property("attr2", "const");
    expect(constraint).to.have.deep.property("constant", 20);
  });

  it("should constrain a subview attribute to a superview attribute plus a constant", () => {
    const constraint = constrain().subview("test").left
      .to.equal.superview.left.plus(30).build();
    expect(constraint).to.have.deep.property("view1", "test");
    expect(constraint).to.have.deep.property("attr1", "left");
    expect(constraint).to.have.deep.property("relation", "equ");
    expect(constraint).to.have.deep.property("view2", null);
    expect(constraint).to.have.deep.property("attr2", "left");
    expect(constraint).to.have.deep.property("constant", 30);
  });

  it("should constrain a subview attribute to a superview attribute minus a constant", () => {
    const constraint = constrain().subview("test").left
      .to.equal.superview.left.minus(30).build();
    expect(constraint).to.have.deep.property("view1", "test");
    expect(constraint).to.have.deep.property("attr1", "left");
    expect(constraint).to.have.deep.property("relation", "equ");
    expect(constraint).to.have.deep.property("view2", null);
    expect(constraint).to.have.deep.property("attr2", "left");
    expect(constraint).to.have.deep.property("constant", -30);
  });

  it("should constrain a subview attribute to a superview attribute with a multiplier", () => {
    const constraint = constrain().subview("test").left
      .to.equal.superview.left.times(2).build();
    expect(constraint).to.have.deep.property("view1", "test");
    expect(constraint).to.have.deep.property("attr1", "left");
    expect(constraint).to.have.deep.property("relation", "equ");
    expect(constraint).to.have.deep.property("view2", null);
    expect(constraint).to.have.deep.property("attr2", "left");
    expect(constraint).to.have.deep.property("multiplier", 2);
  });

  it("should constrain a subview attribute to a superview attribute with a priority", () => {
    const constraint = constrain().subview("test").left
      .to.equal.superview.left.withPriority(250).build();
    expect(constraint).to.have.deep.property("view1", "test");
    expect(constraint).to.have.deep.property("attr1", "left");
    expect(constraint).to.have.deep.property("relation", "equ");
    expect(constraint).to.have.deep.property("view2", null);
    expect(constraint).to.have.deep.property("attr2", "left");
    expect(constraint).to.have.deep.property("priority", 250);
  });
});

