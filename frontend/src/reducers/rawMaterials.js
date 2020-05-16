import createReducer, { RESET_STORE } from "../createReducer";
import { getToken } from "./user";
import qs from "query-string";
import uniqBy from "lodash/uniqBy";
import has from "lodash/has";
import { getPrices } from "./recipe";
import { deleteRowWithPrices } from "./recipe";
import { message } from "antd";
import { PAGE_SIZE } from "../constants";


var _ = require('lodash');
// ------------------------------------
// Constants
// ------------------------------------
export const GET_RAW_MATERIALS_REQUEST =
  "RawMaterials.GET_RAW_MATERIALS_REQUEST";
export const GET_RAW_MATERIALS_SUCCESS =
  "RawMaterials.GET_RAW_MATERIALS_SUCCESS";
export const GET_RAW_MATERIALS_FAILURE =
  "RawMaterials.GET_RAW_MATERIALS_FAILURE";

export const GET_RAW_INGREDIENTS_REQUEST = "RawMaterials.GET_RAW_INGREDIENTS_REQUEST";
export const GET_RAW_INGREDIENTS_SUCCESS = "RawMaterials.GET_RAW_INGREDIENTS_SUCCESS";
export const GET_RAW_INGREDIENTS_FAILURE = "RawMaterials.GET_RAW_INGREDIENTS_FAILURE";

export const GET_RAW_SUPPLIER_REQUEST = "RawMaterials.GET_RAW_SUPPLIER_REQUEST";
export const GET_RAW_SUPPLIER_SUCCESS = "RawMaterials.GET_RAW_SUPPLIER_SUCCESS";
export const GET_RAW_SUPPLIER_FAILURE = "RawMaterials.GET_RAW_SUPPLIER_FAILURE";


export const PUSH_RAW_MATERIALS = "RawMaterials.PUSH_RAW_MATERIALS"

  export const DELETE_RAW_MATERIALS_REQUEST =
  "RawMaterials.DELETE_RAW_MATERIALS_REQUEST";
export const DELETE_RAW_MATERIALS_SUCCESS =
  "RawMaterials.DELETE_RAW_MATERIALS_SUCCESS";
export const DELETE_RAW_MATERIALS_FAILURE =
  "RawMaterials.DELETE_RAW_MATERIALS_FAILURE";
 
export const UPDATE_COUNT = "RawMaterials.UPDATE_COUNT";  
  
export const OPEN_RAW_MATERIALS_MODAL = "RawMaterials.OPEN_RAW_MATERIALS_MODAL";
export const CLOSE_RAW_MATERIALS_MODAL =
  "RawMaterials.CLOSE_RAW_MATERIALS_MODAL";

export const CHANGE_RAW_MATERIAL_SEARCH_MODAL =
  "RawMaterials.CHANGE_RAW_MATERIAL_SEARCH_MODAL";
export const CHANGE_SELECTED_ROWS = "RawMaterials.CHANGE_SELECTED_ROWS";

export const CHANGE_SELECTED_RAW_MATERIALS =
  "RawMaterials.CHANGE_SELECTED_RAW_MATERIALS";

export const SAVE_FIELDS = "RawMaterials.SAVE_FIELDS";

export const CLEAR_SELECTED_RECIPES = "RawMaterials.CLEAR_SELECTED_RECIPES";

export const CLEAR = "RawMaterials.CLEAR";

export const LOADING_RECIPES = "RawMaterials.LOADING_RECIPES"

export const UPDATE_CATEGORIES = "RawMaterials.UPDATE_CATEGORIES"

export const OPEN_ADD_INGREDIENT_MODAL = "RawMaterials.OPEN_ADD_INGREDIENT_MODAL"

export const CLOSE_ADD_INGREDIENT_MODAL = "RawMaterials.CLOSE_ADD_INGREDIENT_MODAL"

export const CLOSE_SUPPLIER_MODAL = "RawMaterials.CLOSE_SUPPLIER_MODAL"

