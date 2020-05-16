import createReducer, { RESET_STORE } from "../createReducer";
import { getToken } from "./user";
import qs from "query-string";
import compact from "lodash/compact";
import { message } from "antd";
import messages from "../messages";
import { changeSelectedComponents, selectComponents } from "./components";
import { getTotalPrice, UPDATE_PRODUCT_ID } from "./product";
import { getFieldValue } from "../utils";
import { updateSelectedProduct, displayMessages } from "./product";
import _ from "lodash";
import { uploadHelper } from "./uploadHelper"
// import * as Papa from "papaparse";
import axios from "axios";
import {getComponents,getCategoriesComponent} from "./components";

// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONTAINERS_REQUEST = "Container.GET_CONTAINERS_REQUEST";
export const GET_CONTAINERS_SUCCESS = "Container.GET_CONTAINERS_SUCCESS";
export const GET_CONTAINERS_FAILURE = "Container.GET_CONTAINERS_FAILURE";

export const GET_PRICES_REQUEST = "Container.GET_PRICES_REQUEST";
export const GET_PRICES_SUCCESS = "Container.GET_PRICES_SUCCESS";
export const GET_PRICES_FAILURE = "Container.GET_PRICES_FAILURE";

export const ADD_CONTAINER_REQUEST = "Container.ADD_CONTAINER_REQUEST";
export const ADD_CONTAINER_SUCCESS = "Container.ADD_CONTAINER_SUCCESS";
export const ADD_CONTAINER_FAILURE = "Container.ADD_CONTAINER_FAILURE";

export const CLOSE_ADD_INGREDIENT_MODAL = "Container.CLOSE_ADD_INGREDIENT_MODAL";
export const OPEN_ADD_INGREDIENT_MODAL = "Container.OPEN_ADD_INGREDIENT_MODAL";

export const UPDATE_CONTAINER_REQUEST = "Container.UPDATE_CONTAINER_REQUEST";
export const UPDATE_CONTAINER_SUCCESS = "Container.UPDATE_CONTAINER_SUCCESS";
export const UPDATE_CONTAINER_FAILURE = "Container.UPDATE_CONTAINER_FAILURE";

export const OPEN_CONTAINERS_MODAL = "Container.OPEN_CONTAINERS_MODAL";
export const CLOSE_CONTAINERS_MODAL = "Container.CLOSE_CONTAINERS_MODAL";

export const CHANGE_CONTAINER_SEARCH_MODAL =
  "Container.CHANGE_CONTAINER_SEARCH_MODAL";

export const CHANGE_SELECTED_CONTAINER = "Container.CHANGE_SELECTED_CONTAINER";

export const UPDATE_CONTAINER = "Container.UPDATE_CONTAINER";
export const CLEAR_SELECTED_COMPONENTS = "Container.CLEAR_SELECTED_RECIPES";
export const UPLOAD_ACTION = "Container.UPLOAD_ACTION";
// export const UPDATE_CONTAINER = "Container.UPDATE_CONTAINER";
export const CLEAR = "Container.CLEAR";
export const UPDATE_UID = "Container.UPDATE_UID"

export const CLOSE_SUPPLIER_MODAL_CONTAINER = "Container.CLOSE_SUPPLIER_MODAL_CONTAINER";
export const OPEN_SUPPLIER_MODAL_CONTAINER = "Container.OPEN_SUPPLIER_MODAL_CONTAINER";

export const SUBMIT_COMPONENT_REQUEST = "Container.SUBMIT_COMPONENT_REQUEST"
export const SUBMIT_COMPONENT_SUCCESS = "Container.SUBMIT_COMPONENT_SUCCESS"
export const SUBMIT_COMPONENT_FAILURE = "Container.SUBMIT_COMPONENT_FAILURE"
// ------------------------------------
// Actions
// ------------------------------------


export const submitComponent = (obj) => (
  dispatch,
  getState,
  { fetch }
) => {
  const { token } = dispatch(getToken());
  dispatch({ type: SUBMIT_COMPONENT_REQUEST });

  return fetch( `/pands/componentids/`,
    {
      method: "POST",
      token,
      body: {
        ...obj,
        
      },
      success: res => {   
        message.success("Component Successfully added")     
        dispatch({type:SUBMIT_COMPONENT_SUCCESS})
      },
      failure: err => {
        message.success("Unable to add Component , Please try later")     
        dispatch({type:SUBMIT_COMPONENT_FAILURE})
      }
    }
  )

}



