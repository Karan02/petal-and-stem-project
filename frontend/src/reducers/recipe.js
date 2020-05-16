import createReducer, { RESET_STORE } from "../createReducer";
import { getToken } from "./user";
// import config from '../config';
import qs from "query-string";
import compact from "lodash/compact";
import { message } from "antd";
import messages from "../messages";
import { changeSelectedRawMaterials, selectRawMaterials } from "./rawMaterials";
import { getTotalPrice, displayMessages } from "./product";
import { getFieldValue } from "../utils";
import { uploadHelper } from "./uploadHelper";
import { updateDilutionPercent } from "./dilution";
import { getRawMaterials,getCategories } from "./rawMaterials";


import { VOLUME_UNITS, MASS_UNITS, RAWMATERIAL_UNITS} from "../constants";

var convert = require('convert-units')
// import * as Papa from "papaparse";
import axios from "axios";
// import { OutTable, ExcelRenderer } from "react-excel-renderer";

// ------------------------------------
// Constants
// ------------------------------------
export const GET_RECIPES_REQUEST = "Recipe.GET_RECIPES_REQUEST";
export const GET_RECIPES_SUCCESS = "Recipe.GET_RECIPES_SUCCESS";
export const GET_RECIPES_FAILURE = "Recipe.GET_RECIPES_FAILURE";

export const GET_PRICES_REQUEST = "Recipe.GET_PRICES_REQUEST";
export const GET_PRICES_SUCCESS = "Recipe.GET_PRICES_SUCCESS";
export const GET_PRICES_FAILURE = "Recipe.GET_PRICES_FAILURE";

export const ADD_RECIPE_REQUEST = "Recipe.ADD_RECIPE_REQUEST";
export const ADD_RECIPE_SUCCESS = "Recipe.ADD_RECIPE_SUCCESS";
export const ADD_RECIPE_FAILURE = "Recipe.ADD_RECIPE_FAILURE";

export const UPDATE_RECIPE_REQUEST = "Recipe.UPDATE_RECIPE_REQUEST";
export const UPDATE_RECIPE_SUCCESS = "Recipe.UPDATE_RECIPE_SUCCESS";
export const UPDATE_RECIPE_FAILURE = "Recipe.UPDATE_RECIPE_FAILURE";

export const OPEN_RECIPES_MODAL = "Recipe.OPEN_RECIPES_MODAL";
export const CLOSE_RECIPES_MODAL = "Recipe.CLOSE_RECIPES_MODAL";

export const CHANGE_RECIPE_SEARCH_MODAL = "Recipe.CHANGE_RECIPE_SEARCH_MODAL";

export const CHANGE_SELECTED_RECIPE = "Recipe.CHANGE_SELECTED_RECIPE";

export const CLEAR = "Recipe.CLEAR";

export const CLEAR_SELECTED_RECIPES = "Recipe.CLEAR_SELECTED_RECIPES";

export const UPDATE_SELECTED_RECIPE = "Recipe.UPDATE_SELECTED_RECIPE";

export const DELETE_PRICE = "Recipe.DELETE_PRICE";

export const UPLOAD_ACTION = "Recipe.UPLOAD_ACTION";
export const UPLOAD_FAILURE = "Recipe.UPLOAD_FAILURE";


// ------------------------------------
// Actions
// ------------------------------------
export const getRecipes = (params = {}) => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_RECIPES_REQUEST, params });
  const { token } = dispatch(getToken());
  const { search, ordering } = getState().recipe;
  return fetch(
    `/pands/recipes/?${qs.stringify({
      search,
      ordering
    })}`,
    {
      method: "GET",
      token,
      success: res => dispatch({ type: GET_RECIPES_SUCCESS, res }),
      failure: err => dispatch({ type: GET_RECIPES_FAILURE })
    }
  );
};