export const OPEN_SUPPLIER_MODAL = "RawMaterials.OPEN_SUPPLIER_MODAL"

export const CLEAR_INGREDIENTS = "RawMaterials.CLEAR_INGREDIENTS"

export const SUBMIT_INGREDIENTS_REQUEST = "RawMaterials.SUBMIT_INGREDIENTS_REQUEST"

export const SUBMIT_INGREDIENTS_SUCCESS = "RawMaterials.SUBMIT_INGREDIENTS_SUCCESS"

export const SUBMIT_INGREDIENTS_FAILURE = "RawMaterials.SUBMIT_INGREDIENTS_FAILURE"

export const CLEAR_SUPPLIERS = "RawMaterials.CLEAR_SUPPLIERS"

export const UPDATE_CURRENCIES = "RawMaterials.UPDATE_CURRENCIES"

export const SUBMIT_SUPPLIER_REQUEST = "RawMaterials.SUBMIT_SUPPLIER_REQUEST"

export const SUBMIT_SUPPLIER_SUCCESS = "RawMaterials.SUBMIT_SUPPLIER_SUCCESS"

export const SUBMIT_SUPPLIER_FAILURE = "RawMaterials.SUBMIT_SUPPLIER_FAILURE"

export const GET_CATEGORIES_REQUEST = "RawMaterials.GET_CATEGORIES_REQUEST"

export const GET_CATEGORIES_SUCCESS = "RawMaterials.GET_CATEGORIES_SUCCESS"

export const GET_CATEGORIES_FAILURE = "RawMaterials.GET_CATEGORIES_FAILURE"

export const CLEAR_SELECTED_SUPPLIER = "RawMaterials.CLEAR_SELECTED_SUPPLIER"
// ------------------------------------
// Actions
// ------------------------------------

export const submitSupplier = (obj) => (dispatch,getState,{ fetch }) => {
  const { token } = dispatch(getToken());
  dispatch({ type: SUBMIT_SUPPLIER_REQUEST });

  return fetch( `/pands/suppliers/ `,
    {
      method: "POST",
      token,
      body: {
        ...obj,
      },
      success: res => {   
        message.success("Supplier Successfully added")
        let selectedSupplier = res    
         
        dispatch({type:SUBMIT_SUPPLIER_SUCCESS,selectedSupplier})
        dispatch(getSuppliers({page:1,afterUpdate:true}))
        
      },
      failure: err => {
        message.success("Unable to add Supplier , Please try later")     
        dispatch({type:SUBMIT_SUPPLIER_FAILURE})
      }
    }
  )

}

export const clearSelectedSupplier = () => (dispatch,getState) => {
  dispatch({type:CLEAR_SELECTED_SUPPLIER})
}
  
export const currencySearch = (search) => (dispatch,getState) => {
 
  const {currencies} = getState().global
  let newCurrency = currencies
  if(search === ""){
    dispatch({type:UPDATE_CURRENCIES,newCurrency})
    return
  }
  newCurrency = currencies.map(currency=>{
  if(currency.label.search((new RegExp(search, "i"))) !== -1) return currency
  return null
    })
  newCurrency = newCurrency.filter(i => i)
  dispatch({type:UPDATE_CURRENCIES,newCurrency})

}


export const clearIngredients = () => (dispatch,getState) => {
  dispatch({type:CLEAR_INGREDIENTS})
}



export const submitIngredient = (obj) => (
  dispatch,
  getState,
  { fetch }
) => {
  const { token } = dispatch(getToken());
  dispatch({ type: SUBMIT_INGREDIENTS_REQUEST });

  return fetch( `/pands/raw-materialids/`,
    {
      method: "POST",
      token,
      body: {
        ...obj,
        
      },
      success: res => {   
        message.success("Raw Ingredient Successfully added")     
        dispatch({type:SUBMIT_INGREDIENTS_SUCCESS})
      },
      failure: err => {
        message.success("Unable to add Raw Material , Please try again later.")
        // console.log("!!!!!!!!!!  error: ", err);
        dispatch({type:SUBMIT_INGREDIENTS_FAILURE})
      }
    }
  )

}