export const getContainers = (params = {}) => (
  dispatch,
  getState,
  { fetch }
) => {
  dispatch({ type: GET_CONTAINERS_REQUEST, params });
  const { token } = dispatch(getToken());
  const { search, ordering } = getState().container;
  
  return fetch(
    `/pands/containers/?${qs.stringify({
      search,
      ordering,
      
    })}`,
    {
      method: "GET",
      token,
      success: res => dispatch({ type: GET_CONTAINERS_SUCCESS, res }),
      failure: err => dispatch({ type: GET_CONTAINERS_FAILURE })
    }
  );
};

const setPrices = (values,selectedComponents,currencies)  => {
let prices = []  
values.components.forEach((value)=>{
  if(value.quantity){
    let componentArray = {}
    selectedComponents.forEach((selectedComponent)=>{
      
      if(selectedComponent.component.id === value.component){
        componentArray.component = value.component
        const USD = value.quantity * (selectedComponent.component.ppu);
        let currencyArray = {}
        currencies.forEach((currency)=>{ 
          currencyArray[currency.key] = (currency.rate * USD).toFixed(2);
        })
        componentArray.currencies = currencyArray;    
      }
    })
    prices.push(componentArray)
  }
})
  
    return prices
}


export const getPrices = values => (dispatch, getState, { fetch }) => {
  
  const components = getFieldValue(values.components);
  const { token } = dispatch(getToken());
  dispatch({ type: GET_PRICES_REQUEST, components });
  const { currencies } = getState().global;
  
  const { selectedComponents } = getState().components
  let prices = setPrices(values,selectedComponents,currencies)
  dispatch({ type: GET_PRICES_SUCCESS, prices });
  dispatch(getTotalPrice());
};

export const changeContainerSearch = () => ({
  type: CHANGE_CONTAINER_SEARCH_MODAL
});

export const openContainersModal = () => (dispatch, getState) => {
  dispatch({ type: OPEN_CONTAINERS_MODAL });
  dispatch(getContainers());
};

export const closeContainersModal = () => ({ type: CLOSE_CONTAINERS_MODAL });

export const changeSelectedContainer = selectedContainer => (
  dispatch,
  getState
) => {
  dispatch({ type: CHANGE_SELECTED_CONTAINER, selectedContainer });
  dispatch(
    changeSelectedComponents(
      selectedContainer ? selectedContainer.components : []
    )
  );
};

const addOrUpdateContainerState = (
  selectedContainerComponents,
  valuesComponents,
  isAdd
) => {
  for (
    var component = 0;
    component < selectedContainerComponents.length;
    component++
  ) {
    for (var value = 0; value < valuesComponents.length; value++) {
      if (
        valuesComponents[value] &&
        valuesComponents[value].component ===
          selectedContainerComponents[component].component.id
      ) {
        selectedContainerComponents[component].quantity =
          valuesComponents[value].quantity;
      }
    }
  }
};

export const addContainer = values => (dispatch, getState, { fetch }) => {
 
  dispatch({ type: ADD_CONTAINER_REQUEST });
  const { selectedComponents } = getState().components;
  const { currencies } = getState().global;
  const { token } = dispatch(getToken());

  // addOrUpdateContainerState(selectedComponents.map(item => item.component), values.components, true);

  return fetch(`/pands/containers/`, {
    method: "POST",
    token,
    body: {
      // TODO move it to utils
      // to remove undefined values and set right order
      components: selectedComponents.map(item =>
        compact(values.components).find(v => v.component === item.component.id)
      ),
      name: values.name,
      currencies: currencies.map(item => item.key)
    },
    success: container => {
      const { containers } = getState().container;
      dispatch({
        type: ADD_CONTAINER_SUCCESS,
        containers: [...containers, container]
      });
      dispatch(changeSelectedContainer(container));
      // message.success(messages.addContainerSuccess);
      dispatch(displayMessages(messages.addContainerSuccess));
    },
    failure: err => {
      dispatch({ type: ADD_CONTAINER_FAILURE });
      // message.error(messages.addContainerError);
      dispatch(displayMessages(messages.addContainerError));
    }
  });
};