const setPrices = (values,selectedRawMaterials,currencies) => {
  let prices = [];
  let dilutionArray = [];
  values.ingredients.forEach((ingredient) => {
    if(ingredient.unit === "floz"){
      ingredient.unit = "fl-oz"
    }
    if(ingredient && ingredient.quantity && ingredient.unit) {
      let priceArray = {}
      selectedRawMaterials.forEach((selectedRawMaterial) =>{
        if(ingredient.raw_material === selectedRawMaterial.raw_material.id){
          priceArray.raw_material = selectedRawMaterial.raw_material.id
          let currencyArray = {}
            let valueGram = null
          if(VOLUME_UNITS.find(element => element === ingredient.unit) || ingredient.unit === "fl-oz") {
            
              //          if(ingredient.unit === "ml"){
              // convert to ml
              let ml = convert(ingredient.quantity).from(`${ingredient.unit}`).to('ml')
              console.log("!!!!!!!!!! ",selectedRawMaterial.raw_material.raw_ingredient.name)
              console.log("!!!!!!!!!! ml = ", ml)
              valueGram = ml*parseFloat(selectedRawMaterial.raw_material.raw_ingredient.density);
              console.log("!!!!!!!!!! valueGram = ", valueGram)              
          } else if(ingredient.unit === "drops") {
              valueGram = (ingredient.quantity / 30 )
          }
          else if(MASS_UNITS.find(element => element === ingredient.unit)) {             
             valueGram = convert(ingredient.quantity).from(`${ingredient.unit}`).to('g');
          } else {
          console.log("ingredient.unit",ingredient.unit,ingredient.quantity)

             valueGram = convert(ingredient.quantity).from(`${ingredient.unit}`).to('g')
             console.log("gram",valueGram)
          }
          const USD = valueGram * selectedRawMaterial.raw_material.ppu
         
          currencies.forEach((currency)=>{
            currencyArray[currency.key] = (currency.rate * USD).toFixed(2);
          })          
          priceArray.currencies = currencyArray
          dilutionArray.push({id:selectedRawMaterial.raw_material.id,
          weight:valueGram})
        }

      });
    prices.push(priceArray)
    }
  });

  return [prices,dilutionArray];  
}

export const getPrices = values => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_PRICES_REQUEST });
  const { currencies,currency } = getState().global;
  const { selectedRawMaterials }  = getState().rawMaterials;
  
  const results = setPrices(values,selectedRawMaterials,currencies,currency);
  const prices = results[0];
  const dilutionArray = results[1];
  
  dispatch(updateDilutionPercent(dilutionArray));
  dispatch({ type: GET_PRICES_SUCCESS, prices });
  dispatch(getTotalPrice());

};

export const changeRecipeSearch = () => ({ type: CHANGE_RECIPE_SEARCH_MODAL });

export const openRecipesModal = () => (dispatch, getState) => {
  dispatch({ type: OPEN_RECIPES_MODAL });
  dispatch(getRecipes());
};

export const closeRecipesModal = () => ({ type: CLOSE_RECIPES_MODAL });

export const changeSelectedRecipe = selectedRecipe => (dispatch, getState) => {
  dispatch({ type: CHANGE_SELECTED_RECIPE, selectedRecipe });
  dispatch(
    changeSelectedRawMaterials(selectedRecipe ? selectedRecipe.ingredients : [])
  );
};

export const addRecipe = values => (dispatch, getState, { fetch }) => {
  dispatch({ type: ADD_RECIPE_REQUEST });
  const { selectedRawMaterials } = getState().rawMaterials;
  
  const { currencies} = getState().global;
  const { token } = dispatch(getToken());
  const selected = selectedRawMaterials.map(item =>
    compact(values.ingredients).find(
      v => v.raw_material === item.raw_material.id
    )
  )
  return fetch(`/pands/recipes/`, {
    method: "POST",
    token,
    body: {
      // TODO move it to utils
      // to remove undefined values and set right order
      ingredients: selected,
      // name: values.name,
      currencies: currencies.map(item => item.key)
    },
    success: recipe => {
      const { recipes } = getState().recipe;
      dispatch({ type: ADD_RECIPE_SUCCESS, recipes: [...recipes, recipe] });
      dispatch(changeSelectedRecipe(recipe));
      // message.success(messages.addRecipeSuccess);
      dispatch(displayMessages(messages.addRecipeSuccess));
    },
    failure: err => {
      dispatch({ type: ADD_RECIPE_FAILURE });
      // message.error(messages.addRecipeError);
      dispatch(displayMessages(messages.addRecipeError));
    }
  });
};

