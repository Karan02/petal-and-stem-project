import createReducer, { RESET_STORE } from "../createReducer";
import { getToken } from "./user";
import qs from "query-string";
import uniqBy from "lodash/uniqBy";
import { getPrices } from "./container";
import has from "lodash/has";
import { message } from "antd";
import { PAGE_SIZE } from "../constants";

// ------------------------------------
// Constants
// ------------------------------------
export const GET_COMPONENTS_REQUEST = "Components.GET_COMPONENTS_REQUEST";
export const GET_COMPONENTS_SUCCESS = "Components.GET_COMPONENTS_SUCCESS";
export const GET_COMPONENTS_FAILURE = "Components.GET_COMPONENTS_FAILURE";

export const GET_SPECIFIC_REQUEST = "Components.GET_SPECIFIC_REQUEST";
export const GET_SPECIFIC_SUCCESS = "Components.GET_SPECIFIC_SUCCESS";
export const GET_SPECIFIC_FAILURE = "Components.GET_SPECIFIC_FAILURE";



export const OPEN_COMPONENTS_MODAL = "Components.OPEN_COMPONENTS_MODAL";
export const CLOSE_COMPONENTS_MODAL = "Components.CLOSE_COMPONENTS_MODAL";

export const CHANGE_COMPONENT_SEARCH_MODAL =
  "Components.CHANGE_COMPONENT_SEARCH_MODAL";
export const CHANGE_SELECTED_ROWS = "Components.CHANGE_SELECTED_ROWS";

export const CHANGE_SELECTED_COMPONENTS =
  "Components.CHANGE_SELECTED_COMPONENTS";

export const SAVE_FIELDS = "Components.SAVE_FIELDS";

export const CLEAR_SELECTED_COMPONENTS = "Components.CLEAR_SELECTED_COMPONENTS";
export const CLEAR = "Components.CLEAR";

export const LOADING_COMPONENTS = "Components.LOADING_COMPONENTS";

export const DELETE_COMPONENT_REQUEST =
"Components.DELETE_COMPONENT_REQUEST";
export const DELETE_COMPONENT_SUCCESS =
"Components.DELETE_COMPONENT_SUCCESS";
export const DELETE_COMPONENT_FAILURE =
"Components.DELETE_COMPONENT_FAILURE";

export const GET_CATEGORIES_COMPONENT_REQUEST = "RawMaterials.GET_CATEGORIES_COMPONENT_REQUEST"

export const GET_CATEGORIES_COMPONENT_SUCCESS = "RawMaterials.GET_CATEGORIES_COMPONENT_SUCCESS"

export const GET_CATEGORIES_COMPONENT_FAILURE = "RawMaterials.GET_CATEGORIES_COMPONENT_FAILURE"

