import createReducer, { RESET_STORE } from "../createReducer";
import { getToken } from "./user";
import qs from "query-string";
import _ from "lodash";
import { message } from "antd";
import messages from "../messages";
import { getFieldValue } from "../utils";
import { PAGE_SIZE } from "../constants";
import {
  changeSelectedRecipe,
  clear as clearRecipe,
  clearOnlySelectedRecipes
} from "./recipe";
import {
  changeSelectedContainer,
  clearSelectedComponent as clearContainer
} from "./container";
// import { getContainers } from "./container";
import { clearOnlySelectedRecipes as clearRawMaterials } from "./rawMaterials";
// import { getRawMaterials } from "./rawMaterials";
import { clearSelectedComponent as clearComponents } from "./components";
import {cleardilution } from "./dilution";
// ------------------------------------
// Constants
// ------------------------------------
export const GET_PRODUCT_REQUEST = "Product.GET_PRODUCT_REQUEST";
export const GET_PRODUCT_SUCCESS = "Product.GET_PRODUCT_SUCCESS";
export const GET_PRODUCT_FAILURE = "Product.GET_PRODUCT_FAILURE";

export const GET_TAGS_REQUEST = "Product.GET_TAGS_REQUEST";
export const GET_TAGS_SUCCESS = "Product.GET_TAGS_SUCCESS";
export const GET_TAGS_FAILURE = "Product.GET_TAGS_FAILURE";

export const ADD_PRODUCT_REQUEST = "Product.ADD_PRODUCT_REQUEST";
export const ADD_PRODUCT_SUCCESS = "Product.ADD_PRODUCT_SUCCESS";
export const ADD_PRODUCT_FAILURE = "Product.ADD_PRODUCT_FAILURE";

export const UPDATE_PRODUCT_REQUEST = "Product.UPDATE_PRODUCT_REQUEST";
export const UPDATE_PRODUCT_SUCCESS = "Product.UPDATE_PRODUCT_SUCCESS";
export const UPDATE_PRODUCT_FAILURE = "Product.UPDATE_PRODUCT_FAILURE";

export const GET_TOTAL_PRICE_REQUEST = "Product.GET_TOTAL_PRICE_REQUEST";
export const GET_TOTAL_PRICE_SUCCESS = "Product.GET_TOTAL_PRICE_SUCCESS";
export const GET_TOTAL_PRICE_FAILURE = "Product.GET_TOTAL_PRICE_FAILURE";

export const OPEN_PRODUCTS_MODAL = "Product.OPEN_PRODUCTS_MODAL";
export const CLOSE_PRODUCTS_MODAL = "Product.CLOSE_PRODUCTS_MODAL";

export const CHANGE_SELECTED_PRODUCT = "Product.CHANGE_SELECTED_PRODUCT";

export const CHANGE_SELECTED_TAG = "Product.CHANGE_SELECTED_TAG";

export const CHANGE_MARKUP_FACTOR = "Product.CHANGE_MARKUP_FACTOR";

export const CHANGE_RETAIL_PRICE = "Product.CHANGE_RETAIL_PRICE";

export const EDITING_RETAIL_PRICE = "Product.EDITING_RETAIL_PRICE";

export const RETAIL_PRICE_UPDATED = "Product.RETAIL_PRICE_UPDATED";

export const CLEAR = "Product.CLEAR";


export const PRODUCT_EXIST = "Product.PRODUCT_EXIST";
export const GET_SALES_TAX_SUCCESS = "Product.GET_SALES_TAX_SUCCESS";

export const UPDATE_PRODUCT_LIST = "Product.UPDATE_PRODUCT_LIST";

export const CLEAR_FORMS = "Product.CLEAR_FORMS";

export const MODIFY_SELECTED_PRODUCT = "Product.MODIFY_SELECTED_PRODUCT";

export const SET_SELECTED_PRODUCT = "Product.SET_SELECTED_PRODUCT"

export const ADD_NEW_PRODUCT = "Product.ADD_NEW_PRODUCT";

export const UPDATE_SELECTED_PRODUCT = "Product.UPDATE_SELECTED_PRODUCT";

export const UPDATE_PRODUCT_ID = "Product.UPDATE_PRODUCT_ID";

export const CHANGE_PRODUCTSLOAD = "Product.CHANGE_PRODUCTSLOAD";

export const LOADING_PRODUCT = "Product.LOADING_PRODUCT";

export const LOADING_TAGS = "Product.LOADING_TAGS"