export const getIngredients = (params = {}) => (
  dispatch,
  getState,
  { fetch }
) => {
  
  dispatch({ type: GET_RAW_INGREDIENTS_REQUEST,params });
  let {ingredients,totalIngredients} = getState().rawMaterials
  if( totalIngredients !== 0 && ingredients.length == totalIngredients) return
  const { token } = dispatch(getToken());
  let search = params.search ? params.search:undefined
  let page = params.page ? params.page:1
  let page_size = PAGE_SIZE
  return fetch(
    `/pands/raw-ingredients/?${qs.stringify({
      search,
      page,
      page_size
    })}`,
    {
      method: "GET",
      token,
      success: res => {
        
        let value
        let count = totalIngredients
        if(!params.search) {
          count = res.count 
        }
        if(params.search && params.specialSearch){ 
          value = res.results
        }else{
          value = ingredients.concat(res.results)
        }
        dispatch({type:GET_RAW_INGREDIENTS_SUCCESS,value,count})
      },
      failure: err => {
        dispatch({type:GET_RAW_INGREDIENTS_FAILURE})
      }
    }
  )
}



export const clearSuppliers = () =>(dispatch,getState) =>{
  
  dispatch({type:CLEAR_SUPPLIERS})
}



export const getSuppliers = (params = {}) => (
  dispatch,
  getState,
  { fetch }
) => {
  let {suppliers,totalSuppliers} = getState().rawMaterials
  

  if( totalSuppliers !== 0 && suppliers.length === totalSuppliers && !params.afterUpdate) return
  dispatch({ type: GET_RAW_SUPPLIER_REQUEST });
  const { token } = dispatch(getToken());
  let search = params.search ? params.search:undefined
  let page = params.page ? params.page:1
  let page_size = PAGE_SIZE
 
  return fetch(
    `/pands/suppliers/?${qs.stringify({
      search,
      page,
      page_size
    })}`,
    {
      method: "GET",
      token,
      success: res => {
        if(params.afterUpdate){
          let supplier = res.results
          let count = totalSuppliers
          if(!params.search) count = res.count
          dispatch({type:GET_RAW_SUPPLIER_SUCCESS,supplier,count})
          return
        }
        const supplier = suppliers.concat(res.results)
        let count = totalSuppliers
        if(!params.search) count = res.count
        dispatch({type:GET_RAW_SUPPLIER_SUCCESS,supplier,count})
      },
      failure: err => {
        dispatch({type:GET_RAW_SUPPLIER_FAILURE})
      }
    }
  )
}

export const getRawMaterialsForSelectedCategory = (selectedCategory,onlymy) => (dispatch,getState) => {
  const {categories} = getState().rawMaterials
  let category = categories.filter(i => i.name === selectedCategory)
  // dispatch(getSpecificRawMaterials(category[0].id))
  if(!category.length){
  dispatch(getRawMaterials({cat:undefined,page:1,search:undefined,only_mine:onlymy ? 1:0}))
  return
  }
  
  dispatch(getRawMaterials({cat:category[0].id,page:1,search:undefined,only_mine:onlymy ? 1:0}))

}



export const getRawMaterials = (params = {}) => (
  dispatch,
  getState,
  { fetch }
) => {
  
  // console.log("here",params)
  dispatch({ type: GET_RAW_MATERIALS_REQUEST, params });
  const { token } = dispatch(getToken());
  
  
  let page_size = params.page_size ? params.page_size:undefined
  // let cat = params.cat ? params.cat:undefined

  const { search, ordering,only_mine,page,cat} = getState().rawMaterials;

  
  return fetch(
    `/pands/raw-materials/?${qs.stringify({
      search,
      ordering,
      page,
      page_size,
      only_mine,
      cat
    })}`,
    {
      method: "GET",
      token,
      success: res => {
        let ingredients = res.results
        if(params.ispush) dispatch({type:PUSH_RAW_MATERIALS,ingredients})
        else dispatch({ type: GET_RAW_MATERIALS_SUCCESS, ingredients });

        // if( !page &&  !page_size){
        // const categories = getCategories(rawMaterials);
        // const count = res.count;
        // const existingCategories = getState().rawMaterials.categories
        // var is_same = existingCategories.length == categories.length && categories.every(function(element) {
        //   return _.includes(existingCategories, element)
        // });
        // if(!is_same) dispatch({type:UPDATE_CATEGORIES,categories,count})
        // }else{
        const count = res.count;
        dispatch({type:UPDATE_COUNT,count})

        // }
        
      },
      failure: err => dispatch({ type: GET_RAW_MATERIALS_FAILURE })
    }
  );
};


