import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Dilution.css";
import { Button, Card, Select, Spin, Input } from "antd";
import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import ReactSpeedometer from "react-d3-speedometer";
import TestChart from "./testchart";
// import LiquidChart from 'react-liquidchart';
// import LiquidFillGauge from 'react-liquid-gauge';
class Dilution extends React.Component {
  render() {
    let percentage = 0;
    percentage = parseFloat(parseFloat(this.props.percent).toFixed(2));
    if (percentage > 100) {
      percentage = 100;
    }

    const interpolate = interpolateRgb("#32CD32", "#FF0000");
    const fillColor = interpolate(percentage / 100);
    const gradientStops = [
      {
        key: "0%",
        stopColor: color(fillColor)
          .darker(0.5)
          .toString(),
        stopOpacity: 1,
        offset: "0%"
      },
      {
        key: "50%",
        stopColor: fillColor,
        stopOpacity: 0.75,
        offset: "50%"
      },
      {
        key: "100%",
        stopColor: color(fillColor)
          .brighter(0.5)
          .toString(),
        stopOpacity: 0.5,
        offset: "100%"
      }
    ];

    return (
      <Card
        className={s.container}
        title={"Dilution Ratio"}
        bodyStyle={{ minHeight: 250, padding: "10px" }}
      >
        <div className={s.alignContent}>
          <TestChart percent={this.props.percent} />
        </div>
      </Card>
    );
  }
}

const mapState = state => ({
  // ...state.dilution,
  percent: state.dilution.percent,
  selectedRawMaterials: state.rawMaterials.selectedRawMaterials,
  fields: state.rawMaterials.fields
});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(withStyles(s)(Dilution));