export const UPDATE_NOTES = "Product.UPDATE_NOTES"

export const UPDATE_INSTRUCTIONS = "Product.UPDATE_INSTRUCTIONS"

// export const UPDATE_NOTES = "Product.UPDATE_NOTES"
// export const  EDITING_RETAIL_PRICE_WITH_TAX = 'Product.EDITING_RETAIL_PRICE_WITH_TAX'

// ------------------------------------
// Actions
// ------------------------------------
// ------------------------------------
// Actions
// ------------------------------------

export const handleNotesChange = (e)=> (dispatch, getState) => {
const notes = e.target.value
dispatch({type:UPDATE_NOTES,notes})
}
export const handleIngredientsChange = (e) => (dispatch, getState) => {
  const instructions = e.target.value
  dispatch({type:UPDATE_INSTRUCTIONS,instructions})
  }

export const changeSelectedProduct = selectedProduct => (
  dispatch,
  getState
) => {
  const salesTax = selectedProduct ? selectedProduct.sales_tax:0;
  const markupFactor =selectedProduct ? selectedProduct.profit_factor:null;
  const notes = selectedProduct ? selectedProduct.notes : "";
  const instructions = selectedProduct ? selectedProduct.instructions:"";
  const selectedTags = selectedProduct ? selectedProduct.tags:null;

  dispatch({type:UPDATE_NOTES,notes})
  dispatch({type:UPDATE_INSTRUCTIONS,instructions})
  dispatch({ type: GET_TOTAL_PRICE_REQUEST });
  dispatch({ type: CHANGE_SELECTED_PRODUCT, selectedProduct });
  dispatch({ type: CHANGE_SELECTED_TAG, selectedTags });
  dispatch({ type: GET_SALES_TAX_SUCCESS, salesTax });
  dispatch({ type: CHANGE_MARKUP_FACTOR, markupFactor });
  dispatch(changeSelectedRecipe(selectedProduct ? selectedProduct.recipe : {}));
  dispatch(
    changeSelectedContainer(selectedProduct ? selectedProduct.container : {})
  );
};

export const changeSelectedTag = selectedTags => (dispatch, getState) => {
  dispatch({ type: CHANGE_SELECTED_TAG, selectedTags });
};

export const currencyClicked = row => dispatch => {
  if (!row.id === "retail-price") return;
  dispatch({ type: CHANGE_RETAIL_PRICE });
};

export const editRetailPrice = value => (dispatch, getState) => {
  const { totalPrice } = getState().product;
  const { salesTax } = getState().product;
  totalPrice.retail_price = value;
  totalPrice.retail_price_with_tax = parseFloat(
    value + (value * salesTax) / 100
  ).toFixed(2);
  dispatch({ type: EDITING_RETAIL_PRICE, totalPrice });
};

export const retailPriceUpdated = () => (dispatch, getState) => {
  const { totalPrice } = getState().product;
  const markupFactor = parseFloat(
    totalPrice.retail_price / totalPrice.wholesale_price
  ).toFixed(2);
  dispatch({ type: RETAIL_PRICE_UPDATED, totalPrice });
  dispatch({ type: CHANGE_MARKUP_FACTOR, markupFactor });
};


export const changeProductExistStatus = (value) => (dispatch,getState) => dispatch({type:PRODUCT_EXIST,value})

export const getProducts = (params = {}) => (dispatch, getState, { fetch }) => {
  // console.log("params",params)
  dispatch({ type: GET_PRODUCT_REQUEST, params });
  const { token } = dispatch(getToken());
  let { search, ordering } = getState().product;

  const page = params.page ? params.page:undefined
  const page_size = params.page_size ? params.page_size:undefined
  const found= params.found ? params.found:undefined
  search = params.name ? params.name:search
  return fetch(
    `/pands/products/?${qs.stringify({
      search,
      ordering,
      page,
      page_size,
      found
    })}`,
    {
      method: "GET",
      token,
      success: res => {
        const count = res.count
       
        if(params.found){
          let value = false
          if(res.results.length > 0){
            
            value = true
          }
          // console.log("value",value)
          // console.log("exist",value)
          dispatch({ type: PRODUCT_EXIST,value})
          return
        }
        dispatch({ type: GET_PRODUCT_SUCCESS, res,count })
        let value = false
        dispatch({ type:CHANGE_PRODUCTSLOAD,value})
      },

      failure: err =>{ 
        
        dispatch({ type: GET_PRODUCT_FAILURE })}
    }
  );
};

