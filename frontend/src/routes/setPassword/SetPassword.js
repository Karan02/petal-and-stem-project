import React from 'react'
import {connect} from 'react-redux'
import {clear, setPassword} from '../../reducers/setPassword'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {Alert, Button, Form, Input} from 'antd'
import s from './SetPassword.css'
import messages from './messages'
import formMessages from '../../formMessages'
import {PASSWORD_PATTERN} from '../../constants'

class SetPassword extends React.Component {
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
        this.props.setPassword({...values, ...this.props.params})
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
    const {loading, error, intl} = this.props
    const validateMessages = {
      required: '${label} is required!',
      types: {
        password: '${label} is not valid password!',
        // number: '${label} is not a validate number!',
      },
      // number: {
        // range: '${label} must be between ${min} and ${max}',
      // },
    };
    return (
      <Form className={s.container} onSubmit={this.handleSubmit} validateMessages={validateMessages}>
        <div className={s.content}>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
          {error && (
            <Alert
              className={s.alert}
              message={error}
              type='error'
              showIcon
              closable
            />
          )}
          <p>Passwords must be <ul><li>at least 8 characters long</li><li>contain Uppercase characters (A-Z)</li><li>contain Lowercase characters (a-z)</li><li>contain Numbers (0-9)</li></ul></p>
          <Form.Item
          >
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
          <div className={s.actions}>
            <Button
              type='primary'
              htmlType='submit'
              className={s.submitBtn}
              loading={loading}
            >
              {intl.formatMessage(messages.submit)}
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

const mapState = state => ({
  ...state.setPassword,
})

const mapDispatch = {
  setPassword,
  clear,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(SetPassword)))
