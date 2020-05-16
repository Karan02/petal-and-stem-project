import React from 'react'
import User from './User'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {AppLayout} from '../../components'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['user'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><User intl={intl}/></AppLayout>,
  }
}

export default action