export const handleDeleteAll = (ids,pagenumber) => (dispatch,getState,{fetch}) => {
  const { token } = dispatch(getToken());
  // dispatch({ type: DELETE_PRODUCT_REQUEST });
  return fetch(`/pands/deleteproducts/`,{
    method: "DELETE",
    token,
    body:{
      "ids":ids
    },
    success: res =>{ 
      message.success("Deleted all selected Products")
      dispatch(getProducts({ page: pagenumber, page_size: PAGE_SIZE }));
      // dispatch({ type: DELETE_RAW_MATERIALS_SUCCESS, res })},
    },
    failure: err => {
      message.error("Deleting failed, Please try later")
      // dispatch({ type: DELETE_RAW_MATERIALS_FAILURE })}
    }
})
}

export const getTags = (params = {}) => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_TAGS_REQUEST, params });
  const { token } = dispatch(getToken());
  return fetch(`/pands/tags/`, {
    method: "GET",
    token,
    success: res => {
      dispatch({ type: GET_TAGS_SUCCESS, res });
    },
    failure: err => dispatch({ type: GET_TAGS_FAILURE })
  });
};


export const deleteProduct = (id) => (dispatch,getState,{fetch}) => {
  
  const { token } = dispatch(getToken());
  return fetch(`/pands/products/${id}`,{method:"DELETE",token,
  success: res => {
  dispatch(getProducts());
   message.success("Deleted recipe successfully")
  },
  failure: err => {
    
    message.error("Unable to delete recipe")}
})
 
}

export const addProduct = (values) => (dispatch, getState, { fetch }) => {
  
  dispatch({ type: ADD_PRODUCT_REQUEST });
  const state = getState();
  const { token } = dispatch(getToken());
  const { currencies, currency } = getState().global;
  let { selectedRecipe } = getState().recipe;
  let { selectedContainer } = getState().container;
  const { selectedTags, selectedProduct,notes,instructions } = getState().product;
  const { salesTax } = getState().product;
  let  retail_price_with_tax  = getState().product.totalPrice ? getState().product.totalPrice.retail_price_with_tax:null;
  const { markupFactor } = getState().product;
  let { products } = getState().product;
  const name = values.name;
  
 
  
  // var productI = {
  //   container: selectedContainer,
  //   id: 120,
  //   markup_factor: "1.00",
  //   name,
  //   private: false,
  //   profit_factor: markupFactor.toString(),
  //   recipe: selectedRecipe,
  //   sales_tax: salesTax ? salesTax.toString(): "",
  //   tags: selectedTags,
  //   total_price: retail_price_with_tax ? retail_price_with_tax.toString():"",
  //   user: selectedRecipe ? selectedRecipe.user:"",
  //   notes,
  //   instructions
  // };
  // products.push(productI);
  
  
  if (currency.rate !== 1) {
    retail_price_with_tax = parseFloat(
      parseFloat(retail_price_with_tax / currency.rate).toFixed(2)
    );
  }
  // dispatch({type:SET_SELECTED_PRODUCT,productI})
  
  
  return fetch(`/pands/products/`, {
    method: "POST",
    body: {
      // ...values,
      name:values.name,
      markup_factor:values.markup_factor,
      instructions:instructions,
      notes:notes,
      recipe: selectedRecipe.id,
      container: selectedContainer.id,
      tags:
        selectedTags && selectedTags.length > 0
          ? selectedTags.map(tag => tag.id)
          : [],
      sales_tax: salesTax,
      total_price: retail_price_with_tax,
      // currencies: currencies.map(item => item.key),
      profit_factor: markupFactor
    },
    token,
    success: selectedProduct => {
      // dispatch(updateProductID(selectedProduct));
    dispatch({type:SET_SELECTED_PRODUCT,selectedProduct})
      
      dispatch({type:ADD_PRODUCT_SUCCESS})
      dispatch(displayMessages(messages.addProductSuccess));
      dispatch(getProducts())
    },
    failure: err => {
      dispatch({ type: ADD_PRODUCT_FAILURE });
      // message.error(messages.addProductError);
      dispatch(displayMessages(messages.addProductError));
      dispatch(getProducts())
    }
  });
};

export const updateProductID = selectedProduct => (dispatch, getState) => {
  let { products } = getState().product;
  products = products.map(product => {
    if (product.name === selectedProduct.name) {
      product.id = selectedProduct.id;
      
      return product;
    }
    return product;
  });
  
  dispatch({ type: UPDATE_PRODUCT_ID, products });
};

