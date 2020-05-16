import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Product.css";
import { Input, Button, Table, Tooltip, InputNumber, Card, Icon,message,Popconfirm } from "antd";
import ProductForm from "./ProductForm";
import { withCurrency } from "../../components";
import debounce from "lodash/debounce";

// import Pdf from "react-to-pdf";
// import jsPDF from 'jspdf';
// import html2canvas from "html2canvas";
import { changeCurrency, setInitialCurrencies} from "../../reducers/global";
//const { apiUrl } = getState().global;
import {
  changeSelectedProduct,
  getProducts,
  addProduct,
  changeMarkupFactor,
  updateProduct,
  currencyClicked,
  editRetailPrice,
  retailPriceUpdated,
  handleCategoriesChange,
  handleTaxChange,
  clearForms,
  getTags,
  changeSelectedTag,
  loadingProducts,
  loadingTags,
  deleteProduct,
  openProductsModal,
  changeInitialLoad,
  handleNotesChange,
  handleIngredientsChange,
  recipesDownloadClick,
  changeProductExistStatus  
} from "../../reducers/product";
const children = [
  "Home",
  "Health",
  "Beauty",
  "Pregnancy",
  "Kits",
  "Animals",
  "Travel",
  "Cooking"
];

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      initialProductLoad: true,
      initialTagsLoad: true,
      NewRecipeName: "",
      onSave: false,
      selectedRecipeName:"",
      
    };

    this.getProducts = debounce(props.getProducts, 800);
    this.getTags = debounce(props.getTags, 800);
    // this.setInitialCurrencies = debounce(props.setInitialCurrencies, 800);
  }



  componentWillMount() {
    // TODO get initial list of popular products
    // this.props.getProducts();
    // this.props.getTags();
    // this.props.setInitialCurrencies();
    this.props.getTags();
    this.props.setInitialCurrencies();

  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  onSelectedRecipeNameChange = (e) => {
    this.setState({
      selectedRecipeName:e,
      NewRecipeName: "",

    })

  }

  updateWindowDimensions = () =>
    this.setState({ width: window.innerWidth, height: window.innerHeight });

  fetchPrice = (item, price) => (
    <div key={item.key}>{withCurrency(item, price[item.key])}</div>
  );

  getProduct = () => {
    if (this.props.initialProductLoad) {
      this.props.loadingProducts();
      this.props.getProducts();
      // this.props.changeInitialLoad(false);
    }
  };
  getTag = () => {
    if (this.state.initialTagsLoad) {
      this.props.loadingTags();
      this.props.getTags();
      this.setState({ initialTagsLoad: false });
    }
  };
  onNewRecipeNameChange = value => {
    this.setState({
      NewRecipeName: value
    });
  };
  handleAdd = () => {
    // this.props.addProduct()
    this.props.onSubmit("saveAs");
  
    this.setState({
      NewRecipeName: "",
      onSave: false
    });
  };
  handleDelete = () => {
    this.props.clearForms(this.props.formRef);
    this.props.deleteProduct(this.props.selectedProduct.id);
  };

  handleSave = value => {
    this.setState({
      onSave: value
    });
  };


  handleSaveButton = async () => {
    let name = this.state.NewRecipeName !== "" ? this.state.NewRecipeName:this.state.selectedRecipeName
    const selected = this.props.selectedProduct
     const nameFound = await Promise.all([this.props.getProducts({name,found:true } )])
    if(this.state.selectedRecipeName === this.state.NewRecipeName || (this.props.productExist&&(
      selected.instructions == this.props.instructions &&
      selected.markup_factor == this.props.markupFactor &&
      selected.notes == this.props.notes &&
      selected.sales_tax == this.props.salesTax &&
     JSON.stringify(selected.tags.sort()) == JSON.stringify(this.props.selectedTags.sort()) &&
     selected.total_price == this.props.totalPrice

    ))){
      this.props.changeProductExistStatus(false);
      return message.error("Recipe already Existing, Please change the name of recipe");  
    }
    return this.state.onSave ? this.handleAdd() : this.props.onSubmit("update");
  }

  handlePrint = () => {
    let css = "@page { size: landscape;margin: 0; }",
      head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style");

    style.type = "text/css";
    style.media = "print";

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    try {
      document.execCommand("print", false, null);
    } catch (e) {
      window.print();
    }
    var f = navigator.userAgent.search("Firefox");
    
    if (f > -1) 
    {
      css = "@page { margin: 0; }"
//      css = "@page { size: A3;margin: 0; }"      
      window.print();}
  };
  render() {
    // console.log(this.props.productExist,"exist")
    if(this.props.failToSave){
      this.setState({NewRecipeName:this.props.failedRecipeName})
      this.props.resetFailuretoSave()
    }
    const {
      products,
      loading,
      selectedProduct,
      onSubmit,
      formRef,
      markupFactor,
      changeMarkupFactor,
      changeSelectedProduct,
      changeSelectedTag,
      selectedTags,
      currencies,
      totalPrice,
      currency,
      clearForms,
      addRetailPrice,
      currencyClicked,
      editRetailPrice,
      retailPriceUpdated,
      handleTaxChange,
      tags,
      tagLoading,
      recipesDownloadClick,
      salesTax,
      productsLoad,
      tagsLoad,
      productsModal,
      openProductsModal,
      initialProductLoad,
      notes,
      instructions,
      productExist
    } = this.props;

    const columns = [
      {
        key: "name",
        dataIndex: "name",
        width: 150,
        className: s.nameColumn
      },
      {
        key: "price",
        dataIndex: "price",
        className: s.priceColumn,
        render: (price, row) => {
          if (row.id === "retail-price" && addRetailPrice) {
            return (
              <InputNumber
                value={totalPrice.retail_price}
                onChange={value => editRetailPrice(value)}
                defaultValue={price}
                onBlur={() => retailPriceUpdated()}
              />
            );
          }
          return (
            <div onClick={() => currencyClicked(row)}>
              {withCurrency(currency, price)}
            </div>
          );
        }
      }
    ];
    let data = [];
    if (totalPrice) {
      data = [
        {
          id: "receipe",
          name: "Recipe",
          price: parseFloat(totalPrice.recipePrice).toFixed(2)
        },
        {
          id: "container",
          name: "Container",
          price: parseFloat(totalPrice.containerPrice).toFixed(2)
        },
        {
          id: "COGS (Cost of Goods Sold)",
          name: "COGS (Cost of Goods Sold)",
          price: parseFloat(totalPrice.wholesale_price).toFixed(2)
        },
        {
          id: "retail-price",
          name: "Retail Price w/o Tax",
          price: parseFloat(totalPrice.retail_price).toFixed(2)
        },
        {
          id: "Total Price w/ Tax",
          name: "Total Price w/ Tax",
          price: parseFloat(totalPrice.retail_price_with_tax).toFixed(2)
        }
      ];
    }
    const tabList = [
      {
        key: "Step 3: Price out your final product",
        tab: "Step 3: Price out your final product"
      }
    ];
    return (
      <Card
        className={s.container}
        title={"Recipe"}
        bodyStyle={
          this.state.width > 850
            ? { minHeight: "558px" }
            : { minHeight: "auto" }
        }
        extra={
          <div className={s.extra}>
          <div className={s.productextra}>
            <Tooltip title="Download Recipes">
              <Button className="buttonExtra" onClick={recipesDownloadClick} shape="circle">
                {/* <Icon className="iconExtra" type="download" /> */}
                                
                <img src={require("../../static/download.png")} height={"27px"} width={"27px"}/>
              </Button>
            </Tooltip>
          </div>
            <a
              className={s.clearOption}
              onClick={() => {
                this.setState({ onSave: false });
                clearForms(formRef);
              }}
            >
              {"Clear"}
            </a>
            <p className={s.print}>
              <Tooltip title="Print Page">
              <Button className="buttonExtra"  
              title={"Print Page"} 
              onClick={() => {
                    this.handlePrint();
                    
                  }} shape="circle">
                
                  {/* <Icon className="iconExtra" type="printer" /> */}
            <img src={require("../../static/print.png")} height={"27px"} width={"27px"} />

                
                </Button>
              </Tooltip>
            </p>
            
            <Popconfirm
          title="Are you sure you want to delete the selected recipe? Once deleted it cannot be recovered."
          onConfirm={(e) => { this.handleDelete();}}
          // onCancel={cancel}
          okText="Yes"
          placement="bottomLeft"          
          cancelText="No"
        >
            <Tooltip title="Delete Recipe">
            <Button className="buttonExtra" disabled={!selectedProduct} shape="circle">
              {!selectedProduct ? <Icon className="iconExtra" type="delete" />:<img src={require("../../static/delete.png")} height={"27px"} width={"27px"} /> }
             
              </Button>
            </Tooltip>
            </Popconfirm>
          </div>
        }
        tabList={tabList}
      >
        {/* <p className={s.labelExplanation}>
          Step 3: Price out your final product
        </p> */}
        <ProductForm
          markupFactor={markupFactor}
          initialProductLoad={initialProductLoad}
          changeMarkupFactor={changeMarkupFactor}
          ref={formRef}
          children={children}
          handleTaxChange={handleTaxChange}
          currency={currency}
          salesTax={salesTax}
          tags={tags}
          tagLoading={tagLoading}
          changeSelectedTag={changeSelectedTag}
          selectedTags={selectedTags}
          selectedProduct={selectedProduct}
          loading={loading}
          getProducts={this.getProducts}
          changeSelectedProduct={changeSelectedProduct}
          products={products}
          productsLoad={productsLoad}
          tagsLoad={tagsLoad}
          getProduct={this.getProduct}
          getTag={this.getTag}
          onNewRecipeNameChange={this.onNewRecipeNameChange}
          NewRecipeName={this.state.NewRecipeName}
          selectedRecipeName={this.state.selectedRecipeName}
          onSelectedRecipeNameChange={this.onSelectedRecipeNameChange}
          openProductsModal={openProductsModal}
          productsModal={productsModal}
          onSave={this.state.onSave}
          handleSave={this.handleSave}
          notes={notes}
          instructions={instructions}
        />
         <Input.TextArea
              // onChange={e => changeMarkupFactor(e)}
              className={s.infodetail}
              placeholder={"Instructions"}
              row={8}
              value={this.props.instructions}
              onChange={this.props.handleIngredientsChange}
            />
         <Input.TextArea
              // onChange={e => changeMarkupFactor(e)}
              className={s.infodetail}
              placeholder={"Notes"}
              row={6}
              value={this.props.notes}
              onChange={this.props.handleNotesChange}

            />
        <Table
          className={s.table}
          columns={columns}
          dataSource={data}
          loading={loading.totalPrice}
          size="small"
          rowKey={(record, i) => i}
          pagination={false}
          showHeader={false}
          locale={{ emptyText: "Total price" }}
        />

        <div className={s.actions}>
          <Button
            onClick={async () => {
              this.handleSaveButton()  
            }}
            loading={loading.updatingProduct}
            disabled={!selectedProduct}
          >
            {"Save"}
          </Button>
          <Button
            onClick={() => {
              this.setState({
                onSave: false,
                NewRecipeName: ""
              });
              // clearForms(formRef);
            }}
            loading={loading.updatingProduct}
            // disabled={!selectedProduct}
            className={
              selectedProduct && this.state.NewRecipeName !== ""
                ? null
                : s.hideClass
            }
          >
            {"Cancel"}
          </Button>
          
          <Button
            onClick={() => this.handleAdd()}
            loading={loading.addingProduct}
            disabled={selectedProduct || this.state.NewRecipeName === ""}
          >
            {"Create new"}
          </Button>
        </div>
        {/* </div> */}
      </Card>
    );
  }
}

const mapState = state => {
  return {
    ...state.product,
    state: state,
    selectedProduct: state.product.selectedProduct,
    currency: state.global.currency,
    currencies: state.global.currencies,
    selectedRawMaterials:state.rawMaterials.selectedRawMaterials,
    selectedComponents:state.components.selectedComponents
  };
};

const mapDispatch = {
  getProducts,
  addProduct,
  updateProduct,
  changeMarkupFactor,
  changeSelectedProduct,
  changeSelectedTag,
  currencyClicked,
  editRetailPrice,
  retailPriceUpdated,
  handleTaxChange,
  clearForms,
  getTags,
  loadingProducts,
  loadingTags,
  setInitialCurrencies,
  deleteProduct,
  openProductsModal,
  changeInitialLoad,
  handleNotesChange,
  handleIngredientsChange,
  recipesDownloadClick,
  changeProductExistStatus
};

export default connect(mapState, mapDispatch)(withStyles(s)(Product));
