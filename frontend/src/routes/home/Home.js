import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
// import GaugeChart from 'react-gauge-chart';
import s from "./Home.css";
import { Col, Icon, Layout, Row, message } from "antd";
import Recipe from "../../components/Recipe/Recipe";
import Container from "../../components/Container/Container";
import Product from "../../components/Product/Product";
import Dilution from "../../components/Dilution/Dilution";
import PieChart from "../../components/PieChart/Piechart";
import {
  addProduct,
  getProducts,
  updateProduct,
  changeProductExistStatus,
  clear as clearProduct
} from "../../reducers/product";
import {
  addRecipe,
  updateRecipe,
  clear as clearRecipe
} from "../../reducers/recipe";
import {
  addContainer,
  updateContainer,
  clear as clearContainer
} from "../../reducers/container";
import { clear as clearRawMaterials } from "../../reducers/rawMaterials";
import { clear as clearComponents } from "../../reducers/components";
import { withCurrency } from "../../components";
import { Footer } from "../../components";

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      siderCollapsed: true,
      failToSave:false,
      failedRecipeName:""
    };

    this.recipeForm = React.createRef();
    this.containerForm = React.createRef();
    this.productForm = React.createRef();
    this.submitProductForm  = this.submitProductForm.bind(this)
  }

  onSiderCollapse = siderCollapsed => {
    this.setState({ siderCollapsed });
  };

  resetFailuretoSave = () => {
    this.setState({
      failToSave:false,
      failedRecipeName:""
    })
  }

  saveProduct = async (
    formAction,
    productValues,
    recipeValues,
    containerValues
  ) => {
    const {
      selectedRecipe,
      addRecipe,
      updateRecipe,
      selectedContainer,
      addContainer,
      updateContainer,
      selectedProduct,
      addProduct,
      updateProduct,
      getProducts,
      changeProductExistStatus
    } = this.props;
    // const nameFound = await Promise.all([getProducts({name:productValues.name,found:true})])
    // if(this.props.productExist){
    //   message.error("Recipe already Existingwsss, Please change the name of recipe");
    //   this.props.changeProductExistStatus(false);
    //   return
    // }
   
    
   
    
    if(formAction !== "saveAs"){
      await Promise.all([
      selectedRecipe ? updateRecipe(recipeValues) : addRecipe(recipeValues),
      selectedContainer
        ? updateContainer(containerValues)
        : addContainer(containerValues)
    ]);}
    // then save product
    if(formAction === "update") updateProduct(productValues)
    else if(formAction === "add") addProduct(productValues)
    else if(formAction === "saveAs"){
      await Promise.all([addRecipe(recipeValues),addContainer(containerValues)])
      addProduct(productValues)
    }
       
      
  };

  submitProductForm = formAction => {
    this.productForm.current.validateFields((err, productValues) => {
      if (!err) {
        this.recipeForm.current.validateFields((err, recipeValues) => {
          if (!err) {
            this.containerForm.current.validateFields(
              (err, containerValues) => {
                if (!err) {
                  this.saveProduct(
                    formAction,
                    productValues,
                    recipeValues,
                    containerValues
                  );
                }else{
                  
                  this.setState({failToSave:true,failedRecipeName:productValues.name})
                  
                }
              }
            );
          }else{
            this.setState({failToSave:true,failedRecipeName:productValues.name})
            
          }
        });
      }else{
        this.setState({failToSave:true,failedRecipeName:productValues.name})
        
      }
    });
  };

  // submitRecipeForm = (formAction) => {
  //   this.recipeForm.current.validateFields((err, values) => {
  //     const {addRecipe, updateRecipe} = this.props
  //     if (!err) {
  //       formAction === 'update' ? updateRecipe(values) : addRecipe(values)
  //     }
  //   })
  // }

  // submitContainerForm = (formAction) => {
  //   this.containerForm.current.validateFields((err, values) => {
  //     const {addContainer, updateContainer} = this.props
  //     if (!err) {
  //       formAction === 'update' ? updateContainer(values) : addContainer(values)
  //     }
  //   })
  // }

  clearForms = () => {
    this.recipeForm.current.resetFields();
    this.containerForm.current.resetFields();
    this.productForm.current.resetFields();
    this.props.clearRecipe();
    this.props.clearContainer();
    this.props.clearProduct();
    this.props.clearRawMaterials();
    this.props.clearComponents();
  };

  render() {
    const { siderCollapsed } = this.state;
    const { totalPrice, currency } = this.props;

    return (
      <Layout hasSider className={s.container}>
        <Layout.Content className={s.contentWrapper}>
          <div className={s.content}>
            <Row type="flex" gutter={16}>
              <Col xs={24} xl={12} className={s.widthSetter}>
                <Recipe
                  formRef={this.recipeForm}
                  onSubmit={this.submitRecipeForm}
                />
              </Col>
              <Col xs={24} xl={12} className={s.widthSetter}>
                
                {/* <GaugeChart id="gauge-chart2"
                  nrOfLevels={20}
                  percent={0.86}
                /> */}
                <Container
                  formRef={this.containerForm}
                  onSubmit={this.submitContainerForm}
                />
                <Dilution />
                <PieChart />
              </Col>
              {/* <Col xs={24} xl={12} className={s.widthSetter}>
                 <Container
                  formRef={this.containerForm}
                  onSubmit={this.submitContainerForm}

                />
              </Col> */}
              {/* edited below */}
              <Col xs={24} xl={12} className={s.widthSetter}>
                <Product
                  formRef={this.productForm}
                  clearForms={this.clearForms}
                  failToSave={this.state.failToSave}
                  onSubmit={this.submitProductForm}
                  failedRecipeName={this.state.failedRecipeName}
                  resetFailuretoSave={this.resetFailuretoSave}
                />
              </Col>
              {/* edited above */}
            </Row>
          </div>
          <Footer />
        </Layout.Content>
        {/* <Layout.Sider
          width={'320px'}
          className={s.sider}
          breakpoint='md'
          collapsedWidth={0}
          onCollapse={this.onSiderCollapse}
          trigger={null}
          collapsible
          collapsed={siderCollapsed}
          theme='light'
        >
          <a
            className={s.siderTrigger}
            onClick={() => this.onSiderCollapse(!siderCollapsed)}
          >
            {siderCollapsed ? (
              totalPrice ? withCurrency(currency, totalPrice.wholesale_price[currency.key]) : <Icon type='experiment' theme='outlined'/>
            ) : (
              <Icon type='close'/>
            )}
          </a>
           <Product
            formRef={this.productForm}
            clearForms={this.clearForms}
            onSubmit={this.submitProductForm}
          />
        </Layout.Sider> */}
      </Layout>
    );
  }
}

const mapState = state => ({
  selectedProduct: state.product.selectedProduct,
  totalPrice: state.product.totalPrice,
  selectedRecipe: state.recipe.selectedRecipe,
  selectedContainer: state.container.selectedContainer,
  currency: state.global.currency,
  productExist:state.product.productExist
});

const mapDispatch = {
  addProduct,
  updateProduct,
  clearProduct,
  addRecipe,
  updateRecipe,
  clearRecipe,
  addContainer,
  updateContainer,
  clearContainer,
  clearRawMaterials,
  clearComponents,
  getProducts,
  changeProductExistStatus
};

export default connect(
  mapState,
  mapDispatch
)(withStyles(s)(Home));
