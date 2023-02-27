import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Layout, Menu } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined, MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { menuList, getMenuList } from '@/utils/console-utils';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import styles from './ConsoleLayout.less'
const { Header, Content, Footer, Sider } = Layout;
import { router } from "umi"
import Cookie from 'js-cookie';

class ConsoleLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '',
      parentMenuCurrent: '',
      subMenuList: [],
    };
  }

  componentDidMount() {
    this.onParentMenuItemClick({ key: menuList[0].path });
    this.getMenuCurrentKey();
  }


  // 获取当前菜单key
  getMenuCurrentKey = () => {
    let current = this.props.location.pathname;
    this.setState({ current: current });
  }

  // 父菜单点击获取子菜单
  onParentMenuItemClick = (e) => {
    let currentParentMenu = menuList.find(item => item.path === e.key);
    this.setState({
      parentMenuCurrent: e.key,
      subMenuList: currentParentMenu.children
    })
  }

  // 子菜单跳转页面
  onSubMenuItemClick = (e) => {
    this.setState({ current: e.key })
    router.push(e.key)
  }

  // 获取面包屑
  getBreadcrumb = () => {
    let _menuList = getMenuList(menuList);
    let currentMenu = _menuList.find(item => item.path === location.pathname)
    // url和菜单能匹配到
    if (currentMenu) {
      // 面包屑名称
      let breadcrumbNames = currentMenu.breadcrumbNames;
      return <div className={styles.breadcrumb}>
        当前位置：
        <Breadcrumb>
          {
            breadcrumbNames.split('/').map((item, index) => {
              return <Breadcrumb.Item key={index}>
                <a>{item}</a>
              </Breadcrumb.Item>
            })
          }
        </Breadcrumb>
      </div>
    }
  }
  // const menuList = getMenuList(cMenu);
  render() {
    const { subMenuList, current, parentMenuCurrent } = this.state;

    // 判断登录状态
    let userCookie = Cookie.get('currentUser');
    if (!userCookie) {
      router.push("/user/login");
    }

    return (
      <Layout className={styles.consoleLayout}>
        <Header className={styles.header}>
          <div className="logo">
            <img src='/sdl.png' alt="logo" style={{ height: 60 }} />
            <h1>污染源后台管理</h1>
          </div>
          <Menu mode="horizontal" selectedKeys={[parentMenuCurrent]} theme={'dark'} defaultSelectedKeys={['mail']} onClick={this.onParentMenuItemClick}>
            {
              menuList.map(item => {
                return <Menu.Item key={item.path} icon={<MailOutlined />}>
                  {item.name}
                </Menu.Item>
              })
            }
          </Menu>
        </Header>
        <Content
          style={{
            padding: '0 50px',
          }}
        >
          <Layout
            className="site-layout-background"
            style={{
              padding: '24px 0',
            }}
          >
            {
              subMenuList && <Sider className="site-layout-background" width={200}>
                <Menu
                  selectedKeys={[current]}
                  mode="inline"
                  theme={'dark'}
                  defaultSelectedKeys={['mail']}
                  onClick={this.onSubMenuItemClick}
                >
                  {
                    subMenuList.map(item => {
                      return <Menu.Item key={item.path} icon={<MailOutlined />}>
                        {item.name}
                      </Menu.Item>
                    })
                  }
                </Menu>
              </Sider>
            }
            <div
              className={styles.container}
              style={{
                padding: '0 24px',
                minHeight: 280,
              }}
            >
              {this.getBreadcrumb()}
              <div>
                {this.props.children}
              </div>
            </div>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default connect(({ global, settings, user, loading }) => ({
}))(ConsoleLayout);
