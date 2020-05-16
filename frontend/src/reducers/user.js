import createReducer, {RESET_STORE} from '../createReducer'
import {loginSuccess} from './login'
import {PREV_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, TOKEN_COOKIE} from '../constants'
import {getIntl} from './intl'
import {getFormErrors} from '../utils'
import messages from './messages'
import {message} from 'antd'
import { signOut } from './product';
import {cleardilution} from "./dilution";

// ------------------------------------
// Constants
// ------------------------------------
export const LOGOUT_REQUEST = 'User.LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'User.LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'User.LOGOUT_FAILURE'

export const GET_USER_REQUEST = 'User.GET_USER_REQUEST'
export const GET_USER_SUCCESS = 'User.GET_USER_SUCCESS'
export const GET_USER_FAILURE = 'User.GET_USER_FAILURE'

export const REFRESH_TOKEN_REQUEST = 'User.REFRESH_TOKEN_REQUEST'
export const REFRESH_TOKEN_SUCCESS = 'User.REFRESH_TOKEN_SUCCESS'
export const REFRESH_TOKEN_FAILURE = 'User.REFRESH_TOKEN_FAILURE'

export const UPDATE_USER_REQUEST = 'User.UPDATE_USER_REQUEST'
export const UPDATE_USER_SUCCESS = 'User.UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAILURE = 'User.UPDATE_USER_FAILURE'

export const OPEN_UPDATE_USER_MODAL = 'User.OPEN_UPDATE_USER_MODAL'
export const CLOSE_UPDATE_USER_MODAL = 'User.CLOSE_UPDATE_USER_MODAL'

export const UPDATE_PASSWORD_REQUEST = 'User.UPDATE_PASSWORD_REQUEST'
export const UPDATE_PASSWORD_SUCCESS = 'User.UPDATE_PASSWORD_SUCCESS'
export const UPDATE_PASSWORD_FAILURE = 'User.UPDATE_PASSWORD_FAILURE'

export const OPEN_UPDATE_PASSWORD_MODAL = 'User.OPEN_UPDATE_PASSWORD_MODAL'
export const CLOSE_UPDATE_PASSWORD_MODAL = 'User.CLOSE_UPDATE_PASSWORD_MODAL'

let refreshingToken = false

// ------------------------------------
// Actions
// ------------------------------------


export const expireToken = () => (dispatch, getState, {cookies}) => {
  cookies.remove(TOKEN_COOKIE, {path: ''})
  cookies.remove(REFRESH_TOKEN_COOKIE, {path: ''})
  cookies.remove(PREV_TOKEN_COOKIE, {path: ''})
}

export const logoutSuccess = () => (dispatch,getState) => {
  dispatch(cleardilution())
  dispatch(expireToken())
  dispatch({type: LOGOUT_SUCCESS})
}

export const refreshToken = (token, refresh_token) => (dispatch, getState, {fetch, history}) => {
  if (refreshingToken) {
    return
  }
  refreshingToken = true
  dispatch({type: REFRESH_TOKEN_REQUEST})
  const {clientId, clientSecret, currentPathname} = getState().global
  return fetch(`/auth/token/`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token,
    },
    success: (res) => {
      dispatch(loginSuccess(res, true, currentPathname))
      dispatch({type: REFRESH_TOKEN_SUCCESS})
    },
    failure: (err) => {
      dispatch(logoutSuccess())
      dispatch({type: REFRESH_TOKEN_FAILURE})
      if (process.env.BROWSER) {
        // refresh page to resend requests
        history.replace(currentPathname)
      }
    }
  })
}

export const getToken = () => (dispatch, getState, {history, cookies}) => {
  const {currentPathname} = getState().global
  const {loggedIn} = getState().user
  const token = cookies.get(TOKEN_COOKIE)
 
  const refresh_token = cookies.get(REFRESH_TOKEN_COOKIE)
  const prevToken = cookies.get(PREV_TOKEN_COOKIE)
  if (!token) {
    if (prevToken && refresh_token) {
      dispatch(refreshToken(prevToken, refresh_token))
    } else if (loggedIn) {
      dispatch(logoutSuccess())
      if (process.env.BROWSER) {
        // refresh page to resend requests
        history.replace(currentPathname)
      }
    }
    return {}
  }
  return {token, refresh_token}
}

export const logout = () => (dispatch, getState, {fetch}) => {
  signOut(dispatch);
  const {clientId, clientSecret} = getState().global
  const {token} = dispatch(getToken())
  dispatch({type: LOGOUT_REQUEST})
  return fetch(`/auth/revoke-token/`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    token,
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      token,
    },
    success: (res) => dispatch(logoutSuccess(res)),
    failure: (err) => dispatch({type: LOGOUT_FAILURE, err})
  })
}

