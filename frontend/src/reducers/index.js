import {combineReducers} from 'redux'
import global from './global'
import intl from './intl'
import recipe from './recipe'
import rawMaterials from './rawMaterials'
import container from './container'
import components from './components'
import product from './product'
import user from './user'
import login from './login'
import register from './register'
import resetPassword from './resetPassword'
import setPassword from './setPassword'
import dilution from './dilution'
import piechart from "./piechart"

export default combineReducers({
  global,
  intl,
  recipe,
  rawMaterials,
  container,
  components,
  product,
  user,
  login,
  register,
  resetPassword,
  setPassword,
  dilution,
  piechart
})
