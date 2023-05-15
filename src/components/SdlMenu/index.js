import React, { Component } from 'react';
import { Menu } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { router } from 'umi';
import _ from 'lodash';

const { SubMenu } = Menu;

@connect(({ loading, user }) => ({
  menuList: user.currentMenu,
}))
class SdlMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ICONS: {},
      current: '',
    };

    import('@ant-design/icons').then(icons => {
      this.setState({
        ICONS: icons,
      });
    });
  }

  getIcon = icon => {
    let Icon = this.state.ICONS[icon];
    return Icon ? <Icon /> : '';
  };

  componentDidMount() {
    this.getMenuCurrentKey();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname != this.props.location.pathname) {
      this.getMenuCurrentKey();
    }
  }

  getMenuCurrentKey = () => {
    let current = this.props.location.pathname;
    this.setState({ current: current });
  };

  menuItemContent = (currentMenuData, parentName) => {
    let menuData = [];
    let sortMenu = _.sortBy(currentMenuData, item => {
      return !item.children.length;
    });
    sortMenu.forEach((item, index) => {
      if (item.children.length) {
        menuData.push(item);
      } else {
        let secondary = {};
        secondary.name = parentName;
        secondary.children = sortMenu.splice(index);
        menuData.push(secondary);
        return;
      }
    });
    return menuData.map(menuItem => {
      return (
        <Menu.ItemGroup key={menuItem.path} title={menuItem.name}>
          {menuItem.children.map(itm => {
            if (itm.children && itm.children.length) {
              return (
                <SubMenu
                  popupClassName={styles.wrySubMenu}
                  key={itm.NavigateUrl}
                  icon={this.getIcon(itm.icon)}
                  title={itm.name}
                >
                  {this.menuItemContent(itm.children, itm.name)}
                </SubMenu>
              );
            }
            return (
              <Menu.Item key={itm.path} icon={this.getIcon(itm.icon)}>
                {itm.name}
              </Menu.Item>
            );
          })}
        </Menu.ItemGroup>
      );
    });
  };

  onMenuItemClick = e => {
    this.setState({ current: e.key });
    router.push(e.key);
  };

  render() {
    const { current } = this.state;
    const { menuList, match, title } = this.props;
    return (
      <div className="ant-pro-top-nav-header">
        <div className="ant-pro-top-nav-header-main">
          <div className="ant-pro-top-nav-header-left" style={{ marginRight: 20 }}>
            <div className="ant-pro-top-nav-header-logo" id="logo">
              <a href="/">
                <img
                  src="/wwwroot/BaseDataUpload/Report/logo.png"
                  alt="logo"
                  style={{ height: 60 }}
                />
                <h1>{title}</h1>
              </a>
            </div>
          </div>
          <div
            className="ant-pro-top-nav-header-menu"
            style={{ flex: '1 1 0%', overflow: 'hidden', position: 'relative', zIndex: 99 }}
          >
            <div className={`${styles.menuWrapper} ant-pro-top-nav-header-menu`}>
              <Menu
                theme={'dark'}
                selectedKeys={[current]}
                mode="horizontal"
                onClick={this.onMenuItemClick}
              >
                {menuList.map((item, index) => {
                  if (item.children.length) {
                    return (
                      <SubMenu
                        popupClassName={styles.wrySubMenu}
                        key={item.NavigateUrl}
                        icon={this.getIcon(item.icon)}
                        title={item.name}
                      >
                        {this.menuItemContent(item.children, item.name)}
                      </SubMenu>
                    );
                  } else {
                    return (
                      <Menu.Item
                        key={item.NavigateUrl}
                        icon={this.getIcon(item.icon)}
                        onClick={() => {
                          if (!item.children.length) {
                            this.onMenuItemClick(item, item);
                          }
                        }}
                      >
                        {item.name}
                      </Menu.Item>
                    );
                  }
                })}
              </Menu>
            </div>
          </div>
          <div style={{ minWidth: 298 }}></div>
        </div>
      </div>
    );
  }
}

export default SdlMenu;
