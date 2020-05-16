import React from "react";
import { Modal, Table } from "antd";
import {calculateOption} from "../../reducers/piechart";

class PiechartModal extends React.Component {

  componentWillMount(){
    // this.props.calculateOption(this.props.ingredients)
  }
  render() {
    const column = [
      {
        title: "Ingredients",
        key: "weight",
        width: 50,
        render: ingre => <p>{ingre}</p>
      },
      {
        title: "Weight in Grams",
        key: "action",
        width: 50,
        render: weight => <p>{weight}</p>
      }
    ];

    const arrayOptions = this.props.ingredients.filter((ingre,index) =>  index != 0)
    const array = arrayOptions.map((ingre,index) => parseFloat(ingre[1]))
    // console.log("array",array)
    let total = 0
    for(let i=0;i<array.length;i++){
      total += array[i]
    }
    const options = this.props.ingredients.map((ingre, index) =>
      index !== 0 ? (
        <div>
          <p>
            {ingre[0]} - {parseFloat(ingre[1]).toFixed(2) + " grams " + `( ${(((parseFloat(ingre[1]))/total)*100).toFixed(2)}% )`}
          </p>
        </div>
      ) : null
    );
 
    return (
      <Modal
        visible={this.props.visible}
        title={"Ingredients"}
        onCancel={this.props.closeModal}
        footer={<div>{false}</div>}
      >
        <div>
          <h2>Ingredients and their respective weight:</h2>
          {options}
        </div>
      </Modal>
    );

  }
}



export default  (PiechartModal);
