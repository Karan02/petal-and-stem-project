import React from 'react'
import {connect} from 'react-redux'
import {clear, register} from '../../reducers/register'
import {Alert, Button, Form, Input} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register.css'
import messages from './messages'
import formMessages from '../../formMessages'
import {PASSWORD_PATTERN} from '../../constants'
import {SelectCountry} from '../../components'

class Register extends React.Component {
  state = {
    confirmDirty: false,
  }

  componentWillUnmount() {
    this.props.clear()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.register(values, this.props.form)
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
    const {getFieldDecorator} = this.props.form
    const {loading, error, intl, success} = this.props
    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
          {success && (
            <Alert
              className={s.alert}
              message={success}
              type='success'
              showIcon
              closable
            />
          )}
          {error && (
            <Alert
              className={s.alert}
              message={error}
              type='error'
              showIcon
              closable
            />
          )}
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Input placeholder={intl.formatMessage(messages.email)}/>
            )}
          </Form.Item>
          <p>Passwords must be <ul><li>at least 8 characters long</li><li>contain Uppercase characters (A-Z)</li><li>contain Lowercase characters (a-z)</li><li>contain Numbers (0-9)</li></ul></p>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
                {pattern: PASSWORD_PATTERN,message:"Invalid Password"},
                {validator: this.validateToNextPassword},
              ],
            })(
              <Input
                type='password'
                placeholder={intl.formatMessage(messages.password)}
               
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password_confirmation', {
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
                {validator: this.compareToFirstPassword,message:"Password does not match"},
              ],
            })(
              <Input
                type='password'
                placeholder={intl.formatMessage(messages.confirmPassword)}
                onBlur={this.handleConfirmBlur}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('first_name', {
            })(
              <Input placeholder={intl.formatMessage(messages.firstName)}/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('last_name', {
            })(
              <Input placeholder={intl.formatMessage(messages.lastName)}/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('country', {
            })(
              <SelectCountry placeholder={intl.formatMessage(messages.country)}/>
            )}
          </Form.Item>
          <div className={s.actions}>
            <Button type='primary' htmlType='submit' className={s.submitBtn} loading={loading}>
              {intl.formatMessage(messages.submit)}
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

const mapState = state => ({
  ...state.register,
})

const mapDispatch = {
  register,
  clear,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Register)))
