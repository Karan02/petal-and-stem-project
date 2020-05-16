import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './User.css'
import {Row, Col, Card, Icon} from 'antd'
import UpdateUserModal from './UpdateUserModal'
import UpdatePasswordModal from './UpdatePasswordModal'
import {openUpdateUserModal, openUpdatePasswordModal} from '../../reducers/user'
import messages from './messages'

class User extends React.Component {
  constructor () {
    super()
    const enCountries = require(`localized-countries/data/en_US`)
    this.state = {
      // TODO
      countries: require('localized-countries')(process.env.BROWSER ? enCountries : 'en_US').array()
    }
  }

  render() {
    const {user, intl, updateUserModalOpened, openUpdateUserModal, updatePasswordModalOpened, openUpdatePasswordModal} = this.props
    const {countries} = this.state
    const country = user ? countries.find(item => item.code === user.country) : null
    return (
      <div className={s.container}>
        <Card
          actions={[
            <a onClick={openUpdateUserModal}>
              <Icon type='edit' className={s.icon}/>
              {intl.formatMessage(messages.editAccount)}
            </a>,
            <a onClick={openUpdatePasswordModal}>
              <Icon type='lock' className={s.icon}/>
              {intl.formatMessage(messages.changePassword)}
            </a>
          ]}
        >
          {user && (
            <React.Fragment>
              <Row type='flex' gutter={16} className={s.row}>
                <Col xs={24} sm={6} className={s.label}>
                  {intl.formatMessage(messages.name)}
                </Col>
                <Col xs={24} sm={18}>{`${user.first_name} ${user.last_name}`}</Col>
              </Row>
              <Row type='flex' gutter={16} className={s.row}>
                <Col xs={24} sm={6} className={s.label}>
                  {intl.formatMessage(messages.email)}
                </Col>
                <Col xs={24} sm={18}>{user.email}</Col>
              </Row>
              <Row type='flex' gutter={16} className={s.row}>
                <Col xs={24} sm={6} className={s.label}>
                  {intl.formatMessage(messages.country)}
                </Col>
                <Col xs={24} sm={18}>{country && country.label}</Col>
              </Row>
            </React.Fragment>
          )}
          {updateUserModalOpened && <UpdateUserModal intl={intl}/>}
          {updatePasswordModalOpened && <UpdatePasswordModal intl={intl}/>}
        </Card>
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user.user,
  updateUserModalOpened: state.user.updateUserModalOpened,
  updatePasswordModalOpened: state.user.updatePasswordModalOpened,
})

const mapDispatch = {
  openUpdateUserModal,
  openUpdatePasswordModal,
}

export default connect(mapState, mapDispatch)(withStyles(s)(User))
