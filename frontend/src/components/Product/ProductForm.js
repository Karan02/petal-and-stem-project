import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import { Form, Input, InputNumber, Select, Spin,Icon,Button,Tooltip } from "antd";
import s from "./ProductForm.css";
import debounce from "lodash/debounce";
import ProductModal from "./ProductModal";
import { MdList } from "react-icons/md";


class ProductForm extends React.Component {
  getSelectedTagsValue = selectedTags => selectedTags.map(item => item.id);

  handleSaveAs = () => {
    this.props.handleSave(true);
    this.props.form.setFieldsValue({
      ["name"]: this.props.selectedProduct.name
    });

    this.props.onNewRecipeNameChange(this.props.selectedProduct.name);
  };

  handleNameChange = e => {
    const fname = e.target.name;
    const fvalue = e.target.value;
    this.props.onNewRecipeNameChange(fvalue);
    this.props.form.setFieldsValue({
      [fname]: fvalue
    });
  };

  render() {
    const {
      changeMarkupFactor,
      markupFactor,
      handleTaxChange,
      currency,
      salesTax,
      tags,
      tagLoading,
      changeSelectedTag,
      selectedTags,
      selectedProduct,
      loading,
      getProducts,
      changeSelectedProduct,
      products,
      getProduct,
      productsLoad,
      tagsLoad,
      getTag,
      NewRecipeName,
      selectedRecipeName,
      onNewRecipeNameChange,
      onSelectedRecipeNameChange,
      openProductsModal,
      productsModal,
      onSave
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    let RecipeName = [];
    if (selectedProduct) {
      if (selectedProduct.name) {
        if (selectedProduct.name === undefined) {
          RecipeName = [];
        } else {
          RecipeName = selectedProduct.name;
        }
      } else {
        RecipeName = [];
      }
    } else {
      RecipeName = [];
    }

    if (
      !!selectedProduct &&
      !onSave &&
      this.props.form.getFieldsValue(["name"]).name !== ""
    ) {
      this.props.form.setFieldsValue({
        ["name"]: ""
      });
    }
    return (
      
      <Form hideRequiredMark className={s.form}>
        <Form.Item className={s.addNewProductRow} help="">
        {/* <div className={s.spaceBetween}> */}
          {/* <div className={s.ingredientsLabel}>
            <div>
              <label className={s.labels}>Select Recipe</label>
            </div>
          </div> */}
          {/* <div className={s.downloadRecipe}>
          <Tooltip title="Download Recipes">
            <Button onClick={() => {}} shape="circle">
              <Icon type="download" />
            </Button>
        </Tooltip>
          </div> */}
        {/* </div> */}
          <div className={s.flexDisplay}>
            <div>
              <a onClick={openProductsModal} className={s.listBtn}>
                <MdList className={s.listIcon} />
              </a>
            </div>
            {getFieldDecorator("product", {
              validateTrigger: ["onSelect"],
              initialValue: selectedProduct
                ? `${selectedProduct.id}`
                : undefined
              // rules: [
              //   {required: true},
              // ],
            })(
              <div className={s.containerSearchWrapper}>
                {productsModal && <ProductModal />}
                <Select
                  className={s.search}
                  disabled={onSave}
                  showSearch
                  onFocus={() => {}}
                  showSearch={true}
                  showArrow={false}
                  value={RecipeName}
                  placeholder="Select Existing Recipe"
                  notFoundContent={
                    productsLoad ? (
                      <label className={s.loadingInfo}>
                        <Spin size="small" />{" "}
                        <span className={s.loadingText}>
                          Loading Products...
                        </span>
                      </label>
                    ) : (
                      <p>No Recipe Found</p>
                    )
                  }
                  filterOption={false}
                  onSearch={search => {
                    getProducts({ search });
                  }}
                  onChange={(id,value) => {
                    onSelectedRecipeNameChange(value.props.children)
                    const newProduct = products.find(item => item.id === +id);
                    changeSelectedProduct(newProduct);
                  }}
                  onDropdownVisibleChange={e => {
                    getProduct();
                  }}
                >
                  {products.map(item => (
                    <Select.Option key={item.id}><Tooltip title={item.name}>{item.name}</Tooltip></Select.Option>
                  ))}
                 
                  { 
                    this.props.initialProductLoad && products.length ? <Select.Option key={"loader"}><label className={s.loadingInfo}>
                    <Spin size="small" />{" "}
                    <span className={s.loadingText}>
                      Loading Products...
                    </span>
                  </label></Select.Option>:null
                  }
                
                </Select>
              </div>
            )}
          </div>
        </Form.Item>
        <a
          onClick={() => this.handleSaveAs()}
          className={selectedProduct && !onSave ? s.showSaveAs : s.hideClass}
        >
          Save as
        </a>
        <span className={s.seperatorText}>OR</span>
        <Form.Item
          className={s.addNewProductRow}
          label="Name your new recipe"
          help=""
        >
          {/* <label className={s.labels}>Add New Product:</label> */}
          {getFieldDecorator("name", {
            // initialValue: ''
            // validateTrigger: ["onChange"],
            // rules: [
            //   {required: true},
            // ],
          })(
            <Input
              disabled={!!selectedProduct && !onSave}
              className={s.name}
              name={"recipeName"}
              placeholder={"Name your new recipe"}
              value={NewRecipeName}
              // onChange={onNewRecipeNameChange}
              onChange={this.handleNameChange}
            />
          )}
        </Form.Item>
        <hr className={s.seperatorLine} />
        <Form.Item className={s.row} help="" label="Add to Categories">
          {/* <label className={s.labels}>Category:</label> */}
          <Select
            className={s.selectCategory}
            allowClear
            value={
              selectedTags ? this.getSelectedTagsValue(selectedTags) : undefined
            }
            mode="multiple"
            size="default"
            placeholder="Add to categories"
            notFoundContent={
              tagsLoad ? (
                <label className={s.loadingInfo}>
                  <Spin size="small" />{" "}
                  <span className={s.loadingText}>Loading Categories...</span>
                </label>
              ) : (
                <p>No Categories Found</p>
              )
            }
            onChange={(ids, options) => {
              const newTags = tags.filter(item => ids.indexOf(item.id) > -1);
              changeSelectedTag(newTags);
            }}
            onDropdownVisibleChange={() => {
              getTag();
            }}
          >
            {tags.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* <label className={s.labels}>Tax:</label> */}
        <Form.Item
          className={(s.row, s.taxWithMarkup)}
          style={{ width: "50%" }}
          label="Tax:"
          help=""
          style={{ display: "inline-block" }}
        >
          <InputNumber
            value={salesTax}
            className={s.salesTax}
            placeholder="Tax"
            onChange={value => handleTaxChange(value, currency)}
          />
          <span className={s.percentSign}>%</span>
        </Form.Item>
        {/* <label className={s.labels}>Markup Factor:</label> */}
        <Form.Item
          label="Markup Factor:"
          className={(s.row, s.taxWithMarkup)}
          help=""
          style={{ display: "inline-block", width: "50%" }}
        >
          {getFieldDecorator("markup_factor", {
            initialValue: markupFactor,
            rules: [{ required: true }]
          })(
            <InputNumber
              onChange={e => changeMarkupFactor(e)}
              className={s.markupFactor}
              placeholder={"Profit Factor"}
            />
          )}
        </Form.Item>
      </Form>
       
        
    );
  }
}



export default Form.create()(withStyles(s)(ProductForm))
