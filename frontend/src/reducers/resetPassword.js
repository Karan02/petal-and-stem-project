import createReducer, {RESET_STORE} from '../createReducer'
import messages from '../routes/resetPassword/messages'
import {getIntl} from './intl'

// ------------------------------------
// Constants
// ------------------------------------
export const RESET_PASSWORD_REQUEST = 'ResetPassword.REQUEST'
export const RESET_PASSWORD_SUCCESS = 'ResetPassword.SUCCESS'
export const RESET_PASSWORD_FAILURE = 'ResetPassword.FAILURE'

export const CLEAR = 'ResetPassword.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const resetPassword = (values, form) => (dispatch, getState, {fetch}) => {
  dispatch({type: RESET_PASSWORD_REQUEST})
  const {intl} = dispatch(getIntl())
  return fetch(`/users/reset-password/?email=${values.email}`, {
    method: 'GET',
    success: () => {
      dispatch({type: RESET_PASSWORD_SUCCESS, success: intl.formatMessage(messages.success)})
      form.resetFields()
    },
    failure: () => dispatch({type: RESET_PASSWORD_FAILURE, error: intl.formatMessage(messages.error)}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  success: null,
  error: null,
}

export default createReducer(initialState, {
  [RESET_PASSWORD_REQUEST]: (state, action) => ({
    loading: true,
    error: null,
    success: null,
  }),
  [RESET_PASSWORD_SUCCESS]: (state, {success}) => ({
    loading: false,
    success,
  }),
  [RESET_PASSWORD_FAILURE]: (state, {error}) => ({
    loading: false,
    error,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