export const getCategories = () => (dispatch,getState,{fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type:GET_CATEGORIES_REQUEST})
  return fetch(`/pands/raw-materials/categories/`,
  {method:"GET",
  token,
  success: res => {
    dispatch({type:GET_CATEGORIES_SUCCESS,res})
    let defaultCategoryID = res.filter(category => category.name === "Carrier Oil")
    // dispatch(getSpecificRawMaterials(defaultCategoryID[0].id))
    dispatch(getRawMaterials({cat:defaultCategoryID[0].id,page:1,search:undefined}))
  },
  failure:res =>{
    dispatch({type:GET_CATEGORIES_FAILURE})

  }})
}

export const getSpecificRawMaterials = (id) => (dispatch,getState,{fetch}) => {
  const {token} = dispatch(getToken())
  let params = {}
  dispatch({ type: GET_RAW_MATERIALS_REQUEST, params });
  return fetch(`/pands/raw-materials/?cat=${id}`,{
    token,
    method:"GET",
    success: res => {
        let ingredients = res.results
        dispatch({ type: GET_RAW_MATERIALS_SUCCESS, ingredients });
        
    },
    failure: (err) => {
      dispatch({ type: GET_RAW_MATERIALS_FAILURE })
    }
  })

}


const filterIncomingRawMaterials = (raw) => {
  
  let filter =  raw.map((rawMaterial,index) => {
    
    let each = {
        id: rawMaterial.id,
      // raw_ingredient: {
        raw_ingredient_id:rawMaterial.raw_ingredient ? rawMaterial.raw_ingredient.id:null,
        name:rawMaterial.raw_ingredient ? rawMaterial.raw_ingredient.name:null,
        category:rawMaterial.raw_ingredient ? rawMaterial.raw_ingredient.category:null,
        warning:rawMaterial.raw_ingredient ?rawMaterial.raw_ingredient.warning:null,
        drmaxpercent:rawMaterial.raw_ingredient ? rawMaterial.raw_ingredient.drmaxpercent:null,
        density:rawMaterial.raw_ingredient ? rawMaterial.raw_ingredient.density:null,
        latin_name:rawMaterial.raw_ingredient ? rawMaterial.raw_ingredient.latin_name:null,
      // },
      user:rawMaterial.user,
      supplier:rawMaterial.supplier,
      price:rawMaterial.price,
      ordernum:rawMaterial.ordernum,      
      biological:rawMaterial.biological,
      ppu:rawMaterial.ppu,
      currency:rawMaterial.currency,
      quantity:rawMaterial.quantity,
      vat_included:rawMaterial.vat_included,
      quantity_unit:rawMaterial.quantity_unit,
      available:rawMaterial.available,      
    }
    return each
  })
  return filter

}

//doubt here, function get return after forEach
const getCategoriesold = (res) => {
  let categories = []
  
  const result = res;
  let i =0 ;
  
  const value = result.map((rawMaterial,index) => {
    if(rawMaterial.category.length > 0){
    if(_.includes(categories,rawMaterial.raw_ingredient.category[0].name)) return null;
    categories[index]=rawMaterial.raw_ingredient.category[0].name
    return rawMaterial.raw_ingredient.category[0].name;
    }else if(rawMaterial.raw_ingredient.category.length === 0){
      
      if(_.includes(categories,"Others")) return null;
      categories.push("Others")
    }
    }
  )
  let sorterArray = categories.sort();
  if(sorterArray.includes('Others')) {
    sorterArray.splice( sorterArray.indexOf('Others'), 1 )
    sorterArray.push("Others")
  } 
  
  return categories
}

