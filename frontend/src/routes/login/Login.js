import React from "react";
import { connect } from "react-redux";
import { activate, clear, login } from "../../reducers/login";
import { Alert, Button, Form, Icon, Input } from "antd";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Login.css";
import messages from "./messages";
import formMessages from "../../formMessages";
import { Link } from "../../components";
import { RESET_PASSWORD_ROUTE, REGISTER_ROUTE } from "../";

class Login extends React.Component {
  componentDidMount() {
    if (this.props.params && this.props.params.uid) {
      this.props.activate(this.props.params);
    }
  }

  componentWillUnmount() {
    this.props.clear();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values, this.props.redirectUrl);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, error, intl } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.middleContainer}>
          <div className={s.info}>
            <h2 className={s.welcomeText}>Welcome</h2>
            <p className={s.details}>Pricing out your Aromatherapy blends can be confusing and time
            consuming. Let this app do the calculation for you. Add new recipes,
            change recipes and price them out with just a few clicks. Choose from
            an existing database of Essential Oils, Carrier Oils, Butters and
            Containers or add your own. Contact us if you need help with importing
            your own range of products. Let the mixing begin!</p>
          </div>
          <div className={s.content}>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
          {error && (
            <Alert
              className={s.alert}
              message={error}
              type="error"
              showIcon
              closable
            />
          )}
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(formMessages.required)
                }
              ]
            })(
              <Input
                prefix={<Icon type="user" className={s.inputIcon} />}
                placeholder={intl.formatMessage(messages.email)}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(formMessages.required)
                }
              ]
            })(
              <Input
                prefix={<Icon type="lock" className={s.inputIcon} />}
                type="password"
                placeholder={intl.formatMessage(messages.password)}
              />
            )}
          </Form.Item>
          <div className={s.actions}>
            <Button
              type="primary"
              htmlType="submit"
              className={s.submitBtn}
              loading={loading}
            >
              {intl.formatMessage(messages.submit)}
            </Button>
          </div>
          <div className={s.forgotPassword}>
            <Link to={RESET_PASSWORD_ROUTE}>
              {intl.formatMessage(messages.forgotPassword)}
            </Link>
          </div>
            <div className={s.notRegistered}>
                <a href="https://grow.petalandstem.com/offers/xLaiJyTT/checkout">Not registered yet?</a>
          </div>
        </div>
        </div>
      </Form>
    );
  }
}

const mapState = state => ({
  ...state.login
});

const mapDispatch = {
  activate,
  login,
  clear
};

export default connect(
  mapState,
  mapDispatch
)(Form.create()(withStyles(s)(Login)));
