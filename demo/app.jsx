// @flow
/* eslint-env browser */
/* eslint-disable new-cap,no-magic-numbers */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import ConstraintLayout, { View, AutoDOM, constrain } from "../src/index.js";

type State = {
  windowWidth: ?number,
  windowHeight: ?number
}

const colors = {
  formidared: "#FF4136",
  shade1: "#CC342B",
  shade2: "#B22D26",
  shade3: "#992720",
  white: "#fff",
  black: "#2b303b"
};

const styles = {
  box: {
    color: colors.white,
    border: `2px solid ${colors.white}`,
    borderRadius: "100%",
    fontFamily: "Whitney SSm A, Whitney SSm B, Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: "36px",
    margin: 0,
    textAlign: "center"
  }
};

class App extends Component {
  state: State;

  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
  }

  resizeView() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  componentDidMount() {
    window.addEventListener(
      "resize", (event) => {
        window.requestAnimationFrame(() => {
          this.resizeView(event);
        });
      }
    );
  }

  render() {
    return (
      <ConstraintLayout>
        <View
          name="main"
          container="div"
          width={this.state.windowWidth}
          height={this.state.windowHeight}
          style={{
            background: colors.shade1
          }}
        >
          <AutoDOM.p
            name="note"
            style={{...styles.box, fontSize: "16px", border: 0}}
            intrinsicWidth={300}
            intrinsicHeight={45}
            constraints={[
              constrain().subview("note").centerX.to.equal.superview.centerX,
              constrain().subview("note").centerY.to.equal.superview.centerY
            ]}
          >
            Worst clock ever! Resize the window for full effect.
          </AutoDOM.p>
          <AutoDOM.p
            name="12"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("12").centerX.to.equal.superview.centerX,
              constrain().subview("12").top.to.equal.superview.top
            ]}
          >
            12
          </AutoDOM.p>
          <AutoDOM.p
            name="1"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("1").centerX.to.equal.superview.centerX.times(1 + 1 / 3),
              constrain().subview("1").centerY.to.equal.superview.height.times(1 / 6)
            ]}
          >
            1
          </AutoDOM.p>
          <AutoDOM.p
            name="2"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("2").centerX.to.equal.superview.centerX.times(1 + 2 / 3),
              constrain().subview("2").centerY.to.equal.superview.height.times(1 / 3)
            ]}
          >
            2
          </AutoDOM.p>
          <AutoDOM.p
            name="3"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("3").right.to.equal.superview.right,
              constrain().subview("3").centerY.to.equal.superview.centerY
            ]}
          >
            3
          </AutoDOM.p>
          <AutoDOM.p
            name="4"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("4").centerX.to.equal.superview.centerX.times(1 + 2 / 3),
              constrain().subview("4").centerY.to.equal.superview.height.times(2 / 3)
            ]}
          >
            4
          </AutoDOM.p>
          <AutoDOM.p
            name="5"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("5").centerX.to.equal.superview.centerX.times(1 + 1 / 3),
              constrain().subview("5").centerY.to.equal.superview.height.times(5 / 6)
            ]}
          >
            5
          </AutoDOM.p>
          <AutoDOM.p
            name="6"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("6").bottom.to.equal.superview.bottom,
              constrain().subview("6").centerX.to.equal.superview.centerX
            ]}
          >
            6
          </AutoDOM.p>
          <AutoDOM.p
            name="7"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("7").centerX.to.equal.superview.centerX.times(2 / 3),
              constrain().subview("7").centerY.to.equal.superview.height.times(5 / 6)
            ]}
          >
            7
          </AutoDOM.p>
          <AutoDOM.p
            name="8"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("8").centerX.to.equal.superview.centerX.times(1 / 3),
              constrain().subview("8").centerY.to.equal.superview.height.times(2 / 3)
            ]}
          >
            8
          </AutoDOM.p>
          <AutoDOM.p
            name="9"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("9").centerY.to.equal.superview.centerY,
              constrain().subview("9").left.to.equal.superview.left
            ]}
          >
            9
          </AutoDOM.p>
          <AutoDOM.p
            name="10"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("10").centerX.to.equal.superview.centerX.times(2 / 3),
              constrain().subview("10").centerY.to.equal.superview.height.times(1 / 6)
            ]}
          >
            10
          </AutoDOM.p>
          <AutoDOM.p
            name="11"
            style={styles.box}
            intrinsicWidth={50}
            intrinsicHeight={50}
            constraints={[
              constrain().subview("11").centerX.to.equal.superview.centerX.times(1 / 3),
              constrain().subview("11").centerY.to.equal.superview.height.times(1 / 3)
            ]}
          >
            11
          </AutoDOM.p>
        </View>
      </ConstraintLayout>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));