export const updateProduct = values => (dispatch, getState, { fetch }) => {
  dispatch({ type: UPDATE_PRODUCT_REQUEST });
  const { token } = dispatch(getToken());
  const { currencies, currency } = getState().global;
  let { selectedProduct,notes,instructions } = getState().product;
  const { selectedRecipe } = getState().recipe;
  const { selectedContainer } = getState().container;
  const { selectedTags } = getState().product;
  const { salesTax } = getState().product;
  let { retail_price_with_tax } = getState().product.totalPrice ? getState().product.totalPrice:0;
  const { markupFactor } = getState().product;
  const { products } = getState().product;
  selectedProduct.profit_factor = markupFactor;
  selectedProduct.sales_tax = salesTax;
  selectedProduct.tags = selectedTags;
  selectedProduct.recipe = selectedRecipe;
  selectedProduct.container = selectedContainer;
  selectedProduct.total_price = retail_price_with_tax;

  let updatedProductList = products.map(item => {
    if (item.id === selectedProduct.id) {
      selectedProduct.container = item.container;
      return selectedProduct;
    }
    return item;
  });

  // selectedProduct.container = selectedContainer;

  dispatch({ type: MODIFY_SELECTED_PRODUCT, updatedProductList });
  if (currency.rate !== 1) {
    retail_price_with_tax = parseFloat(
      parseFloat(retail_price_with_tax / currency.rate).toFixed(2)
    );
  }
  

  return fetch(`/pands/products/${selectedProduct.id}/`, {
    method: "PATCH",
    body: {
      markup_factor: values.markup_factor,
      product: selectedProduct.id,
      name: selectedProduct.name,
      recipe: selectedRecipe.id,
      container: selectedContainer.id,
      tags:
        selectedTags && selectedTags.length > 0
          ? selectedTags.map(tag => tag.id)
          : [],
      sales_tax: salesTax,
      total_price: retail_price_with_tax,
      currencies: currencies.map(item => item.key),
      profit_factor: markupFactor,
      notes,
      instructions

    },
    token,
    success: selectedProduct => {
      dispatch({ type: UPDATE_PRODUCT_SUCCESS, selectedProduct });
      // message.success(messages.updateProductSuccess);
      dispatch(displayMessages(messages.updateProductSuccess));
      dispatch(getProducts());
    },
    failure: err => {
      dispatch({ type: UPDATE_PRODUCT_FAILURE });
      // message.error(messages.updateProductError);
      dispatch(displayMessages(messages.updateProductError));
      dispatch(getProducts());
    }
  });
};

const getElementPrice = (priceArray, currency) => {
 
  let totalCurrency = 0;
  priceArray.forEach(price => {
    totalCurrency += parseFloat(price.currencies[currency["key"]]);
  });

  return parseFloat(parseFloat(totalCurrency).toFixed(2));
};

export const getTotalPrice = () => (dispatch, getState, { fetch }) => {
  const { currency } = getState().global;
  let { markupFactor, salesTax } = getState().product;
  const containerPrice = getElementPrice(getState().container.prices, currency);
  const recipePrice = getElementPrice(getState().recipe.prices, currency);

  if(markupFactor === 0){
    markupFactor = 1
  }

  let totalPrice = {};
  if (containerPrice > 0 || recipePrice > 0) {
    totalPrice.recipePrice = recipePrice;
    totalPrice.containerPrice = containerPrice;
    totalPrice.wholesale_price = parseFloat(
      parseFloat(recipePrice + containerPrice).toFixed(2)
    );
    totalPrice.retail_price = parseFloat(
      parseFloat(markupFactor * totalPrice.wholesale_price).toFixed(2)
    );
    totalPrice.retail_price_with_tax = parseFloat(
      parseFloat(
        totalPrice.retail_price + (totalPrice.retail_price * salesTax) / 100
      ).toFixed(2)
    );
    dispatch({ type: GET_TOTAL_PRICE_SUCCESS, totalPrice });
  } else {
    dispatch({ type: GET_TOTAL_PRICE_FAILURE });
  }
};

export const changeMarkupFactor = markupFactor => (dispatch, getState) => {
  dispatch({ type: CHANGE_MARKUP_FACTOR, markupFactor });
  dispatch(getTotalPrice());
};

export const openProductsModal = () => (dispatch, getState) => {
  
  dispatch({ type: OPEN_PRODUCTS_MODAL });
  // dispatch(getProducts({search:""}));
};