export const PUSH_COMPONENTS = "RawMaterials.PUSH_COMPONENTS"
// ------------------------------------
// Actions
// ------------------------------------
export const getComponents = (params = {}) => (
  dispatch,
  getState,
  { fetch }
) => {
  dispatch({ type: GET_COMPONENTS_REQUEST, params });
  const { token } = dispatch(getToken());
  // const page = params.page ? params.page:undefined
  const page_size = params.page_size ? params.page_size:undefined
  const { search, ordering, only_mine,cat,page } = getState().components;
  return fetch(
    `/pands/components/?${qs.stringify({
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
      success: res =>{
        // console.log("res",res)
        const count = res.count
        const components = res.results
        if(params.ispush) dispatch({type:PUSH_COMPONENTS,components})
        else dispatch({ type: GET_COMPONENTS_SUCCESS, res, count })},
      failure: err => dispatch({ type: GET_COMPONENTS_FAILURE })
    }
  );
};


export const handleDelete = (id) => (dispatch,getState,{ fetch }) => {
  const { token } = dispatch(getToken());
  dispatch({ type: DELETE_COMPONENT_REQUEST });
  return fetch(`/pands/components/${id}`,{
    method: "DELETE",
    token,
    success: res =>{ 
      
      dispatch(getComponents());
      dispatch({ type: DELETE_COMPONENT_SUCCESS, res })},
    failure: err => dispatch({ type: DELETE_COMPONENT_FAILURE })
  })
}

export const changeComponentSearch = () => ({
  type: CHANGE_COMPONENT_SEARCH_MODAL
});

export const openComponentsModal = () => (dispatch, getState) => {
  dispatch({ type: OPEN_COMPONENTS_MODAL });
  // dispatch(getComponents());
};

export const closeComponentsModal = () => ({ type: CLOSE_COMPONENTS_MODAL });

export const changeSelectedRows = (keys, selectedRows) => ({
  type: CHANGE_SELECTED_ROWS,
  selectedRows
});

export const changeSelectedComponents = selectedComponents => (
  dispatch,
  getState
) => {
  dispatch({ type: CHANGE_SELECTED_COMPONENTS, selectedComponents });
};

export const selectComponents = newRows => (dispatch, getState) => {
  const { selectedComponents } = getState().components;
  const newComponents = newRows.map(item => ({ component: item }));
  dispatch(
    changeSelectedComponents(
      uniqBy([...selectedComponents, ...newComponents], "component.id")
    )
  );
  // load whole list of items
  // dispatch(getComponents({ search: undefined }));
};

export const deselectComponent = removedRow => (dispatch, getState) => {
  const { selectedComponents } = getState().components;
  dispatch(
    changeSelectedComponents(
      selectedComponents.filter(
        item => item.component.id !== removedRow.component.id
      )
    )
  );
};

export const saveFields = (fields, changedFields) => (dispatch, getState) => {

  dispatch({ type: SAVE_FIELDS, fields });
  const componentsChanged =
    Object.keys(changedFields).find(key => key.includes("components")) ||
    // if user deselects existing container
    changedFields.name === undefined;
  if (componentsChanged) {
    dispatch(getPrices(fields));
  }
};

export const clearSelectedComponent = () => dispatch => {
  dispatch({ type: CLEAR_SELECTED_COMPONENTS });
};
export const clear = () => ({ type: CLEAR });

export const loadingComponents = () => (dispatch, getState) => {
  let { componentsLoad } = getState().components;
  componentsLoad = true;
  
  dispatch({ type: LOADING_COMPONENTS, componentsLoad });
};

export const getCategoriesComponent = () => (dispatch,getState,{fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type:GET_CATEGORIES_COMPONENT_REQUEST})
  return fetch(`/pands/components/categories/`,
  {method:"GET",
  token,
  success: res => {
    dispatch({type:GET_CATEGORIES_COMPONENT_SUCCESS,res})
    let containerID = res.filter(category => category.name === "Container")
    // dispatch(getSpecificComponents({cat:containerID[0].id}))
    dispatch(getComponents({cat:containerID[0].id,page:1,search:undefined}))

  },
  failure:res =>{
    dispatch({type:GET_CATEGORIES_COMPONENT_FAILURE})

  }})
}


export const getComponentsSelectedCategory = (selectedCategory,only_mine) => (dispatch,getState) => {
  const {categories} = getState().components
  let category = categories.filter(i => i.name === selectedCategory)
  // dispatch(getSpecificComponents(category[0].id}))
  if(!category.length){
    dispatch(getComponents({cat:undefined,page:1,search:undefined,only_mine:only_mine ? 1:0}))
    return
  }
  dispatch(getComponents({cat:category[0].id,page:1,search:undefined,only_mine:only_mine ? 1:0}))
}


export const handleDeleteAll = (ids,pagenumber,alreadyExist) => (dispatch,getState,{fetch}) => {
  const { token } = dispatch(getToken());
  dispatch({ type: DELETE_COMPONENT_REQUEST });
  return fetch(`/pands/deletecomponents/`,{
    method: "DELETE",
    token,
    body:{
      "ids":ids
    },
    success: res =>{ 
      dispatch(getComponents({ page: pagenumber, page_size: PAGE_SIZE }));
      dispatch({ type: DELETE_COMPONENT_SUCCESS, res })
      if(alreadyExist.length > 0) return  message.success("Components deleted, note that petal and stem components are not deleted")
      message.success("Deleted all selected Components")
    },
    failure: err => {
      message.error("Deleting failed, Please try later")
      dispatch({ type: DELETE_COMPONENT_FAILURE })}
  })
}


export const getSpecificComponents = (id) => (dispatch,getState,{fetch}) => {
  const {token} = dispatch(getToken())
  let params = {}
  dispatch({ type: GET_SPECIFIC_REQUEST, params });
  return fetch(`/pands/categories/${id}/component/`,{
    token,
    method:"GET",
    success: res => {
        let components = res
        dispatch({ type: GET_SPECIFIC_SUCCESS, components });
        
    },
    failure: (err) => {
      dispatch({ type: GET_SPECIFIC_FAILURE })
    }
  })

}


// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  components: [],
  search: undefined,
  ordering: undefined,
  filters: {},
  only_mine:0,
  cat:undefined,
  page:1,
  componentSearch: undefined,
  componentsModalOpened: false,
  selectedRows: [],
  selectedComponents: [],
  fields: {},
  componentsLoad: false,
  count:0,
  categories:[],
  categoriesLoad:false
};

export default createReducer(initialState, {
  [GET_COMPONENTS_REQUEST]: (state, { params }) => ({
    search: has(params, "search") ? params.search : state.search,
    ordering: params.sorter  ? `${params.sorter.order === "descend" ? "-" : ""}${params.sorter.columnKey}` : state.ordering,
    filters: params.filters || state.filters,
    loading: true,
    only_mine:(params.only_mine == 1 || params.only_mine == 0) ? params.only_mine : state.only_mine,
    cat:params.cat ? (params.cat == 1000 ? undefined:params.cat):(params.cat == 0 ? undefined:state.cat),
    page:params.page ? params.page:state.page
  }),

  [GET_COMPONENTS_SUCCESS]: (state, { res: { results },count }) => ({
    components: results,
    loading: false,
    componentsLoad: false,
    count:count
  }),
  [GET_COMPONENTS_FAILURE]: (state, action) => ({
    loading: false,
    componentsLoad: false
  }),
  [GET_SPECIFIC_REQUEST]:(state,action) => ({
    loading:true,
    componentsLoad:true
  }),
  [GET_SPECIFIC_SUCCESS]:(state,action) => ({
    loading: false,
    componentsLoad: false,
    components:action.components
  }),
  [PUSH_COMPONENTS]:(state,action) =>({
    components:state.components.concat(action.components),
    loading: false,
    componentsLoad: false
  }),
  [GET_SPECIFIC_FAILURE]:(state,action) => ({
    loading: false,
    componentsLoad: false,
  }),
  [OPEN_COMPONENTS_MODAL]: (state, action) => ({
    componentsModalOpened: true
  }),
  [CLOSE_COMPONENTS_MODAL]: (state, action) => ({
    componentsModalOpened: false,
    selectedRows: [],
    search: undefined
  }),
  [CHANGE_COMPONENT_SEARCH_MODAL]: (state, { componentSearch }) => ({
    componentSearch
  }),
  [CHANGE_SELECTED_ROWS]: (state, { selectedRows }) => ({
    selectedRows
  }),
  [CHANGE_SELECTED_COMPONENTS]: (state, { selectedComponents }) => ({
    selectedComponents
  }),
  [SAVE_FIELDS]: (state, { fields }) => ({
    fields: {
      ...state.fields,
      ...fields
    }
  }),
  [GET_CATEGORIES_COMPONENT_REQUEST]:(state,action) => ({
    categoriesLoad:true
  }),
  [GET_CATEGORIES_COMPONENT_SUCCESS]:(state,action) => ({
    categoriesLoad:false,
    categories:action.res
  }),
  [GET_CATEGORIES_COMPONENT_FAILURE]:(state,action) => ({
    categoriesLoad:false
  }),
  [DELETE_COMPONENT_REQUEST]: (state, action) => ({
    loading:true
   }),
  [DELETE_COMPONENT_SUCCESS]:(state,action) =>({
    loading:false
  }),
  [DELETE_COMPONENT_FAILURE]:(state,action) =>({
    loading:false
  }), 
  [CLEAR_SELECTED_COMPONENTS]: state => ({
    selectedRows: [],
    selectedComponents: []
  }),
  [LOADING_COMPONENTS]: (state, { componentsLoad }) => ({
    componentsLoad
  }),
  [CLEAR]: (state, action) => RESET_STORE
});
