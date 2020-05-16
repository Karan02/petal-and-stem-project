import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Recipe.css";
import { Form, Button, Card, Select, Spin, Input } from "antd";
import {
  changeRecipeSearch,
  getRecipes,
  changeSelectedRecipe,
  openRecipesModal,
  onRecipeImportChange,
  onDownloadClick
} from "../../reducers/recipe";
import RecipesModal from "./RecipesModal";
0;

import debounce from "lodash/debounce";
import { MdList } from "react-icons/md";
import RawMaterials from "../RawMaterials/RawMaterials";
import RawMaterialsForm from "../RawMaterials/RawMaterialsForm";
import { deselectRawMaterial, saveFields } from "../../reducers/rawMaterials";
import { RecipeUploadComponent } from "./RecipeUpload";
import { openAddIngredientsModal,getCategories } from "../../reducers/rawMaterials";
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 1000);
};

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    // this.getRecipes = debounce(props.getRecipes, 800);
  }

  componentWillMount() {
    // TODO get initial list of popular recipes
    // this.props.getRecipes();
    this.props.getCategories()
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  getRecipesFromAPI = () => {
    this.props.getRecipes();
  };

  openIngredientModal = () => {
    this.props.openAddIngredientsModal()
  }

  render() {
    const {
      recipes,
      loading,
      selectedRecipe,
      changeSelectedRecipe,
      openRecipesModal,
      recipesModalOpened,
      selectedRawMaterials,
      deselectRawMaterial,
      prices,
      currency,
      currencies,
      error,
      formRef,
      onSubmit,
      fields,
      saveFields,
      onRecipeImportChange,
      onDownloadClick,
      selectedFileList
    } = this.props;
    const tabList = [
      {
        key: "Step 1: Add all recipe ingredients",
        tab: "Step 1: Add all recipe ingredients"
      }
    ];

    return (
      <Card
        className={s.container}
        title="Blend Ingredients"
        bodyStyle={
          this.state.width > 850
            ? { minHeight: "558px" }
            : { minHeight: "auto" }
        }
        tabList={tabList}  
        extra={<div className={s.ingredientsLabel}>
        {
          <RecipeUploadComponent
            onRecipeImportChange={onRecipeImportChange}
            onDownloadClick={onDownloadClick}
            selectedFileList={selectedFileList}
            dummyRequest={dummyRequest}
            openAddIngredientsModal={this.openIngredientModal}
          />
        }
      </div>}      
      >
        {/* <div className={s.recipeSearchWrapper}>
          <a onClick={openRecipesModal} className={s.listBtn}>
            <MdList className={s.listIcon}/>
          </a>
          {recipesModalOpened && <RecipesModal/>}
          <Select
            showSearch
            allowClear
            value={selectedRecipe ? `${selectedRecipe.id}` : undefined}
            className={s.recipeSearch}
            placeholder='Search'
            notFoundContent={loading.recipes ? <Spin size='small'/> : null}
            filterOption={false}
            onSearch={(search) => this.getRecipes({search})}
            onChange={(id) => {
              const newRecipe = recipes.find(item => item.id === +id)
              changeSelectedRecipe(newRecipe)
            }}
          >
            {recipes.map(item =>
              <Select.Option key={item.id}>{item.name}</Select.Option>
            )}
          </Select>
        </div> */}
        {/* <div className={s.rborder}> */}
        <Form hideRequiredMark className={s.rawMaterialsForm}>
          {/* <p className={s.labelExplanation}>
            Step 1: Add all recipe ingredients
          </p> */}
          <Form.Item className={s.idWrapper}>
            
            <RawMaterials getRecipesFromAPI={this.getRecipesFromAPI} />
          </Form.Item>

          <Form.Item className={s.idWrapper}>
            {/* <div className={s.divider}>{selectedRecipe ? 'Edit Recipe Name' : 'Edit Recipe Name'}</div>         */}
            <RawMaterialsForm
              ref={formRef}
              prices={prices}
              currency={currency}
              currencies={currencies}
              error={error}
              loading={loading.prices}
              selectedRawMaterials={selectedRawMaterials}
              deselectRawMaterial={deselectRawMaterial}
              fields={fields}
              saveFields={saveFields}
              selectedRecipe={selectedRecipe}
            />
          </Form.Item>
        </Form>

        {/* </div> */}
      </Card>
    );
  }
}

const mapState = state => ({
  ...state.recipe,
  selectedRawMaterials: state.rawMaterials.selectedRawMaterials,
  fields: state.rawMaterials.fields,
  currency: state.global.currency,
  currencies: state.global.currencies
});

const mapDispatch = {
  getRecipes,
  changeRecipeSearch,
  changeSelectedRecipe,
  openRecipesModal,
  deselectRawMaterial,
  saveFields,
  onRecipeImportChange,
  onDownloadClick,
  openAddIngredientsModal,
  getCategories
};

export default connect(mapState, mapDispatch)(withStyles(s)(Recipe));
