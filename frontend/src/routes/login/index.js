import React from 'react'
import {AppLayout} from '../../components'
import Login from './Login'
import messages from './messages'
import {setCurrentRouteName} from '../../reducers/global'
import s from './Login.css'

function action({intl, query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['login'],
    title: intl.formatMessage(messages.title),
      component: (
          <AppLayout>
              
              <Login redirectUrl={query.next} params={query} intl={intl}/>
          </AppLayout>
    ),
  }
}

export default action
