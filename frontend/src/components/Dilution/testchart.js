import React from "react";
import ReactSpeedometerManual from "./speedometer";

class TestChart extends React.Component {
  render() {
    const percent =
      this.props.percent < 100 ? this.props.percent.toFixed(2) : 100;
    return (
      <div>
        <ReactSpeedometerManual
          maxValue={100}
          value={percent}
          width={250}
          height={150}
          needleColor="steelblue"
          needleTransitionDuration={4000}
          needleTransition="easeElastic"
          segments={5}
          labelFontSize="16px"
          valueTextFontSize="16px"
          paddingHorizontal={17}
          paddingVertical={17}
          customSegmentStops={[0, 3, 10, 20, 100]}
          segmentColors={[
            "#4DD231",
            // "#6AD72E",
            // "#8BDC2A",
            // "#AEE229",
            // "#D4E726",
            // "#EDDC23",
            "#F1BA21",
            // "#F6961F",
            "#FA701C",
            "#ff0000"
          ]}
        />
      </div>
    );
  }
}
export default TestChart;
