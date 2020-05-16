import React from "react";
import {Modal,Button,Row, Col,Input} from "antd";
import {connect} from "react-redux";
import {closeSupplierModal,submitSupplier,getSuppliers} from "../../reducers/rawMaterials";

class SupplierModal extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      disable:true,
      name:"",
      contact:"",
      email:"",
      website:"",
      country:""
    }
  }

  handleOk = () => {
    let newObj = {
      name:this.state.name,
      contact:this.state.contact,
      email:this.state.email,
      website:this.state.website,
      country:this.state.country 
    }
    this.props.submitSupplier(newObj)
    this.setState({disable:true,
      name:"",
      contact:"",
      email:"",
      website:"",
      country:""})
  
      this.props.closeSupplierModal();
  }

  render(){
    if(this.state.name !== ""
    //  && this.state.contact !== "" && this.state.email !== "" && this.state.website !== "" && this.state.country !== ""
      && this.state.disable == true){
      this.setState({disable:false})
    }
    if((this.state.name == "" 
    // || this.state.contact == "" || this.state.email == "" || this.state.website == "" || this.state.country == ""
    ) && this.state.disable == false){
      this.setState({disable:true})
    }
    return(
      // <Modal
      // destroyOnClose={true}
      // visible={this.props.supplierModalOpened}
      // bodyStyle={{height:300}}
      // title={"Add Supplier"}
      // onCancel={this.props.closeSupplierModal}
      // footer={
      //   <React.Fragment>
      //     <Button key="cancel" onClick={this.props.closeSupplierModal}>
      //       Cancel
      //     </Button>
      //     <Button
      //       key="ok"
      //       type="primary"
      //       disabled={this.state.disable}
      //       // onClick={this.ok}
      //     >
      //       Add
      //     </Button>
      //   </React.Fragment>
      // }
      // >
      // <p className={"belowSpace"}><Col span={12}><label>Name:</label></Col><Col span={12}><span className="add-ingredient-width"><Input type="text" value={this.state.name} onChange={(e) => this.setState({name:e.target.value})}/></span></Col></p>
      // <p className={"belowSpace"}><Col span={12}><label>Contact:</label></Col><Col span={12}><span className="add-ingredient-width"><Input type="text" value={this.state.contact} onChange={(e) => this.setState({contact:e.target.value})}/></span></Col></p>
      // <p className={"belowSpace"}><Col span={12}><label>Website:</label></Col><Col span={12}><span className="add-ingredient-width"><Input type="text" value={this.state.website} onChange={(e) => this.setState({website:e.target.value})}/></span></Col></p>
      // <p className={"belowSpace"}><Col span={12}><label>Email:</label></Col><Col span={12}><span className="add-ingredient-width"><Input type="text" value={this.state.email} onChange={(e) => this.setState({email:e.target.value})}/></span></Col></p>
      // <p className={"belowSpace"}><Col span={12}><label>Country:</label></Col><Col span={12}><span className="add-ingredient-width"><Input type="text" value={this.state.country} onChange={(e) => this.setState({country:e.target.value})}/></span></Col></p>
      
      // </Modal>
      <div className="supplier-division">
        <p className={"belowSpace supplier-modal-title"}>Enter Supplier Details</p>
       <Col span={3}></Col><p className={"belowSpace"}><Col span={9}><label>Name:{<label className="asterisk-red">*</label>}</label></Col><Col span={9}><span className="add-ingredient-width"><Input type="text" value={this.state.name} onChange={(e) => this.setState({name:e.target.value})}/></span></Col><Col span={3}></Col></p>
       <Col span={3}></Col><p className={"belowSpace"}><Col span={9}><label>Contact:{/*<label className="asterisk-red">*</label>*/}</label></Col><Col span={9}><span className="add-ingredient-width"><Input type="text" value={this.state.contact} onChange={(e) => this.setState({contact:e.target.value})}/></span></Col><Col span={3}></Col></p>
       <Col span={3}></Col><p className={"belowSpace"}><Col span={9}><label>Website:{/*<label className="asterisk-red">*</label>*/}</label></Col><Col span={9}><span className="add-ingredient-width"><Input type="text" value={this.state.website} onChange={(e) => this.setState({website:e.target.value})}/></span></Col><Col span={3}></Col></p>
       <Col span={3}></Col><p className={"belowSpace"}><Col span={9}><label>Email:{/*<label className="asterisk-red">*</label>*/}</label></Col><Col span={9}><span className="add-ingredient-width"><Input type="text" value={this.state.email} onChange={(e) => this.setState({email:e.target.value})}/></span></Col><Col span={3}></Col></p>
       <Col span={3}></Col><p className={"belowSpace"}><Col span={9}><label>Country:{/*<label className="asterisk-red">*</label>*/}</label></Col><Col span={9}><span className="add-ingredient-width"><Input type="text" value={this.state.country} onChange={(e) => this.setState({country:e.target.value})}/></span></Col><Col span={3}></Col></p>
           <div className="suppliers-button"> <Button key="cancel" onClick={this.props.closeSupplierModal}>
             Cancel
           </Button>
           <Button
             key="ok"
             type="primary"
             disabled={this.state.disable}
              onClick={this.handleOk}
           >
             Add
           </Button> </div>
      </div>
    )
  }

}


const mapState = state =>({
  ...state.rawMaterials
})

const mapDispatch = {
  closeSupplierModal,
  submitSupplier,
  getSuppliers
}

export default connect(mapState,mapDispatch)(SupplierModal)