import React from 'react'
import {AppLayout} from '../../components'
import Privacy from './Privacy'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import page from './privacy.md'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  
  return {
    chunks: ['privacy'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Privacy intl={intl} {...page}/></AppLayout>,
  }
}

export default action
