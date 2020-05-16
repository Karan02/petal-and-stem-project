import createReducer, {RESET_STORE} from '../createReducer'
import {getIntl} from './intl'
import messages from '../routes/register/messages'
import {getFormErrors} from '../utils'

// ------------------------------------
// Constants
// ------------------------------------
export const REGISTER_REQUEST = 'Register.REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'Register.REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'Register.REGISTER_FAILURE'

export const CLEAR = 'Register.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const register = (values, form) => (dispatch, getState, {fetch}) => {
  dispatch({type: REGISTER_REQUEST})
  const {intl} = dispatch(getIntl())
  return fetch(`/users/`, {
    method: 'POST',
    body: values,
    success: () => {
      dispatch({type: REGISTER_SUCCESS, success: intl.formatMessage(messages.success)})
      form.resetFields()
    },
    failure: (errors) => {
      const {formErrors, error} = getFormErrors({errors, values})
      if (formErrors) {
        form.setFields(formErrors)
        dispatch({type: REGISTER_FAILURE})
      } else {
        dispatch({type: REGISTER_FAILURE, error})
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
  success: null,
  error: null,
}

export default createReducer(initialState, {
  [REGISTER_REQUEST]: (state, action) => ({
    loading: true,
    success: null,
    error: null,
  }),
  [REGISTER_SUCCESS]: (state, {success}) => ({
    loading: false,
    success,
  }),
  [REGISTER_FAILURE]: (state, {error}) => ({
    loading: false,
    error,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