const updateRecipeState = (selectedRawMaterials, values) => {
  for (
    var ingredient = 0;
    ingredient < selectedRawMaterials.length;
    ingredient++
  ) {
    for (var value = 0; value < values.ingredients.length; value++) {
      if (
        values.ingredients[value] &&
        selectedRawMaterials[ingredient].raw_material.id ===
          values.ingredients[value].raw_material
      ) {
        selectedRawMaterials[ingredient].quantity =
          values.ingredients[value].quantity;
        selectedRawMaterials[ingredient].unit = values.ingredients[value].unit;
      }
    }
  }
};


export const onRecipeImportChange = event => (dispatch, getState) => {
  let file = event.file;
  let {  selectedFileList,uid } = getState().recipe;
  const { token } = dispatch(getToken());
  const feedback = uploadHelper(event,uid,selectedFileList);
  selectedFileList = feedback[0];
  uid = feedback[1];
  dispatch({ type: UPLOAD_ACTION, selectedFileList, uid });
  if(feedback.length === 3){
    const { apiUrl } = getState().global;
    const formData = new FormData();
    formData.append("file", event.file.originFileObj, event.file.originFileObj.name);
    return fetch(apiUrl + `/pands/uploadrm/`, {      
      method: "POST",
      // token,
      headers:{
         "Authorization": 'Bearer ' + token
      },
      body: formData,
      failure: err => {
        dispatch({ type: UPLOAD_FAILURE });
        dispatch(displayMessages(messages.uploadFailure));
      }
      
    }).then(response => response.json())
    .then(parsedResponse => {
      message.success(`Ingredients uploaded successfully.`);

      dispatch(getRawMaterials());
      // dispatch(getCategories());
    });
  }
};


export const onDownloadClick = () => (dispatch, getState) => {
  const a = document.createElement('a');
  let { apiUrl } = getState().global;
   a.href = apiUrl + `/static/ingredients_template_7.xlsx`;
   a.click();
};

export const updateRecipe = values => (dispatch, getState, { fetch }) => {
  dispatch({ type: UPDATE_RECIPE_REQUEST });
  let { selectedRawMaterials } = getState().rawMaterials;
  const { token } = dispatch(getToken());
  let { selectedRecipe, recipes } = getState().recipe;
  const { currencies } = getState().global;
  updateRecipeState(selectedRawMaterials, values);
  selectedRecipe.ingredients = selectedRawMaterials;
  dispatch({ type: UPDATE_SELECTED_RECIPE, selectedRecipe });

  return fetch(`/pands/recipes/${selectedRecipe.id}/`, {
    method: "PATCH",
    token,
    body: {
      // to remove undefined values and set right order
      ingredients: selectedRawMaterials.map(item =>
        compact(values.ingredients).find(
          v => v.raw_material === item.raw_material.id
        )
      ),
      // name: values.name,
      action: "replace",
      currencies: currencies.map(item => item.key)
    },
    success: updatedRecipe => {
      dispatch({
        type: UPDATE_RECIPE_SUCCESS,
        recipes: recipes.map(item =>
          item.id === updatedRecipe.id ? updatedRecipe : item
        )
      });
      // message.success(messages.updateRecipeSuccess);
      dispatch(displayMessages(messages.updateRecipeSuccess));
    },
    failure: err => {
      dispatch({ type: UPDATE_RECIPE_FAILURE });
      // message.error(messages.updateRecipeError);
      dispatch(displayMessages(messages.updateRecipeError));
    }
  });
};

