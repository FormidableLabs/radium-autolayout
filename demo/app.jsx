/* eslint-env browser */
/* eslint-disable new-cap,no-magic-numbers */
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import ConstraintLayout, { View, Subview, AutoDOM, constrain } from "../src/index.js";

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
        right: this.props.layout.right || 0,
        bottom: this.props.layout.bottom || 0,
        left: this.props.layout.left || 0
      }}
      >
        <p>What time is it?</p>
      </div>
    );
  }
}
const SubRectangle = Subview(Rectangle);

class App extends Component {
  render() {
    return (
      <ConstraintLayout>
        <View
          name="main"
          container="div"
          width={400}
          height={250}
        >
          <AutoDOM.div
            name="autobot"
            intrinsicWidth={100}
            intrinsicHeight={100}
            constraints={[
              constrain().subview("autobot").centerX.to.equal.superview.centerX
            ]}
          >
            <p>demo</p>
            <p>time!</p>
          </AutoDOM.div>
          <SubRectangle
            name="rectangle"
            intrinsicWidth={20}
            intrinsicHeight={20}
            constraints={[
              constrain().subview("rectangle").centerX.to.equal.superview.centerX,
              constrain().subview("rectangle").left.to.equal.superview.left.minus(40),
              constrain().subview("rectangle").right.to.equal.superview.right.plus(60),
              constrain().subview("rectangle").top.to.equal.superview.top.plus(100),
              constrain().subview("rectangle").bottom.to.equal.superview.bottom.plus(120)
            ]}
          />
        </View>
      </ConstraintLayout>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));
