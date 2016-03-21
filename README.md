# Radium Constraints [![Build Status](https://travis-ci.org/FormidableLabs/radium-constraints.svg?branch=master)](https://travis-ci.org/FormidableLabs/radium-constraints) [![Coverage Status](https://coveralls.io/repos/github/FormidableLabs/radium-constraints/badge.svg?branch=master)](https://coveralls.io/github/FormidableLabs/radium-constraints?branch=master)

Radium Constraints introduces the power of constraint-based layout to React. Declare simple relationships between your visual components and let the constraint solver generate the optimum layout.

Radium Constraints handles DOM and SVG elements and is the perfect alternative to manual layout when building SVG data visualizations. Radium Constraints is the bedrock for exciting new enhancements to [Victory](https://github.com/FormidableLabs/victory).

## Pre-alpha
This library is still incubating and is not yet ready for production use. See the [roadmap](#roadmap) for what's left to do before 1.0.0.

## Usage

First, ensure all components using Radium Constraints are wrapped in the top-level `<ConstraintLayout>` component:

```es6
import ConstraintLayout from "radium-constraints";

<ConstraintLayout>
  ...other components
</ConstraintLayout>
```

Next, add a `<View>` component. A `<View>` is a collection of "subviews" whose layouts relate to each other and their parent "superview". A `<View>` typically encapsulates one large visual component, like a single chart.

Views require the following props:
- `name`: for identification. We'll remove this requirement in future versions.
- `container` which element the view should use as a container (i.e. `div` for DOM and `g` for SVG).
- `width`: the initial width of the view.
- `height`: the initial height of the view.
- `style` (optional) custom styles to apply to the container node.

Here's how to set up a `<View>`:

```es6
import ConstraintLayout, { View } from "radium-constraints";

<ConstraintLayout>
  <View
    name="tutorial"
    container="div"
    width={400}
    height={500}
    style={{
      background: "red"
    }}
  >
    ...subview components
  </View>
</ConstraintLayout>
```

Finally, add subviews to your `<View>`! You can create subviews in two ways. The first, `AutoDOM` and `AutoSVG`, automatically map the bounding box of the subview to the appropriate DOM styles/SVG attributes. AutoDOM uses the bounding box to absolutely position the element. `AutoSVG` maps the bounding box to attributes like `x, y, x1, y1, cx, cy, r`, etc. on a per-element basis.

If you need more control over the usage of the bounding box in components, you can create a custom subview using the `<Subview>` higher-order component. `<Subview>` provides layout props (width, height, top, left, bottom, right) that you can map to DOM attributes or `style` props.

Both of these methods use `<Subview>` under the covers, and they require the same props:
  - `name`: the name of the subview. Allows other subviews to constrain themselves to this subview.
  - `intrinsicWidth`: the minimum width of the component before application of constraints.
  - `intrinsicHeight`: the minimum height of the component before application of constraints.
  - `constraints`: a set of constraints for this subview.

Building constraints uses a fluent DSL in the style of Chai assertions. Some constraint examples:

```es6

// These two constraints center the subview in the superview
// (the superview being the subview's parent <View> component).
constrain().subview("demo").centerX.to.equal.superview.centerX
constrain().subview("demo").centerY.to.equal.superview.centerY

// This prevents this subview from overlapping with
// another subview named "other".
constrain().subview("demo").left
  .to.be.greaterThanOrEqualTo.subview("other").right

// This prevents this subview from overflowing
// the superview's right edge.
constrain().subview("demo").right
  .to.be.lessThanOrEqualTo.superview.right
```

Here's an example of a custom component using `<Subview>`:

```es6
class Rectangle extends Component {
  static propTypes = {
    layout: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number
    })
  };

  render() {
    return (
      <div style={{
        position: "absolute",
        top: this.props.layout.top || 0,
        left: this.props.layout.left || 0
        width: this.props.layout.width || 0,
        height: this.props.layout.height || 0
      }}
      >
        <p>It's demo time!</p>
      </div>
    );
  }
}

export default Subview(Rectangle);
```

Here's how to use `AutoDOM` components:

```es6
import ConstraintLayout, { View, AutoDOM } from "radium-constraints";

<ConstraintLayout>
  <View
    name="tutorial"
    container="div"
    width={400}
    height={500}
    style={{
      background: "red"
    }}
  >
    <AutoDOM.div
      name="tutorialSubview"
      intrinsicWidth={50}
      intrinsicHeight={50}
      constraints={[
        constrain().subview("tutorialSubview").centerX
          .to.equal.superview.centerX,
        constrain().subview("tutorialSubview").centerY
          .to.equal.superview.centerY
      ]}
    >
      This is a subview
    </AutoDOM.div>
  </View>
</ConstraintLayout>
```

When using `AutoSVG` components, make sure to pass "g" instead of "div" to the `<View>`'s `container` prop.

## Demo
There are more complex examples on the demo page. Check out the code in [app.jsx](https://github.com/FormidableLabs/radium-constraints/blob/master/demo/app.jsx).

### Installation
- Install builder: `npm install -g builder`
- Clone this repo
- `npm install` and then `builder run hot` will load a webpack dev server at localhost:3000

## Caveats
React Constraints uses an asynchronous layout engine running on a pool of WebWorkers. This prevents layout calculations from bogging down the main thread and allows the library to be a good citizen in any page/app. Therefore, browsers using this library must support WebWorkers.

Resolving and incrementally adding/removing constraints are cheap enough to run in 60fps for most cases. However, the initial layout calculations on first load are the most expensive, and you may notice a slight delay in layout (although this does not block the main thread). We're working on a build tool that will pre-calculate initial layouts and feed them into your components to prevent this.

## Roadmap <a id="roadmap"></a>
In order of priority:
- Remove dependency on autolayout.js in favor of a simple wrapper around the Kiwi constraint solver.
- Create build tool to pre-calculate initial layouts.
- Decide on a distribution strategy for the WebWorker code (preference on inlining).
- Decide on an animation strategy (requires support for removing constraints).
- Allow for self-referential subviews in the constraint props array without using the subview string.