export const changeRawMaterialSearch = () => ({
  type: CHANGE_RAW_MATERIAL_SEARCH_MODAL
});

export const openRawMaterialsModal = () => (dispatch, getState) => {
  dispatch({ type: OPEN_RAW_MATERIALS_MODAL });
  // dispatch(getRawMaterials());
};

export const closeRawMaterialsModal = () => ({
  type: CLOSE_RAW_MATERIALS_MODAL
});

export const openSupplierModal = () => (dispatch, getState) => {
  
  dispatch({ type: OPEN_SUPPLIER_MODAL });
  // dispatch(getRawMaterials());
};

export const closeSupplierModal = () => ({
  type: CLOSE_SUPPLIER_MODAL
});

export const openAddIngredientsModal = () => (dispatch, getState) => {
  
  dispatch({ type: OPEN_ADD_INGREDIENT_MODAL });
  // dispatch(getRawMaterials());
};

export const closeAddIngredientsModal = () => (dispatch, getState) => {
  
  dispatch({type: CLOSE_ADD_INGREDIENT_MODAL})
};


export const changeSelectedRows = (keys, selectedRows) => ({
  type: CHANGE_SELECTED_ROWS,
  selectedRows
});

export const handleDeleteAll = (ids,pagenumber,alreadyExist) => (dispatch,getState,{fetch}) => {
  const { token } = dispatch(getToken());
  dispatch({ type: DELETE_RAW_MATERIALS_REQUEST });
  return fetch(`/pands/deleterawmaterials/`,{
    method: "DELETE",
    token,
    body:{
      "ids":ids
    },
    success: res =>{ 
      dispatch(getRawMaterials({ page: pagenumber, page_size: 50 }));
      dispatch({ type: DELETE_RAW_MATERIALS_SUCCESS, res })
      if(alreadyExist.length > 0) return  message.success("Ingredients deleted, note that petal and stem ingredients are not deleted")
      message.success("Deleted all selected Ingredients")
    },
    failure: err => {
      message.error("Deleting failed, Please try later")
      dispatch({ type: DELETE_RAW_MATERIALS_FAILURE })}
  })
}

export const changeSelectedRawMaterials = selectedRawMaterials => (
  dispatch,
  getState
) => {
  
  dispatch({ type: CHANGE_SELECTED_RAW_MATERIALS, selectedRawMaterials });
};

export const selectRawMaterials = newRows => (dispatch, getState) => {
  const { selectedRawMaterials } = getState().rawMaterials;
  const newRawMaterials = newRows.map(item => ({ raw_material: item }));
  
  dispatch(
    changeSelectedRawMaterials(
      uniqBy([...selectedRawMaterials, ...newRawMaterials], "raw_material.id")
    )
  );
  // load whole list of items
  // dispatch(getRawMaterials({ search: undefined }));
};

export const deselectRawMaterial = removedRow => (dispatch, getState) => {
  const { selectedRawMaterials } = getState().rawMaterials;

  dispatch(
    changeSelectedRawMaterials(
      selectedRawMaterials.filter(
        item => item.raw_material.id !== removedRow.raw_material.id
      )
    )
  );
  dispatch(deleteRowWithPrices(removedRow.raw_material.id));
};

export const saveFields = (fields, changedFields) => (dispatch, getState) => {
  
  dispatch({ type: SAVE_FIELDS, fields });
  const selectedProduct = getState().product.selectedProduct;
  const ingredientsChanged =
    Object.keys(changedFields).find(key => key.includes("ingredients"))
  if (ingredientsChanged) {
    dispatch(getPrices(fields));
  }
};

export const clearOnlySelectedRecipes = () => dispatch => {
  dispatch({ type: CLEAR_SELECTED_RECIPES });
};

export const clear = () => ({ type: CLEAR });

