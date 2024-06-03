import { QrcodeOutlined } from '@ant-design/icons';
import { Tooltip, Popover, Dropdown, Menu, Button } from 'antd';
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import NoticeIconView from './NoticeIconView';
import {
  ExpandOutlined,
  CompressOutlined,
  UnorderedListOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import webConfig from '../../../public/webConfig';
import { router } from 'umi';

const GlobalHeaderRight = props => {
  const {
    theme,
    layout,
    configInfo,
    appFlag,
    sysPollutantTypeList,
    configInfo: { IsOpera },
  } = props;
  // console.log("changePwdVisible=",props);
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      //默认状态
      const element = document.documentElement;
      element.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        //全屏状态
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };
  var QRCode = require('qrcode.react');
  //获取当前ip地址和端口号
  var getIp = '';
  if (appFlag) {
    getIp = appFlag;
  } else {
    getIp = `${window.location.origin}/appoperation/appqrcodemain`;
  }
  const isShowSelectSystem = sessionStorage.getItem('isShowSelectSystem');
  const menu = (
    <Menu selectedKeys={[sessionStorage.getItem('sysMenuId')]}>
      {sysPollutantTypeList.map(item => {
        return (
          <Menu.Item key={item.ID}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                let url = item.Url ? new URL(item.Url) : item.Url;
                if (item.ID !== sessionStorage.getItem('sysMenuId')) {
                  if (url && (url.protocol === 'http:' || url.protocol === 'https:')) {
                    if (webConfig.middlePageOpenMode === 'single') {
                      window.location.href = url.href;
                    } else {
                      window.open(url);
                    }
                  } else {
                    if (webConfig.middlePageOpenMode === 'single') {
                      router.push(`/sessionMiddlePage?sysInfo=${JSON.stringify(item)}`);
                    } else {
                      window.open(`/sessionMiddlePage?sysInfo=${JSON.stringify(item)}`);
                    }
                  }
                }
              }}
            >
              {item.Name}
            </a>
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <div className={className}>
      {configInfo.IsShowSysPage === '1' && isShowSelectSystem == 1 && (
        <>
          <Tooltip title="返回首页">
            <a
              rel="noopener noreferrer"
              className={styles.action}
              onClick={() => router.push('/sysTypeMiddlePage')}
            >
              <RollbackOutlined />
            </a>
          </Tooltip>
          <Dropdown overlay={menu} trigger={['click']}>
            <Tooltip title="切换系统">
              <a rel="noopener noreferrer" className={styles.action}>
                <UnorderedListOutlined />
              </a>
            </Tooltip>
          </Dropdown>
        </>
      )}
      {configInfo && configInfo.IsShowQRcode === 'true' && !IsOpera && (
        <Popover
          placement="bottom"
          content={
            <div>
              <QRCode value={getIp} size={200} />
            </div>
          }
          title="手机端下载"
          trigger="hover"
        >
          <a className={styles.action}>
            <QrcodeOutlined />
          </a>
        </Popover>
      )}

      {/** 污水处理厂权限和运维去掉铃铛 */}
      {!IsOpera && <NoticeIconView />}
      <Popover
        placement="bottom"
        zIndex={9999}
        overlayClassName={styles.expandPopSty}
        content={isFullscreen ? '退出全屏' : '全屏展示'}
      >
        {' '}
        <span onClick={toggleFullscreen} style={{ cursor: 'pointer', paddingRight: 4 }}>
          {isFullscreen ? (
            <CompressOutlined style={{ color: '#fff' }} />
          ) : (
            <ExpandOutlined style={{ color: '#fff' }} />
          )}
        </span>
      </Popover>
      <Avatar menu {...props} />
      {/* <SelectLang className={styles.action} /> */}
    </div>
  );
};

export default connect(({ settings, login, user, global }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  appFlag: login.appFlag,
  menuList: user.currentMenu,
  sysPollutantTypeList: global.sysPollutantTypeList,
}))(GlobalHeaderRight);
