import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Privacy.css'

class Privacy extends React.Component {
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

export default withStyles(s)(Privacy)
