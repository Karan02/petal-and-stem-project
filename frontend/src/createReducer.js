export const RESET_STORE = Symbol('RESET_STORE')

export default (initialState, handlers, finalizer = x => x) => (state = initialState, action) => {
  if (action.type) {
    const handler = handlers[action.type]
    if (handler) {
      const result = handler(state, action)
      if (result === RESET_STORE) {
        return initialState
      }
      if (result === null && typeof result === 'object') {
        return state
      }
      return finalizer({...state, ...result})
    }
  }
  return state
}

export const createFetchTypes = (namespace, prefix) => ({
  REQUEST: `${namespace}.${prefix}_REQUEST`,
  SUCCESS: `${namespace}.${prefix}_SUCCESS`,
  FAILURE : `${namespace}.${prefix}_FAILURE`,
})
