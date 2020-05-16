import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import { Button, Card, Select, Spin, Input, AutoComplete } from "antd";
import Chart from "react-google-charts";
import s from "./Piechart.css";
import { connect } from "react-redux";
import PiechartModal from "./PiechartModal";

class Piechart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  handleShow = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    let total = 0;
    let pie = this.props.piechart;
    let info = this.props.piechart;

    // for (let i = 1; i < info.length; i++) {

    //         total = total + parseFloat(info[i][1]);
    // }

    // for (let i = 1; i < info.length; i++) {
    //     let label = info[i][0];
    //     let val = parseFloat(info[i][1]);
    //     let percentual = ((val / total) * 100).toFixed(1);
    //     info[i][1] = percentual
    //     info[i][0]= label
    //     //  + '-'

    //     // +' ('+ percentual + '%)'+'('+(val.toFixed(2))+' gms)';
    // }
    return (
      <Card
        className={s.container}
        title={"Blend Percentages"}
        bodyStyle={{
          position: "relative",
          minHeight: 250,
          padding: "5px",
          display: "flex",
          justifyContent: "center"
        }}
        extra={<a onClick={this.handleShow}>Show Ingredients</a>}
      >
        {this.state.modal && (
          <PiechartModal
            closeModal={this.closeModal}
            visible={this.state.modal}
            ingredients={pie}
          />
        )}
        {info.length > 1 ? (
          <Chart
            className="pieChart"
            width={"350px"}
            height={"300px"}
            chartType="PieChart"
            loader={<div>Loading Blends</div>}
            data={info.length !== 0 ? info : [["Ingredient", "weight"]]}
            options={{
              // legend:{
              //   position: 'labeled'
              // },

              chartArea: { width: "100%", height: "80%" },
              legend: {
                position: "none"

                // alignment: 'start',
              }

              //            { position: 'top', maxLines: 3 }
              // title: 'My Daily Activities',
              // is3D: true,
            }}
            rootProps={{ "data-testid": "1" }}
          />
        ) : (
          <p style={{ margin: "auto" }}>Select Ingredients from blend</p>
        )}
      </Card>
    );
  }
}

const mapState = state => ({
  // ...state.dilution,
  piechart: state.dilution.piechart
});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(withStyles(s)(Piechart));