export const getUser = () => (dispatch, getState, {fetch}) => {

  const {token} = dispatch(getToken())
  const {user} = getState().user
  
  if (!user
     && token
    ) {
    dispatch({type: GET_USER_REQUEST})
     return fetch(`/users/me/`, {
      method: 'GET',
      token,
      success: (user) => dispatch({type: GET_USER_SUCCESS, user}),
      failure: () => dispatch({type: GET_USER_FAILURE})
    })
  }
   else {
    return user
  }
  
}

export const updateUser = (values, form) => (dispatch, getState, {fetch}) => {
  
  const {intl} = dispatch(getIntl())
  const {token} = dispatch(getToken())
  dispatch({type: UPDATE_USER_REQUEST})
  return fetch(`/users/me/`, {
    method: 'PATCH',
    token,
    body: values,
    success: (user) => {
      dispatch({type: UPDATE_USER_SUCCESS, user})
      dispatch(closeUpdateUserModal())
      message.success(intl.formatMessage(messages.updatingUserSuccess))
    },
    failure: (errors) => {
      dispatch({type: UPDATE_USER_FAILURE})
      const {formErrors} = getFormErrors({errors, values})
      if (formErrors)
        form.setFields(formErrors)
      else
        message.error(intl.formatMessage(messages.updatingUserError))
    }
  })
}

export const openUpdateUserModal = () => ({type: OPEN_UPDATE_USER_MODAL})

export const closeUpdateUserModal = () => ({type: CLOSE_UPDATE_USER_MODAL})

export const updatePassword = (values) => (dispatch, getState, {fetch}) => {
  const {intl} = dispatch(getIntl())
  const {token} = dispatch(getToken())
  dispatch({type: UPDATE_PASSWORD_REQUEST})
  return fetch(`/users/me/change-password/`, {
    method: 'PATCH',
    token,
    body: values,
    success: () => {
      dispatch({type: UPDATE_PASSWORD_SUCCESS})
      dispatch(closeUpdatePasswordModal())
      message.success(intl.formatMessage(messages.updatingPasswordSuccess))
    },
    failure: (errors) => {
      const {error} = getFormErrors({errors, values})
      dispatch({type: UPDATE_PASSWORD_FAILURE, error})
    }
  })
}

export const openUpdatePasswordModal = () => ({type: OPEN_UPDATE_PASSWORD_MODAL})

export const closeUpdatePasswordModal = () => ({type: CLOSE_UPDATE_PASSWORD_MODAL})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    user: false,
    updatingUser: false,
    updatingPassword: false,
  },
  loggedIn: false,
  error: null,
  user: null,
  refreshingToken: false,
  customer: null,
  updateUserModalOpened: false,
  updatePasswordModalOpened: false,
}

export default createReducer(initialState, {
  
  [LOGOUT_SUCCESS]: (state, action) => RESET_STORE,
  [GET_USER_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      user: true,
    },
  }),
  [GET_USER_SUCCESS]: (state, {user}) => ({
    loading: {
      ...state.loading,
      user: false,
    },
    user,
    customer: user.customer,
    loggedIn: true,
  }),
  [GET_USER_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      user: false,
    },
  }),
  [REFRESH_TOKEN_REQUEST]: (state, action) => ({
    refreshingToken: true,
  }),
  [REFRESH_TOKEN_SUCCESS]: (state, action) => ({
    refreshingToken: false,
  }),
  [REFRESH_TOKEN_FAILURE]: (state, action) => ({
    refreshingToken: false,
  }),
  [OPEN_UPDATE_USER_MODAL]: (state, action) => ({
    updateUserModalOpened: true,
  }),
  [CLOSE_UPDATE_USER_MODAL]: (state, action) => ({
    updateUserModalOpened: false,
  }),
  [UPDATE_USER_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingUser: true,
    }
  }),
  [UPDATE_USER_SUCCESS]: (state, {user}) => ({
    user,
    customer: user.customer,
    loading: {
      ...state.loading,
      updatingUser: false,
    }
  }),
  [UPDATE_USER_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingUser: false,
    }
  }),
  [OPEN_UPDATE_PASSWORD_MODAL]: (state, action) => ({
    updatePasswordModalOpened: true,
  }),
  [CLOSE_UPDATE_PASSWORD_MODAL]: (state, action) => ({
    updatePasswordModalOpened: false,
  }),
  [UPDATE_PASSWORD_REQUEST]: (state, action) => ({
    error: null,
    loading: {
      ...state.loading,
      updatingPassword: true,
    }
  }),
  [UPDATE_PASSWORD_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingPassword: false,
    }
  }),
  [UPDATE_PASSWORD_FAILURE]: (state, {error}) => ({
    error,
    loading: {
      ...state.loading,
      updatingPassword: false,
    }
  }),
})
