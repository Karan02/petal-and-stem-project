import createReducer, {RESET_STORE} from '../createReducer'
import {getUser} from './user'
import {PREV_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, TOKEN_COOKIE, WEEK} from '../constants'
import {getIntl} from './intl'
import messages from '../routes/login/messages'
import {message} from 'antd'

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_REQUEST = 'Login.LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'Login.LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'Login.LOGIN_FAILURE'

export const ACTIVATE_REQUEST = 'Login.ACTIVATE_REQUEST'
export const ACTIVATE_SUCCESS = 'Login.ACTIVATE_SUCCESS'
export const ACTIVATE_FAILURE = 'Login.ACTIVATE_FAILURE'

export const CLEAR = 'Login.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const login = (values, redirectUrl) => (dispatch, getState, {fetch}) => {
  dispatch({type: LOGIN_REQUEST})
  const {clientId, clientSecret} = getState().global
  const {intl} = dispatch(getIntl())
  return fetch(`/auth/token/`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      username: values.email,
      password: values.password,
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
    },
    success: (res) => dispatch(loginSuccess(res, redirectUrl)),
    failure: () => dispatch({type: LOGIN_FAILURE, error: intl.formatMessage(messages.loginError)})
  })
}

export const loginSuccess = (auth, redirectUrl = '/') => (dispatch, getState, {history, cookies}) => {
  dispatch({type: LOGIN_SUCCESS})
  cookies.set(TOKEN_COOKIE, auth.access_token, {maxAge: auth.expires_in})
  cookies.set(REFRESH_TOKEN_COOKIE, auth.refresh_token, {maxAge: WEEK})
  cookies.set(PREV_TOKEN_COOKIE, auth.access_token, {maxAge: WEEK})
  dispatch(getUser())
  if (process.env.BROWSER) {
    history.push(redirectUrl)
  }
}

export const activate = (params) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: ACTIVATE_REQUEST})
  const {intl} = dispatch(getIntl())
  return fetch(`/users/activate/`, {
    method: 'PATCH',
    body: params,
    success: () => {
      dispatch({type: ACTIVATE_SUCCESS})
      message.success(intl.formatMessage(messages.activationSuccess))
      // to prevent redirecting on server
      if (process.env.BROWSER) {
        // TODO use route
        history.replace('/login')
      }
    },
    failure: () => {
      dispatch({type: ACTIVATE_FAILURE, error: intl.formatMessage(messages.activationError)})
      // to prevent redirecting on server
      if (process.env.BROWSER) {
        history.replace('/login')
      }
    },
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
  [LOGIN_REQUEST]: (state, action) => ({
    loading: true,
    error: null,
  }),
  [LOGIN_SUCCESS]: (state, action) => ({
    loading: false,
    error: null,
  }),
  [LOGIN_FAILURE]: (state, {error}) => ({
    loading: false,
    error,
  }),
  [ACTIVATE_REQUEST]: (state, action) => ({
    success: null,
    error: null,
  }),
  [ACTIVATE_SUCCESS]: (state, action) => ({
    error: null,
  }),
  [ACTIVATE_FAILURE]: (state, {error}) => ({
    success: null,
    error,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