export const loadingRecipes = () => (dispatch, getState) => {
  let { recipesLoad } = getState().rawMaterials;
  recipesLoad = true;
  dispatch({ type: LOADING_RECIPES, recipesLoad });
};



export const handleDelete = (id) => (dispatch,getState,{ fetch }) => {
  const { token } = dispatch(getToken());
  dispatch({ type: DELETE_RAW_MATERIALS_REQUEST });
  return fetch(`/pands/raw-materials/${id}`,{
    method: "DELETE",
    token,
    success: res =>{ 
      dispatch(getRawMaterials());
      dispatch({ type: DELETE_RAW_MATERIALS_SUCCESS, res })},
    failure: err => dispatch({ type: DELETE_RAW_MATERIALS_FAILURE })
  })
    
    
    // .then(res => res.json()).then( json => {getRawMaterials();
    //   dispatch({ type: DELETE_RAW_MATERIALS_SUCCESS });
    // }
    //   ).catch(err => {
    //     dispatch({ type: DELETE_RAW_MATERIALS_FAILURE });
    //     message.error("unable to delete raw material")
    //   });
    // dispatch({ type: DELETE_RAW_MATERIALS_SUCCESS })},)
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  rawMaterials: [],
  search: undefined,
  ordering: undefined,
  filters: {},
  only_mine:0,
  rawMaterialSearch: undefined,
  rawMaterialsModalOpened: false,
  selectedRows: [],
  selectedRawMaterials: [],
  fields: {},
  recipesLoad: false,
  categories:[],
  // page:1
  count:0,
  AddIngredientsModalOpened:false,
  ingredients:[],
  suppliers:[],
  cat:undefined,
  page:1,
  supplierModalOpened:false,
  ingredientsLoad:false,
  suppliersLoad:false,
  submitIngredientLoader:false,
  totalSuppliers:0,
  totalIngredients:0,
  selectedCurrencies:[],
  categoriesLoad:false,
  selectedSupplier:{}
};