export const closeProductsModal = () => ({
  type: CLOSE_PRODUCTS_MODAL
});

export const clear = () => ({ type: CLEAR });

export const clearAllActions = (dispatch, formRef) => {
  dispatch(cleardilution())
  dispatch(clearContainer());
  dispatch(clearRawMaterials());
  dispatch(clearComponents());
  dispatch(clearOnlySelectedRecipes());
  dispatch(clearRecipe());
  formRef && formRef.current.resetFields();
  dispatch({ type: CLEAR_FORMS });



}

export const signOut = (dispatch) => {
  clearAllActions(dispatch);
}

export const clearForms = formRef => dispatch => {
  clearAllActions(dispatch, formRef);
};

export const handleTaxChange = value => dispatch => {
  const salesTax = value;
  dispatch({ type: GET_SALES_TAX_SUCCESS, salesTax });
  dispatch(getTotalPrice());
};

export const handleCurrencyChange = () => dispatch => {
  dispatch(getTotalPrice());
};

export const updateSelectedProduct = selectedContainer => (
  dispatch,
  getState
) => {
  let selectedProductArray = _.cloneDeep(getState().product.selectedProduct);
  let productsArray = _.cloneDeep(getState().product.products);

  for (var productList = 0; productList < productsArray.length; productList++) {
    if (productsArray[productList].id === selectedProductArray.id) {
      const containerObj = {
        components: selectedContainer,
        currency: productsArray[productList].container.currency,
        id: productsArray[productList].container.id,
        name: null,
        user: null,
        total_price: 1
      };

      productsArray[productList].container = Object.assign({}, containerObj);
      // selectedProductArray.container.components = selectedContainer.map(
      //   container => container
      // );

      // debugger;
    }
  }
  dispatch({
    type: UPDATE_SELECTED_PRODUCT,
    productsArray
  });
  // selectedProductArray.container.components = selectedContainer;

  // selectedProduct.components = selectedContainer;
};
let array = [];
export const displayMessages = message => (dispatch, getState) => {
  array.push(message);
  if (array.length === 3) {
    var res =
      //String(array[0]) + "\n" + String(array[1]) + "\n" + 
      String(array[2]);
    message.info(res);
    array = [];
  }
};

export const loadingProducts = () => (dispatch, getState) => {
  let { productsLoad } = getState().product
  productsLoad = true
  dispatch({type: LOADING_PRODUCT,productsLoad})
}
export const loadingTags = () => (dispatch, getState) => {
  
  let { tagsLoad } = getState().product
  tagsLoad = true
  dispatch({type: LOADING_TAGS,tagsLoad})
}


export const recipesDownloadClick = event => (dispatch, getState) => {
  const { token } = dispatch(getToken());
  const { apiUrl } = getState().global;
  return fetch(apiUrl + `/pands/download_recipes/`, {      
    method: "GET",
    // token,
    headers:{
       "Authorization": 'Bearer ' + token,
       
    }
  }).then(response => response.json()
  ).then(async response => {
      let blob = new Blob([response.data], {type: 'text/plain'})
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download',"download")
      document.body.appendChild(link);
      link.click();      
      link.remove();
  })  
};

export const changeInitialLoad = (value) => (dispatch,getState) => {
  dispatch({ type:CHANGE_PRODUCTSLOAD,value})
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    products: false,
    addingProduct: false,
    updatingProduct: false,
    totalPrice: false
  },
  products: [],
  search: null,
  ordering: null,
  selectedProduct: null,
  selectedTags: [],
  error: null,
  totalPrice: null,
  markupFactor: 3.0,
  addRetailPrice: false,
  productsModal:false,
  categories: [],
  tags: [],
  tagLoading: {
    tags: false
  },
  salesTax: 0,
  productsLoad: false,
  tagsLoad: false,
  count:0,
  initialProductLoad:true,
  notes:"",
  instructions:"",
  productExist:false
};

