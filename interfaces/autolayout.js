declare module "autolayout" {
  declare type Relation =
    | "equ"
    | "leq"
    | "geq"

  declare type Priority =
    | 1000
    | 750
    | 250

  declare type Constraint = {
    view1?: ?string,
    attr1?: ?string,
    relation?: ?Relation,
    view2?: ?string,
    attr2?: ?string,
    constant?: ?number,
    multiplier?: ?number,
    priority?: ?Priority
  };

  declare class SubView {
    name: string;
    left: number;
    right: number;
    width: number;
    height: number;
    intrinsicWidth: number;
    intrinsicHeight: number;
    top: number;
    bottom: number;
    centerX: number;
    centerY: number;
    zIndex: number;
    type: string;

    getValue(attr: string): number;
  }

  declare class View {
    width: number;
    height: number;
    fittingWidth: number;
    fittingHeight: number;
    subViews: { [key: string]: SubView };

    constructor(options: ?{
      width?: number,
      height?: number,
      spacing?: number | Array<number>,
      constraints?: Array<Constraint>
    }): void;

    setSize(width: number, height: number): View;
    setSpacing(spacing: number | Array<number>): View;
    addConstraint(constraint: Constraint): View;
    addConstraints(constraints: Array<Constraint>): View;
  }
}

declare module "autolayout/lib/kiwi/View" {
  declare type Relation =
    | "equ"
    | "leq"
    | "geq"

  declare type Priority =
    | 1000
    | 750
    | 250

  declare type Constraint = {
    view1?: ?string,
    attr1?: ?string,
    relation?: ?Relation,
    view2?: ?string,
    attr2?: ?string,
    constant?: ?number,
    multiplier?: ?number,
    priority?: ?Priority
  };

  declare class SubView {
    name: string;
    left: number;
    right: number;
    width: number;
    height: number;
    intrinsicWidth: number;
    intrinsicHeight: number;
    top: number;
    bottom: number;
    centerX: number;
    centerY: number;
    zIndex: number;
    type: string;

    getValue(attr: string): number;
  }

  declare class View {
    width: number;
    height: number;
    fittingWidth: number;
    fittingHeight: number;
    subViews: { [key: string]: SubView };

    constructor(options: ?{
      width?: number,
      height?: number,
      spacing?: number | Array<number>,
      constraints?: Array<Constraint>
    }): void;

    setSize(width: number, height: number): View;
    setSpacing(spacing: number | Array<number>): View;
    addConstraint(constraint: Constraint): View;
    addConstraints(constraints: Array<Constraint>): View;
  }

  declare function exports(): View
}