export const updateContainer = values => async (
  dispatch,
  getState,
  { fetch }
) => {
  dispatch({ type: UPDATE_CONTAINER_REQUEST });
  const { token } = dispatch(getToken());
  let selectedContainerObj = _.cloneDeep(
    getState().container.selectedContainer
  );
  let containersObj = _.cloneDeep(getState().container.containers);
  let selectedComponentsObj = _.cloneDeep(
    getState().components.selectedComponents
  );
  const { currencies } = getState().global;
  // let components = values.components;

  addOrUpdateContainerState(selectedContainerObj.components, values.components);
  // // await dispatch({ type: UPDATE_CONTAINER, components });

  for (
    var component = 0;
    component < selectedComponentsObj.length;
    component++
  ) {
    if (!("id" in selectedComponentsObj[component])) {
      selectedComponentsObj[component].id = Math.floor(Math.random() * 100);
    }
    for (var info = 0; info < values.components.length; info++) {
      if (values.components[info]) {
        if (
          selectedComponentsObj[component].component.id ===
          values.components[info].component
        ) {
          selectedComponentsObj[component].quantity =
            values.components[info].quantity;
        }
      }
    }
    if (!selectedComponentsObj[component].type) {
      selectedComponentsObj[component].type = "secondary";
    }
  }
  // we have to make changes below
  let temporarayArray = selectedContainerObj;
  selectedContainerObj = selectedComponentsObj;

  // dispatch({ type: UPDATE_CONTAINER, selectedContainer });
  dispatch(updateSelectedProduct(selectedContainerObj));
  selectedContainerObj = temporarayArray;
  const tempArray = selectedComponentsObj.map(item =>
    compact(values.components).find(v => v.component === item.component.id)
  );
  return fetch(`/pands/containers/${selectedContainerObj.id}/`, {
    method: "PATCH",
    token,
    body: {
      // to remove undefined values and set right order
      components: tempArray,
      name: values.name,
      action: "replace",
      currencies: currencies.map(item => item.key)
    },
    success: updatedContainer => {
      
      dispatch({
        type: UPDATE_CONTAINER_SUCCESS,
        containers: containers.map(item =>
          item.id === updatedContainer.id ? updatedContainer : item
        )
      });
      dispatch(displayMessages(messages.updateContainerSuccess));
      // message.success(messages.updateContainerSuccess);
    },
    failure: err => {
      
      dispatch({ type: UPDATE_CONTAINER_FAILURE });
      dispatch(displayMessages(messages.updateContainerError));
      // message.error(messages.updateContainerError);
    }
  });
};

export const openAddContainerModal = () => (dispatch, getState) => {
  dispatch({ type: OPEN_ADD_INGREDIENT_MODAL });
  // dispatch(getAddContainer());
};

export const closeAddContainerModal = () => ({
  type: CLOSE_ADD_INGREDIENT_MODAL
});


export const onContainerImportChange = event => (dispatch, getState) => {
  let {  selectedFileList, uid } = getState().container;
  const { token } = dispatch(getToken());
 
  const feedback = uploadHelper(event,uid,selectedFileList);
  selectedFileList = feedback[0];
  uid = feedback[1];
  dispatch({ type: UPLOAD_ACTION, uid,selectedFileList  });
  if(feedback.length === 3){
    const formData = new FormData();
    formData.append("file", event.file.originFileObj, event.file.originFileObj.name);
    const { apiUrl } = getState().global;
    return fetch(apiUrl + `/pands/uploadc/`, {
      method: "POST",
      // token,
      headers:{
        "Authorization": 'Bearer ' + token
     },
      body: formData
    }).then(response => response.json())
    .then(parsedResponse => {
      message.success(`Components uploaded successfully.`);
      dispatch(getComponents());
      // dispatch(getCategoriesComponent());
    });
  }
};

