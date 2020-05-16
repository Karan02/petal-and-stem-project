import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {connect} from 'react-redux'
import {Form, Input, Modal} from 'antd'
import s from './UpdateUserModal.css'
import {SelectCountry} from '../../components'
import {closeUpdateUserModal, updateUser} from '../../reducers/user'
import messages from './messages'

class UpdateUserModal extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updateUser(values, this.props.form)
      }
    })
  }

  render() {
    const {closeUpdateUserModal, loading, intl, user} = this.props
    const {getFieldDecorator} = this.props.form

    return (
      <Modal
        visible
        title={intl.formatMessage(messages.updateUserModal)}
        onOk={this.handleSubmit}
        onCancel={closeUpdateUserModal}
        confirmLoading={loading.updatingUser}
        width={500}
      >
        <Form layout='vertical'>
          <Form.Item
            label={intl.formatMessage(messages.firstName)}
          >
            {getFieldDecorator('first_name', {
              initialValue: user ? user.first_name : undefined,
            })(
              <Input className={s.input}/>
            )}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage(messages.lastName)}
          >
            {getFieldDecorator('last_name', {
              initialValue: user ? user.last_name : undefined,
            })(
              <Input className={s.input}/>
            )}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage(messages.country)}
          >
            {getFieldDecorator('country', {
              initialValue: user ? user.country : undefined,
            })(
              <SelectCountry/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const mapState = state => ({
  loading: state.user.loading,
  user: state.user.user,
})

const mapDispatch = {
  updateUser,
  closeUpdateUserModal,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(UpdateUserModal)))
