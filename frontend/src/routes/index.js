import React from 'react'
import {getUser, logout} from '../reducers/user'
import {generateUrl} from '../router';

export const LOGIN_ROUTE = 'login'
export const REGISTER_ROUTE = 'register'
export const RESET_PASSWORD_ROUTE = 'forgot-password'
export const SET_PASSWORD_ROUTE = 'set-password'
export const PRIVACY_ROUTE = 'privacy'
export const TERMS_ROUTE = 'terms'
export const USER_ROUTE = 'user'

export const HOME_ROUTE = 'home'
export const LOGOUT_ROUTE = 'logout'

const authRoutes = {
  path: '',
  children: [
    {
      path: '/',
      name: HOME_ROUTE,
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    {
      path: '/account',
      name: USER_ROUTE,
      load: () => import(/* webpackChunkName: 'user' */ './user'),
    },
    {
      path: '/logout',
      name: LOGOUT_ROUTE,
      async action({store, query}) {
        await store.dispatch(logout())
        return {redirect: query.next || generateUrl(HOME_ROUTE)}
      },
    },
  ],
  async action({store, next, pathname}) {
    const {loggedIn} = store.getState().user
    if (!loggedIn) {
      return {redirect: `/login?next=${pathname}`}
    }
    return await next()
  },
}

// The top-level (parent) route
const routes = {

  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/login',
      name: LOGIN_ROUTE,
      load: () => import(/* webpackChunkName: 'login' */ './login'),
    },
    {
      path: '/register',
      name: REGISTER_ROUTE,
      load: () => import(/* webpackChunkName: 'register' */ './register'),
    },
    {
      path: '/reset-password',
      name: RESET_PASSWORD_ROUTE,
      load: () => import(/* webpackChunkName: 'resetPassword' */ './resetPassword'),
    },
    {
      path: '/set-password',
      name: SET_PASSWORD_ROUTE,
      load: () => import(/* webpackChunkName: 'setPassword' */ './setPassword'),
    },
    {
      path: '/privacy-policy',
      name: PRIVACY_ROUTE,
      load: () => import(/* webpackChunkName: 'privacy' */ './privacy'),
    },
    {
      path: '/terms',
      name: TERMS_ROUTE,
      load: () => import(/* webpackChunkName: 'terms' */ './terms'),
    },
    authRoutes,
    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'notFound' */ './notFound'),
    },
  ],

  async action({next, store}) {
    await store.dispatch(getUser())
    // Execute each child route until one of them return the result
    const route = await next()

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Petal & Stem'}`
    route.description = route.description || ''

    return route
  },

}

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  })
}

export default routes
