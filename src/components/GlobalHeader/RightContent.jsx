import { QrcodeOutlined } from '@ant-design/icons';
import { Tooltip, Popover, Dropdown, Menu } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';
import config from '@/config';
import NoticeIconView from './NoticeIconView'
import { UnorderedListOutlined } from '@ant-design/icons';
import webConfig from '../../../public/webConfig'
import { router } from 'umi'

const GlobalHeaderRight = props => {

  const { theme, layout, configInfo, appFlag, sysPollutantTypeList } = props;
  // console.log("changePwdVisible=",props);
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  var QRCode = require('qrcode.react');
  //获取当前ip地址和端口号
  var getIp = "";
  if (appFlag) {
    getIp = appFlag;
  }
  else {
    getIp = "http://" + window.location.host + "/appoperation/appqrcodemain";
  }

  const menu = (
    <Menu selectedKeys={[sessionStorage.getItem('sysMenuId')]}>
      {
        sysPollutantTypeList.map(item => {
          return <Menu.Item key={item.ID}>
            <a target="_blank" rel="noopener noreferrer" onClick={() => {
              let url = item.Url ? new URL(item.Url) : item.Url;
              if (item.ID !== sessionStorage.getItem('sysMenuId')) {
                debugger
                if (url && (url.protocol === 'http:' || url.protocol === 'https:')) {
                  if (webConfig.middlePageOpenMode === 'single') {
                    window.location.href = url.href;
                  } else {
                    window.open(url);
                  }
                } else {
                  if (webConfig.middlePageOpenMode === 'single') {
                    router.push(`/sessionMiddlePage?sysInfo=${JSON.stringify(item)}`)
                  } else {
                    window.open(`/sessionMiddlePage?sysInfo=${JSON.stringify(item)}`)
                  }
                }
              }
            }}>
              {item.Name}
            </a>
          </Menu.Item>
        })
      }
    </Menu>
  );

  return (
    <div className={className}>
      {
        configInfo.IsShowSysPage === '1' && <Dropdown overlay={menu} trigger={['click']}>
          <Tooltip title="切换系统">
            <a
              rel="noopener noreferrer"
              className={styles.action}
            >
              <UnorderedListOutlined />
            </a>
          </Tooltip>
        </Dropdown>
      }
      {
        configInfo && configInfo.IsShowQRcode === 'true' &&
        <Popover content={<div>
          <QRCode value={getIp} size={200} />
        </div>} title="手机端下载" trigger="hover">
          <a
            rel="noopener noreferrer"
            className={styles.action}
          >
            <QrcodeOutlined />
          </a>
        </Popover>
      }

      {/** 污水处理厂权限去掉铃铛 */}
      <NoticeIconView />
      <Avatar menu {...props} />
      {/* <SelectLang className={styles.action} /> */}
    </div>
  );
};

export default connect(({ settings, login, global }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  appFlag: login.appFlag,
  sysPollutantTypeList: global.sysPollutantTypeList,
}))(GlobalHeaderRight);
