import React from 'react'
import {AppLayout} from '../../components'
import Terms from './Terms'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import page from './terms.md'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  
  return {
    chunks: ['terms'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Terms intl={intl} {...page}/></AppLayout>,
  }
}

export default action