export default createReducer(initialState, {
  [GET_RAW_MATERIALS_REQUEST]: (state, { params }) => ({
    search: has(params, "search") ? params.search : state.search,
    ordering: params.sorter
      ? `${params.sorter.order === "descend" ? "-" : ""}${params.sorter.columnKey}`
      : state.ordering,
    // page: params.page ? params.page:state.page,
    filters: params.filters || state.filters,
    loading: true,
    only_mine:(params.only_mine == 1 || params.only_mine == 0) ? params.only_mine : state.only_mine,
    cat:params.cat ? (params.cat == 1000 ? undefined:params.cat):(params.cat == 0 ? undefined:state.cat),
    page:params.page ? params.page:state.page
  }),
  [UPDATE_CURRENCIES]:(state,action) => ({
    selectedCurrencies:action.newCurrency
  }),
  [PUSH_RAW_MATERIALS]:(state,action) =>({
    rawMaterials:state.rawMaterials.concat(action.ingredients),
    loading: false,
    recipesLoad: false

  }),
  [GET_CATEGORIES_REQUEST]:(state,action) => ({
    categoriesLoad:true
  }),
  [GET_CATEGORIES_SUCCESS]:(state,action) => ({
    categoriesLoad:false,
    categories:action.res
  }),
  [GET_CATEGORIES_FAILURE]:(state,action) => ({
    categoriesLoad:false
  }),
  [SUBMIT_INGREDIENTS_REQUEST]:(state,action) => ({
    submitIngredientLoader:true
  }),
  [SUBMIT_INGREDIENTS_SUCCESS]:(state,action) => ({
    submitIngredientLoader:false
  }),
  [SUBMIT_INGREDIENTS_FAILURE]:(state,action) => ({
    submitIngredientLoader:false
  }),
  [OPEN_ADD_INGREDIENT_MODAL]:(state,action) => ({
    AddIngredientsModalOpened:true
  }),
  [CLOSE_ADD_INGREDIENT_MODAL]:(state,action) => ({
    AddIngredientsModalOpened:false
  }),
  [UPDATE_COUNT]:(state,action) => (
    {count: action.count}
   ),
   [GET_RAW_INGREDIENTS_REQUEST]:(state,{params}) => ({
    ingredientsLoad:true,
    // ingredients: params.specialSearch ? []:state.ingredients
   }),
   [GET_RAW_INGREDIENTS_FAILURE]:(state,action) => ({
    ingredientsLoad:false
   }),
   [GET_RAW_INGREDIENTS_SUCCESS]:(state,action) => ({
     ingredientsLoad:false,
     ingredients: action.value,
     totalIngredients:action.count
   }),
  // [GET_RAW_MATERIALS_SUCCESS]: (state, { res: { results } }) => ({
  //   rawMaterials: results,
  //   loading: false,
  //   recipesLoad: false
  // }),
  [GET_RAW_MATERIALS_SUCCESS]: (state, { ingredients }) => ({
    rawMaterials: ingredients,
    loading: false,
    recipesLoad: false
  }),
  [CLEAR_SUPPLIERS]:(state,action) => ({
    suppliers:[]
  }),
  [CLEAR_SELECTED_SUPPLIER]:(state,action) => ({
    selectedSupplier:{}
  }),
  [UPDATE_CATEGORIES]: (state,{categories,count}) => ({
    // categories:categories,
    count:count
  }),
  [GET_RAW_MATERIALS_FAILURE]: (state, action) => ({
    loading: false,
    recipesLoad: false
  }),
  [GET_RAW_SUPPLIER_REQUEST]:(state,action) => ({
    suppliersLoad: true
  }),
  [GET_RAW_SUPPLIER_SUCCESS]:(state,action) => ({
    suppliersLoad: false,
    suppliers:action.supplier,
    totalSuppliers:action.count

    }),
  [GET_RAW_SUPPLIER_FAILURE]:(state,action) => ({
    suppliersLoad: false
  }),
  [OPEN_RAW_MATERIALS_MODAL]: (state, action) => ({
    rawMaterialsModalOpened: true
  }),
  [CLOSE_RAW_MATERIALS_MODAL]: (state, action) => ({
    rawMaterialsModalOpened: false,
    selectedRows: [],
    search: undefined
  }),
  [CHANGE_RAW_MATERIAL_SEARCH_MODAL]: (state, { rawMaterialSearch }) => ({
    rawMaterialSearch
  }),
  [CHANGE_SELECTED_ROWS]: (state, { selectedRows }) => ({
    selectedRows
  }),
  [CHANGE_SELECTED_RAW_MATERIALS]: (state, { selectedRawMaterials }) => ({
    selectedRawMaterials
  }),
  [CLEAR_INGREDIENTS]:(state,action) => ({
    ingredients:[],
    totalIngredients:0
  }),
  [SAVE_FIELDS]: (state, { fields }) => ({
    fields: {
      ...state.fields,
      ...fields
    }
  }),
  [LOADING_RECIPES]:(state, { recipesLoad }) => ({
    recipesLoad
  }),
  [DELETE_RAW_MATERIALS_REQUEST]: (state, action) => ({
    loading:true
   }),
   [OPEN_SUPPLIER_MODAL]:(state,action) => 
    ({
      supplierModalOpened:true
     }),
   [CLOSE_SUPPLIER_MODAL]:(state,action) => ({
    supplierModalOpened:false
   }),
  [DELETE_RAW_MATERIALS_SUCCESS]:(state,action) =>({
    loading:false
  }),
  [DELETE_RAW_MATERIALS_FAILURE]:(state,action) =>({
    loading:false
  }), 
  [CLEAR_SELECTED_RECIPES]: (state, action) => ({
    rawMaterialSearch: undefined,
    selectedRows: [],
    selectedRawMaterials: []
  }),
  [SUBMIT_SUPPLIER_SUCCESS]:(state,action) => ({
    selectedSupplier:action.selectedSupplier
  }),
  [CLEAR]: (state, action) => RESET_STORE
});