export const deleteRowWithPrices = id => (dispatch, getState) => {
  let { prices } = getState().recipe;

  prices = prices.filter(property => {
    if (property.raw_material === id) {
      return false;
    }
    return true;
  });
  dispatch({ type: DELETE_PRICE, prices });
};

export const clearOnlySelectedRecipes = () => dispatch => {
  dispatch({ type: CLEAR_SELECTED_RECIPES });
};

export const clear = () => ({ type: CLEAR });

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    recipes: false,
    addingRecipe: false,
    updatingRecipe: false,
    prices: false
  },
  recipes: [],
  prices: [],
  search: undefined,
  ordering: undefined,
  filters: {},
  recipeSearch: undefined,
  recipesModalOpened: false,
  selectedRecipe: undefined,
  error: null,
  // selectedFile: null,
  selectedFileList: null,
  uid: 0
};

export default createReducer(initialState, {
  [GET_RECIPES_REQUEST]: (state, { params }) => ({
    search: params.search !== undefined ? params.search : state.search,
    ordering: params.sorter
      ? `${params.sorter.order === "descend" ? "-" : ""}${params.sorter.field}`
      : state.ordering,
    filters: params.filters || state.filters,
    loading: {
      ...state.loading,
      recipes: true
    }
  }),
  [GET_RECIPES_SUCCESS]: (state, { res: { results } }) => ({
    recipes: results,
    loading: {
      ...state.loading,
      recipes: false
    }
  }),
  [GET_RECIPES_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      recipes: false
    }
  }),
  [OPEN_RECIPES_MODAL]: (state, action) => ({
    recipesModalOpened: true
  }),
  [CLOSE_RECIPES_MODAL]: (state, action) => ({
    recipesModalOpened: false,
    search: undefined
  }),
  [CHANGE_RECIPE_SEARCH_MODAL]: (state, { recipeSearch }) => ({
    recipeSearch
  }),
  [CHANGE_SELECTED_RECIPE]: (state, { selectedRecipe }) => ({
    selectedRecipe
  }),
  [ADD_RECIPE_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      addingRecipe: true
    }
  }),
  [ADD_RECIPE_SUCCESS]: (state, { recipes }) => ({
    recipes,
    loading: {
      ...state.loading,
      addingRecipe: false
    }
  }),
  [ADD_RECIPE_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      addingRecipe: false
    }
  }),
  [UPDATE_RECIPE_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingRecipe: true
    }
  }),
  [UPDATE_RECIPE_SUCCESS]: (state, { recipes }) => ({
    recipes,
    loading: {
      ...state.loading,
      updatingRecipe: false
    }
  }),
  [UPDATE_RECIPE_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingRecipe: false
    }
  }),
  [GET_PRICES_REQUEST]: (state, action) => ({
    prices: [],
    error: null,
    loading: {
      ...state.loading,
      prices: true
    }
  }),
  [GET_PRICES_SUCCESS]: (state, { prices }) => ({
    prices,
    loading: {
      ...state.loading,
      prices: false
    }
  }),
  [GET_PRICES_FAILURE]: (state, { error }) => ({
    error,
    loading: {
      ...state.loading,
      prices: false
    }
  }),
  [UPDATE_SELECTED_RECIPE]: (state, { selectedRecipe }) => ({
    selectedRecipe
  }),
  [DELETE_PRICE]: (state, { prices }) => ({
    prices
  }),
  [UPLOAD_ACTION]: (state, { /*selectedFile,*/ selectedFileList,uid }) => ({
    // selectedFile,
    selectedFileList,
    uid
  }),
  [UPLOAD_FAILURE]: (state, { error }) => ({
    error,
  }),  
  [CLEAR_SELECTED_RECIPES]: (state, action) => ({
    prices: [],
    selectedRecipe: undefined
  }),
  [CLEAR]: (state, action) => RESET_STORE
  
});
