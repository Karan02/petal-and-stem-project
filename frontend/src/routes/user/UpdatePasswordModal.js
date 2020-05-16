import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {connect} from 'react-redux'
import {Alert, Form, Input, Modal} from 'antd'
import s from './UpdateUserModal.css'
import formMessages from '../../formMessages'
import {closeUpdatePasswordModal, updatePassword} from '../../reducers/user'
import {PASSWORD_PATTERN} from '../../constants'
import messages from './messages'

class UpdatePasswordModal extends React.Component {
  state = {
    confirmDirty: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updatePassword(values)
      }
    })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({confirmDirty: this.state.confirmDirty || !!value})
  }

  compareToFirstPassword = (rule, value, callback) => {
    const {intl, form} = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback(intl.formatMessage(formMessages.passwordDoesNotMatch))
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const {form} = this.props
    if (value && this.state.confirmDirty) {
      form.validateFields(['password_confirmation'], {force: true})
    }
    callback()
  }

  render() {
    const {closeUpdatePasswordModal, loading, intl, error} = this.props
    const {getFieldDecorator} = this.props.form

    return (
      <Modal
        visible
        title={intl.formatMessage(messages.updatePasswordModal)}
        onOk={this.handleSubmit}
        onCancel={closeUpdatePasswordModal}
        confirmLoading={loading.updatingPassword}
        width={500}
      >
        {error && (
          <Alert
            className={s.alert}
            message={error}
            type='error'
            showIcon
            closable
          />
        )}
        <Form layout='vertical'>
          <p>Passwords must be <ul><li>at least 8 characters long</li><li>contain: Uppercase characters (A-Z)</li><li>contain Lowercase characters (a-z)</li><li>contain Numbers (0-9)</li></ul></p>

          <Form.Item
            label={intl.formatMessage(messages.currentPassword)}
          >
            {getFieldDecorator('current_password', {
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Input className={s.input} type='password'/>
            )}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage(messages.newPassword)}
          >
            {getFieldDecorator('password', {
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
                {pattern: PASSWORD_PATTERN,message:"Invalid Password"},
                {validator: this.validateToNextPassword},
              ],
            })(
              <Input className={s.input} type='password'/>
            )}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage(messages.confirmPassword)}
          >
            {getFieldDecorator('password_confirmation', {
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
                {validator: this.compareToFirstPassword,message:"Password does not match"},
              ],
            })(
              <Input
                type='password'
                onBlur={this.handleConfirmBlur}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const mapState = state => ({
  loading: state.user.loading,
  error: state.user.error,
})

const mapDispatch = {
  updatePassword,
  closeUpdatePasswordModal,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(UpdatePasswordModal)))
