import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Terms.css'

class Terms extends React.Component {
  render() {
    const {html} = this.props

    return (
      <div
        className={s.container}
        dangerouslySetInnerHTML={{__html: html}}
      />
    )
  }
}

export default withStyles(s)(Terms)
