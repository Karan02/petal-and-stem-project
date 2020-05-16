import React from "react"
import {Modal,Input,Select,Col,Checkbox,Icon,Button} from "antd"
import {connect} from "react-redux"
import {closeAddContainerModal,openSupplierModalContainer,submitComponent} from "../../reducers/container"
import { VOLUME_UNITS, MASS_UNITS, COMPONENT_UNITS } from "../../constants";
import {getSuppliers,
  clearSuppliers,
  clearSelectedSupplier,currencySearch} from "../../reducers/rawMaterials"
import SupplierModal from "./SupplierModal"
const {Option} = Select
let timeout = null
class AddContainerModal extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      name:"",
      category:[],
      categoryID:"",
      supplier:[],
      supplierID:"",
      price:0,
      ordernum: "",
      available: false,      
      size:"",
      size_unit:[],
      currency:[],
      quantity:"",
      vat_included:false,
      disable:true,
      scrollSuppliervalue: 0,
      numOfSupplierScroll: 1,
      currencySearch: "",
      supplierSearch: "",
      
    }
  }

  componentWillMount() {
    this.props.getSuppliers({ page: 1 });
    this.props.currencySearch("");

  }
  componentWillUnmount() {
    this.props.clearSuppliers();
  }
  handleSupplierScroll = e => {
    const isEndOfList = e.target.scrollTop + e.target.clientHeight+250;
    if (isEndOfList >= e.target.scrollHeight) {
      if (e.target.scrollTop !== this.state.scrollSuppliervalue) {
        let value = e.target.scrollTop;
        this.setState({
          numOfSupplierScroll: this.state.numOfSupplierScroll + 1,
          scrollSuppliervalue: value
        });
        this.props.getSuppliers({
          search: this.state.supplierSearch,
          page: this.state.numOfSupplierScroll + 1
        });
      }
    }
  }
  
  handleSupplierSearch = search => {    
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.clearSuppliers();
    this.setState({
      supplierSearch: search,
      scrollSuppliervalue: 0,
      numOfSupplierScroll: 1
      });
    this.props.getSuppliers({ search });
    }, 900);
  }

  handleAdd = () => {
    let category = []
    category.push(this.state.categoryID)
    let newObj = {
      name:this.state.name,
      category:category,
      user:this.props.userID,
      supplier:this.state.supplierID,
      price:this.state.price,
      ordernum: this.state.ordernum,
      available: this.state.available,            
      size:this.state.size,
      size_unit:this.state.size_unit,
      currency:this.state.currency,
      quantity:this.state.quantity,
      vat_included:this.state.vat_included
    }
    this.props.submitComponent(newObj);
    this.props.clearSuppliers();
    this.props.handleClose();
    this.props.closeAddContainerModal();
  }

  render(){
    
    if(this.state.name != "" && this.state.category != [] && this.state.supplier !=[] && this.state.size != "" && this.state.size_unit !=[] && this.state.currency != [] && this.state.quantity != "" && this.state.disable!=false){
      this.setState({disable:false})
    }
    if((this.state.name == "" || this.state.category == [] || this.state.supplier ==[] || this.state.size == "" || this.state.size_unit ==[] || this.state.currency == [] || this.state.quantity == "")&&this.state.disable==false){
      this.setState({disable:true})
    }
    if (Object.keys(this.props.selectedSupplier).length !== 0) {
      this.setState({
        supplier: this.props.selectedSupplier.name,
        supplierID: this.props.selectedSupplier.id
      });
      this.props.clearSelectedSupplier();
    }

    const {
      addContainerModal,
      closeAddContainerModal
    } = this.props
    const units = COMPONENT_UNITS.map((unit,index) => <Option key={unit}>{unit}</Option>);
    const suppliers = this.props.suppliers.map(supplier => (
      <Option key={supplier.id}>{supplier.name}</Option>
    ));
    const categoryOption = this.props.categories.map(unit => <Option key={unit.id}>{unit.name}</Option>);


    return(
      <Modal
      visible={addContainerModal}
      destroyOnClose={true}
      width={600}
      bodyStyle={{ height: this.props.supplierModalOpened ? 984 : 635 }}
      title={"Add Component"}
      onCancel={closeAddContainerModal}
      footer={
        <React.Fragment>
          <Button key="cancel" onClick={closeAddContainerModal}>
            Cancel
          </Button>
          <Button
            key="ok"
            type="primary"
            disabled={this.state.disable}
            onClick={this.handleAdd}
          >
            Add
          </Button>
        </React.Fragment>
      }
      >
        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">
              Name:
              <label className="asterisk-red">*</label>
            </label>
          </Col>
          <Col span={12}>
          <span className="add-ingredient-width">
              <Input
                type="text"
                placeholder="Enter Name"
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </span>
            {/* <span>
              <Select
                showSearch
                placeholder="Select Ingredient"
                onPopupScroll={this.handleScroll}
                className="add-ingredient-select"
                allowClear
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={search => {
                  this.props.clearIngredients();
                  this.setState({
                    ingredientSearch: search,
                    numOfScroll: 1,
                    scrollvalue: 0
                  });
                  this.props.getIngredients({ search });
                }}
                filterOption={false}
                value={this.state.ingredient}
                onChange={(e, value) => {
                  this.setState({ ingredient: e });
                }}
              >
                {ingre}
              </Select>
            </span> */}
          </Col>
        </p>
        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">
              Category:
              <label className="asterisk-red">*</label>
            </label>
          </Col>
          <Col span={12}>
          <span className="add-ingredient-width">
          <Select
                showSearch
                placeholder="Select Category"
                
                className="add-ingredient-select"
                allowClear
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                // onSearch={search => {
                //   this.props.clearIngredients();
                //   this.setState({
                //     ingredientSearch: search,
                //     numOfScroll: 1,
                //     scrollvalue: 0
                //   });
                //   this.props.getIngredients({ search });
                // }}
                filterOption={false}
                value={this.state.category}
                onChange={(e, value) => {
                  
                  this.setState({ category: e,categoryID:e });
                }}
              >
                {categoryOption}
              </Select>
            </span>
            {/* <span>
              <Select
                showSearch
                placeholder="Select Ingredient"
                onPopupScroll={this.handleScroll}
                className="add-ingredient-select"
                allowClear
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={search => {
                  this.props.clearIngredients();
                  this.setState({
                    ingredientSearch: search,
                    numOfScroll: 1,
                    scrollvalue: 0
                  });
                  this.props.getIngredients({ search });
                }}
                filterOption={false}
                value={this.state.ingredient}
                onChange={(e, value) => {
                  this.setState({ ingredient: e });
                }}
              >
                {ingre}
              </Select>
            </span> */}
          </Col>
        </p>
   
        {/* <p className={"belowSpace"}>
          <Col span={12}>
            <label>
              User
              <label className="asterisk-red">*</label>
            </label>
          </Col>
          <Col span={12}>
            <span className="add-ingredient-width">
              <Input
                type="text"
                value={this.state.user}
                onChange={e => this.setState({ user: e.target.value })}
              />
            </span>
          </Col>
        </p> */}
        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">Supplier
              <label className="asterisk-red">*</label>            
            </label>
          </Col>
          <Col span={11}>
            <span>
              <Select
                className="add-ingredient-select"
                placeholder="select supplier"
                onPopupScroll={this.handleSupplierScroll}
                type="text"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                showSearch
                allowClear
                notFoundContent={this.props.suppliersLoad ? "Loading...":"No Content Found"}
                value={this.state.supplier}
                onChange={e => this.setState({ supplier: e,supplierID:e })}
                onSearch={search => {
                  this.handleSupplierSearch(search)
                }}
              >
                {suppliers}
              </Select>
            </span>
          </Col>
          <Col span={1}>
            <a onClick={() => this.props.openSupplierModalContainer()}>
              <Icon type="plus-circle-o" bodyStyle={{fontSize:24}} />
            </a>
          </Col>
        </p>
        {this.props.supplierModalOpened && <SupplierModal />}
        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">
              Order Number
            </label>
          </Col>
          <Col span={12}>
            <span className="add-ingredient-width">
              <Input
                type="text"
                // min="0" 
                value={this.state.ordernum}
                onChange={e => this.setState({ ordernum: e.target.value })}
              />
            </span>
          </Col>
        </p>
        
        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">
              Purchase Price
              <label className="asterisk-red">*</label>
            </label>
          </Col>
          <Col span={12}>
            <span className="add-ingredient-width">
              <Input
                type="number"
                placeholder="Enter Price"
                min="0"
                step="0.01"
                value={this.state.price}
                onChange={e => this.setState({ price: e.target.value })}
              />
            </span>
          </Col>
        </p>
        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">
              Quantity Purchased
              <label className="asterisk-red">*</label>
            </label>
          </Col>
          <Col span={12}>
            <span className="add-ingredient-width">
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter Quantity"
                value={this.state.quantity}
                onChange={e => this.setState({ quantity: e.target.value })}
              />
            </span>
          </Col>
        </p>
        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">
             Size of 1 part<label className="asterisk-red">*</label>   
            </label>
          </Col>
          <Col span={12}>
            <span className="add-ingredient-width">
              <Input
                type="text"
                // min="0" 
                placeholder={"Size"}
                value={this.state.size}
                onChange={e => this.setState({ size: e.target.value })}
              />
            </span>
          </Col>
        </p>
        {/* <p className={"belowSpace"}>
          <label className="supplier-label">
            <Col span={12}>Organic (Biological)</Col>
            <Col span={12}>
              <span className="add-ingredient-width">
                <Checkbox
                  value={this.state.biological}
                  onChange={e =>
                    this.setState({ biological: !this.state.biological })
                  }
                />
              </span>
            </Col>
          </label>
        </p> */}

        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">
              Units of 1 part
              <label className="asterisk-red">*</label>
            </label>
          </Col>
          <Col span={12}>
            <span className="add-ingredient-width">
              <Select
                showSearch              
                className="add-ingredient-select"
                value={this.state.size_unit}
                onChange={e => this.setState({ size_unit: e })}
                placeholder="Select units"
              >
                {units}
              </Select>
            </span>
          </Col>
        </p>
        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">
              Currency
              <label className="asterisk-red">*</label>
            </label>
          </Col>
          <Col span={12}>
            <span className="add-ingredient-width">
              <Select
                className="add-ingredient-select"
                placeholder="Select Currency"
                value={this.state.currency}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                allowClear
                showSearch
                notFoundContent="not found"
                onSearch={search => {
                  this.props.currencySearch(search)
                }}
                onChange={e => this.setState({ currency: e })}
              >
                {this.props.currencies.map(currency => (
                      <Option key={currency.id}>{currency.key}</Option>
                ))}
              </Select>
            </span>
          </Col>
        </p>
        <p className={"belowSpace"}>
          <label className="supplier-label">
            <Col span={12}>Sales Tax Included (VAT)</Col>
            <Col span={12}>
              <span className="add-ingredient-width">
                {" "}
                <Checkbox
                  value={this.state.vat_included}
                  onChange={e => this.setState({ vat_included: !this.state.vat_included })}
                />
              </span>
            </Col>
          </label>
        </p>
      </Modal>
    )
  }

}

const mapState = state =>({
  ...state.container,
  currencies: state.rawMaterials.selectedCurrencies,
  categories: state.components.categories,
  suppliers:state.rawMaterials.suppliers,
  selectedSupplier:state.rawMaterials.selectedSupplier,
  suppliersLoad:state.rawMaterials.suppliersLoad,
  userID: state.user.user.id,
})
const mapDispatch = {
  closeAddContainerModal,
  currencySearch,
  openSupplierModalContainer,
  getSuppliers,
  clearSuppliers,
  clearSelectedSupplier,
  submitComponent
  
}
export default connect(mapState,mapDispatch)(AddContainerModal)