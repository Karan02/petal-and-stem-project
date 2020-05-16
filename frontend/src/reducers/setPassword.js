import createReducer, {RESET_STORE} from '../createReducer'
import {message} from 'antd'
import messages from '../routes/setPassword/messages'
import {getIntl} from './intl'
import {generateUrl} from '../router'
import {LOGIN_ROUTE} from '../routes'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PASSWORD_REQUEST = 'SetPassword.SET_PASSWORD_REQUEST'
export const SET_PASSWORD_SUCCESS = 'SetPassword.SET_PASSWORD_SUCCESS'
export const SET_PASSWORD_FAILURE = 'SetPassword.SET_PASSWORD_FAILURE'

export const CLEAR = 'SetPassword.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const setPassword = (values) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: SET_PASSWORD_REQUEST})
  const {intl} = dispatch(getIntl())
  return fetch(`/users/set-password/`, {
    method: 'POST',
    body: values,
    success: (res) => {
      dispatch({type: SET_PASSWORD_SUCCESS})
      history.push(generateUrl(LOGIN_ROUTE))
      message.success(intl.formatMessage(messages.success))
    },
    failure: (err) => dispatch({type: SET_PASSWORD_FAILURE, error: intl.formatMessage(messages.error)}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  error: null,
}

export default createReducer(initialState, {
  [SET_PASSWORD_REQUEST]: (state, action) => ({
    loading: true,
    error: null,
  }),
  [SET_PASSWORD_SUCCESS]: (state, action) => ({
    loading: false,
  }),
  [SET_PASSWORD_FAILURE]: (state, {error}) => ({
    loading: false,
    error,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
