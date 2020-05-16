import React from "react";
import { VOLUME_UNITS, MASS_UNITS, RAWMATERIAL_UNITS } from "../../constants";
import {
  Modal,
  Button,
  Select,
  Input,
  Checkbox,
  Row,
  Col,
  Icon,
  Spin,
  Tooltip
} from "antd";
import { connect } from "react-redux";
import {
  closeAddIngredientsModal,
  getIngredients,
  openSupplierModal,
  getSuppliers,
  clearIngredients,
  submitIngredient,
  getRawMaterials,
  clearSuppliers,
  currencySearch,
  clearSelectedSupplier,
  getSpecificRawMaterials
} from "../../reducers/rawMaterials";
import s from "./AddIngredientsModal.css";
import SupplierModal from "./SupplierModal";

const { Option } = Select;
let timeout = null;
let timeout2 = null;
class AddIngredientsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredient: [],
      user: "",
      supplier: [],
      supplierID: "",
      currency: [],
      price: 0,
      ordernum: "",
      biological: false,
      vat: false,
      quantity: 0,
      available: true,
      unit: [],
      disable: true,
      numOfScroll: 1,
      scrollvalue: 0,
      scrollSuppliervalue: 0,
      numOfSupplierScroll: 1,
      currencySearch: "",
      supplierSearch: "",
      ingredientSearch: ""
    };
  }

  componentWillMount() {
    this.props.clearIngredients();
    this.props.getIngredients({ page: 1 });
    this.props.getSuppliers({ page: 1 });
    this.props.currencySearch("");
  }

  componentWillUnmount() {
    this.props.clearIngredients();
    this.props.clearSuppliers();
    // this.props.getRawMaterials();
  }

  handleAdd = () => {
    let newObject = {
      raw_ingredient: this.state.ingredient,
      supplier:
        this.state.supplierID !== ""
          ? this.state.supplierID
          : this.state.supplier,
      price: this.state.price,
      ordernum: this.state.ordernum,
      biological: this.state.biological,
      available: this.state.available,
      currency: this.state.currency,
      quantity: this.state.quantity,
      vat_included: this.state.vat,
      quantity_unit: this.state.unit
    };
    this.props.submitIngredient(newObject);
    this.props.clearIngredients();
    this.props.clearSuppliers();
    this.props.handleClose();
    this.props.closeAddIngredientsModal();
  };

  handleScroll = e => {
    const isEndOfList = e.target.scrollTop + e.target.clientHeight + 250;
    if (isEndOfList >= e.target.scrollHeight) {
      if (e.target.scrollTop !== this.state.scrollvalue) {
        let value = e.target.scrollTop;
        this.setState({
          numOfScroll: this.state.numOfScroll + 1,
          scrollvalue: value
        });
        this.props.getIngredients({
          search: this.state.ingredientSearch,
          page: this.state.numOfScroll + 1
        });
      }
    }
  };
  handleSupplierScroll = e => {
    const isEndOfList = e.target.scrollTop + e.target.clientHeight;
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
  };

  handleIngreSearch = search => {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.clearIngredients();
      this.setState({
        ingredientSearch: search,
        numOfScroll: 1,
        scrollvalue: 0
      });
      this.props.getIngredients({ search, specialSearch: true });
    }, 900);
  };

  handleSupplierSearch = search => {
    if (this.timeout2) clearTimeout(this.timeout2);
    this.timeout2 = setTimeout(() => {
      this.props.clearSuppliers();
      this.setState({
        supplierSearch: search,
        scrollSuppliervalue: 0,
        numOfSupplierScroll: 1
      });
      this.props.getSuppliers({ search });
    }, 900);
  };

  render() {
    if (
      this.state.ingredient !== [] &&
      this.state.supplier !== [] &&
      this.state.currency !== [] &&
      this.state.disable == true
    ) {
      this.setState({ disable: false });
    }

    if (
      (this.state.ingredient == [] ||
        this.state.supplier == [] ||
        this.state.currency == []) &&
      this.state.disable == false
    )
      this.setState({ disable: true });

    // const ingre =
    //   this.props.ingredients.length > 0
    //     ? this.props.ingredients.map(item => (
    //         <Option  key={item.id}><Tooltip title={<div>{item.name} ({item.latin_name})</div>}>{item.name} ({item.latin_name})</Tooltip></Option>
    //       ))
    //     : [];
    // if (this.props.ingredientsLoad)
    //   ingre.push(
    //     <Option key={"loader"}>
    //       Loading... <Spin spinning={true} />
    //     </Option>
    //   );

    const units = RAWMATERIAL_UNITS.map((unit, index) => (
      <Option key={unit}>{unit}</Option>
    ));

    // const currencyFiltered = currenyUnfiltered.filter(i => i)
    const suppliers = this.props.suppliers.map(supplier => (
      <Option title={supplier.name} key={supplier.id}>
        {supplier.name}{" "}
      </Option>
    ));

    if (this.props.suppliersLoad)
      suppliers.push(
        <Option key={"loader"}>
          Loading... <Spin spinning={true} />
        </Option>
      );

    if (Object.keys(this.props.selectedSupplier).length !== 0) {
      this.setState({
        supplier: this.props.selectedSupplier.name,
        supplierID: this.props.selectedSupplier.id
      });
      this.props.clearSelectedSupplier();
    }

    return (
      <Modal
        visible={this.props.AddIngredientsModalOpened}
        destroyOnClose={true}
        width={600}
        bodyStyle={{ height: this.props.supplierModalOpened ? 924 : 575 }}
        title={"Add Raw Material"}
        onCancel={this.props.closeAddIngredientsModal}
        footer={
          <React.Fragment>
            <Button key="cancel" onClick={this.props.closeAddIngredientsModal}>
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
        {/* <Spin spinning={this.props.ingredientsLoad || this.props.suppliersLoad}> */}

        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">
              Raw Ingredient
              <label className="asterisk-red">*</label>
            </label>
          </Col>
          <Col span={12}>
            <span>
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
                  this.handleIngreSearch(search);
                }}
                filterOption={false}
                value={this.state.ingredient}
                onChange={(e, value) => {
                  this.setState({ ingredient: e });
                }}
              >
                
                {this.props.ingredients.length > 0
                  ? this.props.ingredients.map((item,index) => (
                     
                      <Option key={item.id}>
                        {/* { console.log("index",index)} */}
                        <Tooltip
                          title={
                            <div>
                              {item.name} ({item.latin_name})
                            </div>
                          }
                        >
                          {item.name} ({item.latin_name})
                        </Tooltip>
                      </Option>
                    ))
                  : []}
                    {console.log("props.ingreload",this.props.ingredients.length)}

                {this.props.ingredientsLoad ? (
                  <Option key={"loader"}>
                    {console.log("props.ingreload",this.props.ingredients.length)}
                    Loading... <Spin spinning={true} />
                  </Option>
                ) : null}
              </Select>
            </span>
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
            <label className="supplier-label">
              Supplier
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
                showclea
                allowClear
                value={this.state.supplier}
                onChange={e => this.setState({ supplier: e })}
                notFoundContent={
                  this.props.suppliersLoad ? "Loading..." : "No Content Found"
                }
                onSearch={search => {
                  handleSupplierSearch(search);
                }}
              >
                {suppliers}
              </Select>
            </span>
          </Col>
          <Col span={1}>
            <a onClick={() => this.props.openSupplierModal()}>
              <Icon type="plus-circle-o" bodyStyle={{ fontSize: 24 }} />
            </a>
          </Col>
        </p>
        {this.props.supplierModalOpened && <SupplierModal />}
        <p className={"belowSpace"}>
          <Col span={12}>
            <label className="supplier-label">Order Number</label>
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
              Quantity Unit
              <label className="asterisk-red">*</label>
            </label>
          </Col>
          <Col span={12}>
            <span className="add-ingredient-width">
              <Select
                showSearch
                className="add-ingredient-select"
                value={this.state.unit}
                onChange={e => this.setState({ unit: e })}
                placeholder="Select units"
              >
                {units}
              </Select>
            </span>
          </Col>
        </p>
        <p className={"belowSpace"}>
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
                showSearch
                notFoundContent="not found"
                onSearch={search => {
                  this.props.currencySearch(search);
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
                  value={this.state.vat}
                  onChange={e => this.setState({ vat: !this.state.vat })}
                />
              </span>
            </Col>
          </label>
        </p>
        <p className={"belowSpace"}>
          <label>
            <Col span={12}>
              <span className="supplier-label">Important Note</span>
            </Col>
            <Col span={12}>
              <span className="add-ingredient-width add-ingre-info">
                We have given our best to provide the most comprehensive
                ingredient list. If you see an ingredient missing please contact
                us at info@petalandstem.com and your ingredient will be added
                within 24 hours. Thank you for your help in making this list
                complete!
              </span>
            </Col>
          </label>
        </p>
        {/* </Spin> */}
      </Modal>
    );
  }
}

const mapState = state => ({
  ...state.rawMaterials,
  // currencies: state.global.currencies,
  currencies: state.rawMaterials.selectedCurrencies,
  userID: state.user.user.id
});
const mapDispatch = {
  closeAddIngredientsModal,
  getIngredients,
  openSupplierModal,
  getSuppliers,
  clearIngredients,
  submitIngredient,
  getRawMaterials,
  clearSuppliers,
  currencySearch,
  clearSelectedSupplier,
  getSpecificRawMaterials
};
export default connect(mapState, mapDispatch)(AddIngredientsModal);
