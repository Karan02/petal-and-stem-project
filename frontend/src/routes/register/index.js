import React from 'react'
import {AppLayout} from '../../components'
import Register from './Register'
import messages from './messages'
import {setCurrentRouteName} from '../../reducers/global'

function action({intl, query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['register'],
    title: intl.formatMessage(messages.title),
    component: (
      <AppLayout><Register intl={intl}/></AppLayout>
    ),
  }
}

export default action