export default createReducer(initialState, {
  [GET_PRODUCT_REQUEST]: (state, { params }) => ({
    search: _.has(params, "search") ? params.search : state.search,
    ordering: params.sorter
      ? `${params.sorter.order === "descend" ? "-" : ""}${params.sorter.field}`
      : state.ordering,
    filters: params.filters || state.filters,
    loading: {
      ...state.loading,
      products: true
    }
  }),
  [CHANGE_PRODUCTSLOAD]:(state,{value}) => ({
    initialProductLoad:value
  }),
  [GET_PRODUCT_SUCCESS]: (state, { res: { results },count }) => ({
    products: results,
    loading: {
      ...state.loading,
      products: false
    },
    productsLoad: false,
    count:count
  }),
  [PRODUCT_EXIST]: (state,action) => ({
    productExist:action.value,
    loading: {
      ...state.loading,
      products: false
    },
  }),
  [GET_PRODUCT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      products: false
    },
    productsLoad: false
  }),
  [SET_SELECTED_PRODUCT]:(state,{selectedProduct}) => ({
    selectedProduct: selectedProduct
  })
  ,
  [GET_TAGS_REQUEST]: (state, { params }) => ({
    tagLoading: {
      ...state.tagLoading,
      tags: false
    }
  }),
  [GET_TAGS_SUCCESS]: (state, { res: { results } }) => ({
    tags: results,
    tagLoading: false,
    tagsLoad: false
  }),
  [GET_TAGS_FAILURE]: (state, action) => ({
    tagLoading: false,
    tagsLoad: false

  }),
  [ADD_PRODUCT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      addingProduct: true
    }
  }),
  [OPEN_PRODUCTS_MODAL]: (state, action) => ({
    productsModal: true
  }),
  [CLOSE_PRODUCTS_MODAL]: (state, action) => ({
    productsModal: false,
  }),
  [ADD_PRODUCT_SUCCESS]: (state) => ({
  
    loading: {
      ...state.loading,
      addingProduct: false
    }
  }),
  [ADD_PRODUCT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      addingProduct: false
    }
  }),
  [UPDATE_PRODUCT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingProduct: true
    }
  }),
  [UPDATE_PRODUCT_SUCCESS]: (state, { selectedProduct }) => ({
    selectedProduct,
    loading: {
      ...state.loading,
      updatingProduct: false
    }
  }),
  [UPDATE_PRODUCT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingProduct: false
    }
  }),
  [GET_TOTAL_PRICE_REQUEST]: (state, action) => ({
    totalPrice: null,
    loading: {
      ...state.loading,
      totalPrice: true
    }
  }),
  [GET_TOTAL_PRICE_SUCCESS]: (state, { totalPrice }) => ({
    totalPrice,
    loading: {
      ...state.loading,
      totalPrice: false
    }
  }),
  [GET_SALES_TAX_SUCCESS]: (state, { salesTax }) => ({
    salesTax
  }),
  [EDITING_RETAIL_PRICE]: (state, { totalPrice }) => ({
    totalPrice
  }),
  [RETAIL_PRICE_UPDATED]: (state, { totalPrice }) => ({
    totalPrice,
    addRetailPrice: false
  }),
  [GET_TOTAL_PRICE_FAILURE]: (state, { error }) => ({
    error,
    loading: {
      ...state.loading,
      totalPrice: false
    }
  }),
  [CHANGE_MARKUP_FACTOR]: (state, { markupFactor }) => ({
    markupFactor
  }),
  [CHANGE_SELECTED_PRODUCT]: (state, { selectedProduct }) => ({
    selectedProduct
  }),
  [CHANGE_SELECTED_TAG]: (state, { selectedTags }) => ({
    selectedTags
  }),
  [CHANGE_RETAIL_PRICE]: state => ({
    addRetailPrice: true
  }),
  [MODIFY_SELECTED_PRODUCT]: (state, { updatedProductList }) => ({
    products: updatedProductList
  }),
  [ADD_NEW_PRODUCT]: (state, { products }) => ({
    products
  }),
  [UPDATE_SELECTED_PRODUCT]: (state, { productsArray }) => ({
    // selectedProduct: selectedProductArray,
    products: productsArray
  }),
  [UPDATE_PRODUCT_ID]: (state, { products }) => ({
    products
  }),
  [CLEAR_FORMS]: (state, action) => ({
    selectedProduct: null,
    totalPrice: null,
    selectedTags: [],
    salesTax: 0,
    markupFactor: 3.0,
    search: null,
    ordering: null,
    initialProductLoad:true,
    instructions:"",
    notes:""

  }),
  [LOADING_PRODUCT]:(state,{ productsLoad }) => ({
    productsLoad
  }),
  [LOADING_TAGS]:(state,{ tagsLoad }) => ({
    tagsLoad
  }),
  [UPDATE_NOTES]:(state,action) => ({
    notes:action.notes
  }),
  [UPDATE_INSTRUCTIONS]:(state,action) => ({
    instructions:action.instructions
  }),
  [CLEAR]: (state, action) => RESET_STORE
});
