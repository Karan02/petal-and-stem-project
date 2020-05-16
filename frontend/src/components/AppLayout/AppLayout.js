import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./AppLayout.css";
import { Header, Footer } from "../../components";
import { Layout, Menu, Tooltip } from "antd";
import antStyles from "antd/dist/antd.less";
import globalStyles from "../../global.css";

const { SubMenu } = Menu;
const { Sider } = Layout;

class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside = async event => {
    if (this.node.contains(event.target)) {
      return;
    }

    await this.setState({ collapsed: true });
  };
  static defaultProps = {
    footer: true
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { footer } = this.props;
    return (
      <div className={ this.props.bodyfixed? "bodyfixed":null}>
      <Layout className={s.container}>
        <div ref={node => (this.node = node)}>
          <Sider
            className={s.sider}
            trigger={null}
            collapsible
            collapsedWidth={0}
            collapsed={this.state.collapsed}
          >
            {" "}
            <Menu mode="inline" className={s.menuMobile}>
              <Menu.Item className={s.ant_menu_horizontal} key="home">
                {/* <Icon type="mail" /> */}
                <a href="/">HOME</a>
              </Menu.Item>
              <Menu.Item className={s.ant_menu_horizontal} key="mail">
                {/* <Icon type="mail" /> */}
                <a href="https://www.petalandstem.com/">SHOP</a>
              </Menu.Item>
              <Menu.Item className={s.ant_menu_horizontal}>
                {/* <Icon type="mail" /> */}
                <Tooltip title="Coming Soon">
                  <a>WHOLSALE MEMBERSHIP</a>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="app" className={s.ant_menu_horizontal}>
                {/* <Icon type="appstore" /> */}
                <a href="https://www.petalandstem.com/pages/petal-stem-memberships">
                  ABOUT
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
                <Menu.Item key="setting:1">
                  <a
                    className={s.title_overflow}
                    href="https://www.facebook.com/groups/2081197135340829/?source_id=109407770469194"
                    target="_blank"
                  >
                    Aromatherapists in Business
                  </a>
                </Menu.Item>
                <Menu.Item key="setting:2">
                  <a
                    className={s.title_overflow}
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
                  href="https://www.facebook.com/PetalandStem/"
                  target="_blank"
                >
                  TUTORIAL
                </a>
              </Menu.Item>
            </Menu>
          </Sider>
          <Header toggleSider={this.toggle} />
        </div>
        <Layout.Content className={s.content}>
          {this.props.children}
        </Layout.Content>
        {footer && <Footer />}
      </Layout>
      </div> );
    
  }
}

const mapState = state => ({
  bodyfixed:state.global.bodyfixed
});

const mapDispatch = {};

export default connect(
  mapState,
  mapDispatch
)(withStyles(antStyles, globalStyles, s)(AppLayout));
