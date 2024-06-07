/*
 * @Author: JiaQi
 * @Date: 2024-06-03 11:20:32
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-06-07 16:41:24
 * @Description:  菜单组件
 */
import React, { Component } from 'react';
import { Menu, Typography } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { router } from 'umi';
import _ from 'lodash';
const { Text, Link } = Typography;

const { SubMenu } = Menu;

function transformString(input) {
  // 检查输入是否是字符串
  if (typeof input !== 'string') {
    return input;
  }

  // 如果字符串包含 '-', 进行特殊处理
  if (input.includes('-')) {
    // 将每个 '-' 后面跟随的字符转换为大写，移除 '-'
    input = input
      .split('-')
      .map((str, index) => {
        return index === 0 ? capitalize(str) : capitalize(str);
      })
      .join('');
  }

  // 检查开头是否不是大写字母以及不包含 'Outlined'
  if (
    /^[a-zA-Z]/.test(input) &&
    input.charAt(0) !== input.charAt(0).toUpperCase() &&
    !input.includes('Outlined')
  ) {
    input = capitalize(input); // 首字母大写
  }

  // 如果符合条件，添加 'Outlined'
  if (!input.includes('Outlined')) {
    input += 'Outlined';
  }

  return input;
}

// 辅助函数：将字符串首字母大写
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
    let iconName = transformString(icon);
    let Icon = this.state.ICONS[iconName];
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
                <Link to={itm.path} component={Typography.Link}>
                  {itm.name}
                </Link>
                {/* {itm.name} */}
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
                {configInfo.IsShowLogo === 'true' && (
                  <img src={configInfo.Logo || '/logo.png'} alt="logo" style={{ height: 60 }} />
                )}
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
                        <Link to={item.path} component={Typography.Link}>
                          {item.name}
                        </Link>
                        {/* {item.name} */}
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
