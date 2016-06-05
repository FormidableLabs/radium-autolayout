// Not typechecking with flow (doesn't support getters yet)

import type { Constraint, Priority } from "autolayout";

class ConstraintBuilder {
  constraint: ?Constraint;
  constructor(constraint) {
    this.constraint = constraint || null;
  }

  whichSide(prop: "view" | "attr"): number {
    return this.constraint && `${prop}1` in this.constraint ? 2 : 1;
  }

  subview(name: string): ConstraintBuilder {
    const side = this.whichSide("view");
    return new ConstraintBuilder({
      ...this.constraint,
      [`view${side}`]: name
    });
  }

  get superview(): ConstraintBuilder {
    const side = this.whichSide("view");
    return new ConstraintBuilder({
      ...this.constraint,
      [`view${side}`]: null
    });
  }

  get to(): ConstraintBuilder {
    return new ConstraintBuilder(this.constraint);
  }

  get be(): ConstraintBuilder {
    return new ConstraintBuilder(this.constraint);
  }

  get equal(): ConstraintBuilder {
    return new ConstraintBuilder({
      ...this.constraint,
      relation: "equ"
    });
  }

  get lessThanOrEqualTo(): ConstraintBuilder {
    return new ConstraintBuilder({
      ...this.constraint,
      relation: "leq"
    });
  }

  get greaterThanOrEqualTo(): ConstraintBuilder {
    return new ConstraintBuilder({
      ...this.constraint,
      relation: "geq"
    });
  }

  get width(): ConstraintBuilder {
    const side = this.whichSide("attr");
    return new ConstraintBuilder({
      ...this.constraint,
      [`attr${side}`]: "width"
    });
  }

  get height(): ConstraintBuilder {
    const side = this.whichSide("attr");
    return new ConstraintBuilder({
      ...this.constraint,
      [`attr${side}`]: "height"
    });
  }

  get top(): ConstraintBuilder {
    const side = this.whichSide("attr");
    return new ConstraintBuilder({
      ...this.constraint,
      [`attr${side}`]: "top"
    });
  }

  get left(): ConstraintBuilder {
    const side = this.whichSide("attr");
    return new ConstraintBuilder({
      ...this.constraint,
      [`attr${side}`]: "left"
    });
  }

  get bottom(): ConstraintBuilder {
    const side = this.whichSide("attr");
    return new ConstraintBuilder({
      ...this.constraint,
      [`attr${side}`]: "bottom"
    });
  }

  get right(): ConstraintBuilder {
    const side = this.whichSide("attr");
    return new ConstraintBuilder({
      ...this.constraint,
      [`attr${side}`]: "right"
    });
  }

  get centerX(): ConstraintBuilder {
    const side = this.whichSide("attr");
    return new ConstraintBuilder({
      ...this.constraint,
      [`attr${side}`]: "centerX"
    });
  }

  get centerY(): ConstraintBuilder {
    const side = this.whichSide("attr");
    return new ConstraintBuilder({
      ...this.constraint,
      [`attr${side}`]: "centerY"
    });
  }

  constant(constant: number): ConstraintBuilder {
    return new ConstraintBuilder({
      ...this.constraint,
      attr2: "const",
      constant
    });
  }

  plus(constant: number): ConstraintBuilder {
    return new ConstraintBuilder({
      ...this.constraint,
      constant
    });
  }

  minus(constant: number): ConstraintBuilder {
    return new ConstraintBuilder({
      ...this.constraint,
      constant: -constant
    });
  }

  times(multiplier: number): ConstraintBuilder {
    return new ConstraintBuilder({
      ...this.constraint,
      multiplier
    });
  }

  withPriority(priority: Priority): ConstraintBuilder {
    return new ConstraintBuilder({
      ...this.constraint,
      priority
    });
  }

  build(): ?Constraint {
    return this.constraint;
  }
}

export default new ConstraintBuilder();
