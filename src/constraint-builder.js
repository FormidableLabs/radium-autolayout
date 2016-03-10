// TODO: return a new ConstraintBuilder instead of mutating it
class ConstraintBuilder {
  constructor(leftView, leftAttr) {
    this.constraint = {
      view1: leftView,
      attr1: leftAttr
    };
  }

  equals(rightView, rightAttr) {
    this.constraint = {
      ...this.constraint,
      relation: "equ",
      view2: rightView,
      attr2: rightAttr
    };
    return this;
  }

  lessThanOrEqualTo(rightView, rightAttr) {
    this.constraint = {
      ...this.constraint,
      relation: "leq",
      view2: rightView,
      attr2: rightAttr
    };
    return this;
  }

  greaterThanOrEqualTo(rightView, rightAttr) {
    this.constraint = {
      ...this.constraint,
      relation: "geq",
      view2: rightView,
      attr2: rightAttr
    };
    return this;
  }

  constant(constant) {
    this.constraint = {
      ...this.constraint,
      relation: "equ",
      attr2: "const",
      constant
    };
    return this;
  }

  plus(constant) {
    this.constraint = {
      ...this.constraint,
      constant
    };
    return this;
  }

  minus(constant) {
    this.constraint = {
      ...this.constraint,
      constant: -constant
    };
    return this;
  }

  times(multiplier) {
    this.constraint = {
      ...this.constraint,
      multiplier
    };
    return this;
  }

  withPriority(priority) {
    this.constraint = {
      ...this.constraint,
      priority
    };
    return this;
  }

  build() {
    return this.constraint;
  }
}

export default (leftView, leftAttr) => {
  return new ConstraintBuilder(leftView, leftAttr);
};
