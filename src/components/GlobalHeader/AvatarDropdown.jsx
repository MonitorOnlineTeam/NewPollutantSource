import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Modal } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import Cookie from 'js-cookie';
import ChangePwdView from './ChangePwdView';
import configToken from '@/config'
import router from 'umi/router';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;
    const { dispatch } = this.props;
    if (key === 'logout') {
      if (dispatch) {
        Cookie.set(configToken.cookieName, null);
        Cookie.set('currentUser', null);
        Cookie.set('newToken', null);
        Cookie.set('sysMenuId', null);
        sessionStorage.clear();
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    if (key === 'center') {
      router.push(`/account/settings`);
      return;
    }

    if (key === 'changepwd') {
      //router.push(`/account/ChangePwdView`);
      //return <ChangePwdView  showchangepwd={true}/>
      if (dispatch) {
        dispatch({
          type: 'global/changePwdModal',
        });
      }
    } else router.push(`/account/${key}`);
  };

  render() {
    const { currentUser = {}, menu, changePwdVisible } = this.props;
    if (!menu) {
      return (
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={styles.name}>{currentUser.name}</span>
        </span>
      );
    }

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {/* <Menu.Item key="center">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item> */}
        {/* <Menu.Item key="settings">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider /> */}
        {/* <Menu.Item key="changepwd">
          <Icon type="lock" />
          修改密码
        </Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item key="center">
          <UserOutlined />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.UserName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <ChangePwdView visible={changePwdVisible} />

          <Avatar
            size="small"
            className={styles.avatar}
            // src={'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'}
            src={'/avatar.png'}
            alt="avatar"
          />
          <span className={styles.name}>{currentUser.UserName}</span>
        </span>
      </HeaderDropdown>
    ) : (
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
