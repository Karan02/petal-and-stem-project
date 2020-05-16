import React from 'react'
import {AppLayout} from '../../components'
import SetPassword from './SetPassword'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl, query}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['setPassword'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><SetPassword intl={intl} params={query}/></AppLayout>,
  }
}

export default action
