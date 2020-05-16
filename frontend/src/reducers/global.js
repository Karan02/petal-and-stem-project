import createReducer from "../createReducer";
// import {CURRENCIES} from '../constants';
import { getToken } from "./user";
import { handleCurrencyChange } from "../reducers/product";
import getSymbolFromCurrency from 'currency-symbol-map'
// ------------------------------------
// Constants
// ------------------------------------
export const SET_CURRENT_PATHNAME = "Global.SET_CURRENT_PATHNAME";
export const SET_CURRENT_ROUTE_NAME = "Global.SET_CURRENT_ROUTE_NAME";

export const SET_CONFIG_VARS = "Global.SET_CONFIG_VARS";

export const CHANGE_CURRENCY = "Global.CHANGE_CURRENCY";

export const GET_CURRENCIES_REQUEST = "Global.GET_CURRENCIES_REQUEST";

export const GET_CURRENCIES_SUCCESS = "Global.GET_CURRENCIES_SUCCESS";

export const GET_CURRENCIES_FAILURE = "Global.GET_CURRENCIES_FAILURE";

export const BODY_FIXED = "Global.BODY_FIXED"

// ------------------------------------
// Actions
// ------------------------------------

export const bodyFixed = (value) => (dispatch,getState) => {
  // console.log("before dispatch",value)
 dispatch({type:BODY_FIXED,value})
}

export const setConfigVars = ({ clientId, clientSecret, apiUrl, locales, appUrl }) => ({
  type: SET_CONFIG_VARS,
  clientId,
  clientSecret,
  apiUrl,
  locales,
  appUrl
});

const getCurrenciesArray = results =>{
  // Object.keys(results).map(key => {
  //   const keyObj = {};
  //   keyObj.label = key;
  //   keyObj.key = key;
  //   keyObj.rate = results[key];
  //   if (key === "USD") {
  //     keyObj.symbol = ["$", ""];
  //   } else if (key === "EUR") {
  //     keyObj.symbol = ["€", ""];
  //   } else if (key === "GBP") {
  //     keyObj.symbol = ["£", ""];
  //   }
  //   return keyObj;
  // });
  let currencyArray = [];
  
  let keyObj = {};
  results.forEach((item) => {
    keyObj.label = item.name;
    keyObj.key = item.name;
    keyObj.rate = item.rate;
    keyObj.id = item.id;
    keyObj.symbol = getSymbolFromCurrency(item.name);
    currencyArray.push(keyObj);
    keyObj = {};
  })
  return currencyArray;
}
  
export const setInitialCurrencies = () => (dispatch, getState, { fetch }) => {
  // dispatch({type: GET_CURRENCIES_REQUEST});
  const { token } = dispatch(getToken());
  return fetch(`/pands/currency/`, {
    method: "GET",
    token,
    success: res => {

      const currenciesArray = getCurrenciesArray(res.results);
      dispatch({ type: GET_CURRENCIES_SUCCESS, currenciesArray });
      
    },
    failure: err => { dispatch({ type: GET_CURRENCIES_FAILURE })}
  });
};

export const setCurrentPathname = currentPathname => ({
  type: SET_CURRENT_PATHNAME,
  currentPathname
});

export const setCurrentRouteName = currentRouteName => ({
  type: SET_CURRENT_ROUTE_NAME,
  currentRouteName
});

export const changeCurrency = key => (dispatch, getState) => {
  const { currencies } = getState().global;
  const currency = currencies.find(item => item.key === key);
  dispatch({ type: CHANGE_CURRENCY, currency });
  dispatch(handleCurrencyChange());
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentPathname: null,
  currentRouteName: null,
  clientId: null,
  clientSecret: null,
  apiUrl: null,
  appUrl: null,
  apiBaseUrl: null,
  currency: {},
  currencies: [],
  locales: [],
  bodyfixed:false
};

const getDefaultCurrencyObj = currencies => {
 
  const currency = currencies.filter(currency =>  currency.label ==="USD" );

  return currency[0];
}

export default createReducer(initialState, {
  [SET_CURRENT_PATHNAME]: (state, { currentPathname }) => ({
    currentPathname
  }),
  [SET_CURRENT_ROUTE_NAME]: (state, { currentRouteName }) => ({
    currentRouteName
  }),
  [SET_CONFIG_VARS]: (state, { clientId, clientSecret, apiUrl, locales, appUrl }) => ({
    clientId,
    clientSecret,
    apiUrl,
    locales,
    appUrl
  }),
  [CHANGE_CURRENCY]: (state, { currency }) => ({
    currency
  }),
  [BODY_FIXED]:(state,{value})=>({
    bodyfixed:value
  }),
  [GET_CURRENCIES_SUCCESS]: (state, { currenciesArray }) => ({
    currencies: currenciesArray,
    currency: getDefaultCurrencyObj(currenciesArray)
  })
});