export const onDownloadClick = () => (dispatch, getState) => {
   const a = document.createElement('a');
   let { apiUrl } = getState().global;
   a.href = apiUrl + `/static/containers_template_7.xlsx`;
   a.click();
};
export const clearSelectedComponent = () => dispatch => {
  dispatch({ type: CLEAR_SELECTED_COMPONENTS });
};
export const clear = () => ({ type: CLEAR });


export const openSupplierModalContainer = () => (dispatch,getState) => {

  dispatch({type:OPEN_SUPPLIER_MODAL_CONTAINER})
}
export const closeSupplierModalContainer = () => (dispatch,getState) => {
  dispatch({type:CLOSE_SUPPLIER_MODAL_CONTAINER})
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    containers: false,
    addingContainer: false,
    updatingContainer: false,
    prices: false
  },
  containers: [],
  components: [],
  prices: [],
  search: undefined,
  ordering: undefined,
  filters: {},
  containerSearch: undefined,
  containersModalOpened: false,
  selectedContainer: undefined,
  error: null,
  // selectedFile: null,
  selectedFileList: null,
  uid: 'k',
  addContainerModal:false,
  suppliers:[],
  supplierModalOpened:false,
};

export default createReducer(initialState, {
  [GET_CONTAINERS_REQUEST]: (state, { params }) => ({
    search: params.search !== undefined ? params.search : state.search,
    ordering: params.sorter
      ? `${params.sorter.order === "descend" ? "-" : ""}${params.sorter.field}`
      : state.ordering,
    filters: params.filters || state.filters,
    loading: {
      ...state.loading,
      containers: true
    }
  }),
  [GET_CONTAINERS_SUCCESS]: (state, { res: { results } }) => ({
    containers: results,
    loading: {
      ...state.loading,
      containers: false
    }
  }),
  [GET_CONTAINERS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      containers: false
    }
  }),
  [OPEN_SUPPLIER_MODAL_CONTAINER]:(state,action) => ({
    supplierModalOpened:true
  }),
  [CLOSE_SUPPLIER_MODAL_CONTAINER]:(state,action) => ({
    supplierModalOpened:false
  }),
  [OPEN_CONTAINERS_MODAL]: (state, action) => ({
    containersModalOpened: true
  }),
  [CLOSE_CONTAINERS_MODAL]: (state, action) => ({
    containersModalOpened: false,
    search: undefined
  }),
  [OPEN_ADD_INGREDIENT_MODAL]:(state,action) => ({
    addContainerModal:true
  }),
  [CLOSE_ADD_INGREDIENT_MODAL]:(state,action) => ({
    addContainerModal:false
  }),
  [CHANGE_CONTAINER_SEARCH_MODAL]: (state, { containerSearch }) => ({
    containerSearch
  }),
  [CHANGE_SELECTED_CONTAINER]: (state, { selectedContainer }) => ({
    selectedContainer
  }),
  [ADD_CONTAINER_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      addingContainer: true
    }
  }),
  [ADD_CONTAINER_SUCCESS]: (state, { containers }) => ({
    containers,
    loading: {
      ...state.loading,
      addingContainer: false
    }
  }),
  [ADD_CONTAINER_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      addingContainer: false
    }
  }),
  [UPDATE_CONTAINER_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingContainer: true
    }
  }),
  [UPDATE_CONTAINER_SUCCESS]: (state, { containers }) => ({
    containers,
    loading: {
      ...state.loading,
      updatingContainer: false
    }
  }),
  [UPDATE_CONTAINER_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingContainer: false
    }
  }),
  [GET_PRICES_REQUEST]: (state, { components }) => ({
    prices: [],
    components,
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
  // [UPDATE_CONTAINER]: (state, { components }) => ({
  //   components
  // }),
  [UPDATE_CONTAINER]: (state, { selectedContainer }) => ({
    selectedContainer
  }),
  [CLEAR_SELECTED_COMPONENTS]: state => ({
    components: [],
    prices: [],
    selectedContainer: undefined
  }),
  [UPLOAD_ACTION]: (state, {  uid, selectedFileList }) => ({
    uid,
    selectedFileList,
  }),
  // [UPDATE_UID]: (state,{uid}) => ({
  //   uid,
  // }),
  [CLEAR]: (state, action) => RESET_STORE
});
