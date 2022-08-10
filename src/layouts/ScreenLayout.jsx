import React, { PureComponent } from 'react';
import styles from './ScreenLayout.less'
import { Menu } from 'antd';
const { SubMenu } = Menu;


class ScreenLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 'SubMenu',
    };

    let htmlElement = document.documentElement;
    htmlElement.setAttribute("id", 'darkHtml')
  }

  render() {
    const { children } = this.props;
    const { current } = this.state;
    return (
      <div className={styles.homeWrapper}>
        <header className={styles.homeHeader}>
          <div>
            <img className={styles.headerImg} src="/ProjectSummary/top.png" alt="" />
            <div className={styles['left-button']}>
              <Menu onClick={this.handleClick} className={styles.menuClass} selectedKeys={[current]} mode="horizontal">
                <SubMenu key="SubMenu"
                  popupOffset={[30, -10]}
                  title={
                    <span className={styles.menuTitle}>监控中心</span>
                  } popupClassName={styles.subMenuClass}>
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </SubMenu>
                <SubMenu key="SubMenu2"
                  popupOffset={[30, -10]}
                  title={
                    <span className={styles.menuTitle}>质控中心</span>
                  }>
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </SubMenu>
              </Menu>
            </div>
            <div className={styles['right-button']}>
              <Menu onClick={this.handleClick} className={styles.menuClass} selectedKeys={[current]} mode="horizontal">
                <SubMenu key="SubMenu"
                  popupOffset={[0, -10]}
                  title={
                    <span className={styles.menuTitle}>运维中心</span>
                  } popupClassName={styles.subMenuClass}>
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </SubMenu>
                <SubMenu key="SubMenu2"
                  popupOffset={[0, -10]}
                  title={
                    <span className={styles.menuTitle}>授权中心</span>
                  }>
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </SubMenu>
              </Menu>
            </div>
            <p>污染源自动监测全过程质控项目</p>
          </div>
        </header>
        <div style={{ height: 'calc(100vh - 64px)' }}>{children}</div>
      </div >
    );
  }
}

export default ScreenLayout;

