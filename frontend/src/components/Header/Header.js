import React from "react";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import s from "./Header.css";
import { Link } from "../../components";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  REGISTER_ROUTE,
  USER_ROUTE
} from "../../routes";
import { changeCurrency, setInitialCurrencies } from "../../reducers/global";
import { handleCurrencyChange } from "../../reducers/product";
import { Col, Dropdown, Icon, Layout, Menu, Row, Select, Tooltip } from "antd";
import messages from "./messages";
import { injectIntl } from "react-intl";
const { SubMenu } = Menu;
const { Sider, Header2, Content } = Layout;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0 };
    // this.setInitialCurrencies = debounce(props.setInitialCurrencies, 800);
  }

  componentWillMount() {
    this.props.setInitialCurrencies();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    const {
      currency,
      currencies,
      changeCurrency,
      user,
      intl,
      currentRouteName
    } = this.props;
    const logo = (
      <a href="/">
        <img
          className={s.logo}
          src={require("../../static/bplogosmall.png")}
          alt={"logo"}
        />
      </a>
    );

    return (
      <Layout.Header className={s.header}>
        <Row
          type="flex"
          className={s.forNavArranger}
          justify="space-around"
          align="middle"
        >
          <Col className={s.forMobileNav}>
            <Icon
              type="bars"
              onClick={this.props.toggleSider}
              className={s.barsIcon}
            />
            {/* {this.handleMenu()} */}
          </Col>
          <Col>
            {currentRouteName === HOME_ROUTE ? (
              logo
            ) : (
              <Link to={HOME_ROUTE}>{logo}</Link>
            )}
          </Col>
          <Col className={s.forNav}>
            <div>
              <Menu mode="horizontal">
                <Menu.Item className={s.ant_menu_horizontal} key="home">
                  {/* <Icon type="mail" /> */}
                  <a href="/">HOME</a>
                </Menu.Item>
                <Menu.Item className={s.ant_menu_horizontal} key="mail">
                  {/* <Icon type="mail" /> */}
                  <a href="https://www.petalandstem.com/" target="_blank">
                    SHOP
                  </a>
                </Menu.Item>

                                <SubMenu
                  className={s.ant_menu_horizontal}
                  title={
                    <span className="submenu-title-wrapper">
                      {/* <Icon type="setting" /> */}
                      COMMUNITY
                    </span>
                  }
                >
                  {/* <Menu.ItemGroup title="Item 1"> */}
                  <Menu.Item key="setting:1" className="submenu-item">
                    <a
                      href="https://www.facebook.com/groups/2081197135340829/?source_id=109407770469194"
                      target="_blank"
                    >
                      Aromatherapists in Business
                    </a>
                  </Menu.Item>
                  <Menu.Item key="setting:2">
                    <a
                      href="https://www.facebook.com/groups/1016692035359049/"
                      target="_blank"
                    >
                      Blend Precisely Tribe
                    </a>
                  </Menu.Item>
                  {/* </Menu.ItemGroup> */}
                  {/* <Menu.ItemGroup title="Item 2"> */}
                  {/* <Menu.Item key="setting:3">Option 3</Menu.Item>
            <Menu.Item key="setting:4">Option 4</Menu.Item> */}
                  {/* </Menu.ItemGroup> */}
                </SubMenu>
                <Menu.Item key="alipay" className={s.ant_menu_horizontal}>
                  <a
                    href="https://www.youtube.com/channel/UCspY_ztRZc2kMpRf2MJLyMw"
                    target="_blank"
                  >
                    TUTORIAL
                  </a>
                </Menu.Item>
              </Menu>
            </div>
          </Col>
          <Col className={s.nav}>
            <div className={s.rightMenu}>
              {!user ? (
                <React.Fragment>
                  <Link to={LOGIN_ROUTE} className="account">
                    {intl.formatMessage(messages.login)}
                  </Link>
                  <a href="https://grow.petalandstem.com/offers/xLaiJyTT/checkout">
                    Sign Up
                  </a>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Select
                    showSearch
                    className={s.currency}
                    value={currency.key}
                    defaultValue={currency.key}
                    onSelect={changeCurrency}
                    size="small"
                  >
                    {currencies.map(item => (
                      <Select.Option
                        key={item.key}
                        value={item.key}
                        title={item.label}
                      >
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                  <Dropdown
                    overlay={
                      <Menu selectedKeys={[]}>
                        <Menu.Item key={USER_ROUTE}>
                          <Link to={USER_ROUTE}>
                            {intl.formatMessage(messages.account)}
                          </Link>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item key={LOGOUT_ROUTE}>
                          <Link to={LOGOUT_ROUTE}>
                            {intl.formatMessage(messages.logout)}
                          </Link>
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <span>
                      <Icon type="user" className={s.accountIcon} />
                      <span className={s.username}>
                        {user.first_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.email}
                      </span>
                    </span>
                  </Dropdown>
                </React.Fragment>
              )}
            </div>
          </Col>
        </Row>
      </Layout.Header>
    );
  }
}

const mapState = state => ({
  currency: state.global.currency,
  currencies: state.global.currencies,
  currentRouteName: state.global.currentRouteName,
  user: state.user.user
});

const mapDispatch = {
  setInitialCurrencies,
  changeCurrency
};

export default injectIntl(
  connect(mapState, mapDispatch)(withStyles(s)(Header))
);
