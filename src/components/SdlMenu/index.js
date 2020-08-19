import React, { Component } from 'react';
import { Menu, Popover } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import styles from './index.less';
import { router } from "umi"
import $ from 'jquery'

const { SubMenu } = Menu;

@connect(({ loading, user }) => ({
  menuList: user.currentMenu,
}))
class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ICONS: {},
      current: "",
    };
    // this._SELF_ = {
    //   ICONS: {}
    // }

    import('@ant-design/icons').then((icons) => {
      this.setState({
        ICONS: icons
      })
      // this._SELF_.ICONS = icons;
    });
  }

  getIcon = (icon) => {
    // const ICONS = require('@ant-design/icons');
    let Icon = this.state.ICONS[icon];
    return Icon ? <Icon /> : "";
  }

  onMenuItemClick = (menuItemData, menuKey) => {
    this.setState({ current: menuKey });
    router.push(menuItemData.NavigateUrl)
  }
  // #1890ff
  menuItemContent = (currentMenuData) => {
    let pathName = window.location.pathname;
    let menuKey = currentMenuData.id;
    return (
      <div className={styles.menu_popover_wrapper}>
        <ul>
          {
            currentMenuData.children.map(menuItem => {
              if (menuItem.children.length) {
                return (
                  <li key={menuItem.name} className={styles.menu_title_container}>
                    <div className={styles.menu_title}>
                      {menuItem.name}
                    </div>
                    <ul className={styles.menu_item_list}>
                      {
                        menuItem.children.map(itm => {
                          return <li key={itm.name} style={{ cursor: 'pointer', color: pathName === itm.NavigateUrl ? "#1890ff" : "" }} onClick={() => { this.onMenuItemClick(itm, menuKey) }}>
                            {this.getIcon(itm.icon)}
                            <span className={styles.menu_name}>{itm.name}</span>
                          </li>
                        })
                      }
                    </ul>
                  </li>
                )
              } else {
                return (
                  <li key={menuItem.name} className={styles.menu_title_container}>
                    <ul className={styles.menu_item_list}>
                      <li onClick={() => { this.onMenuItemClick(menuItem, menuKey) }}>
                        {this.getIcon(menuItem.icon)}
                        <span className={styles.menu_name}>{menuItem.name}</span>
                      </li>
                    </ul>
                  </li>
                )
              }
            })
          }
        </ul>
      </div>
    )
  }
  render() {
    const { current } = this.state;
    const { menuList, match } = this.props;

    return (
      <div className={`${styles.menuWrapper} ant-pro-top-nav-header-menu`}>
        <Menu selectedKeys={[current]} mode="horizontal">
          {
            menuList.map((item, index) => {
              return (
                <Menu.Item key={item.id} icon={this.getIcon(item.icon)}>
                  {
                    item.children.length ?
                      // <Popover overlayClassName={styles.menuPopover} placement="bottom" trigger="click" content={this.menuItemContent(item)}>
                      <Popover mouseEnterDelay={0.2} overlayClassName={styles.menuPopover} placement="bottom" content={this.menuItemContent(item)}>
                        {item.name}
                      </Popover> :
                      item.name
                  }
                </Menu.Item>
              )
            })
          }
        </Menu>
      </div>

    );
  }
}

export default Test;