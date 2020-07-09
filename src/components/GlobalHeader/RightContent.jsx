import { QrcodeOutlined } from '@ant-design/icons';
import { Tooltip, Popover } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';
import config from '@/config';
import NoticeIconView from './NoticeIconView';

const GlobalHeaderRight = props => {
  const { theme, layout, configInfo, appFlag } = props;
  // console.log("changePwdVisible=",props);
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  var QRCode = require('qrcode.react');
  //获取当前ip地址和端口号
  var getIp = '';
  if (appFlag) {
    getIp = appFlag;
  } else {
    getIp = 'http://' + window.location.host + '/appoperation/appqrcodemain';
  }

  return (
    <div className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder={formatMessage({
          id: 'component.globalHeader.search',
        })}
        dataSource={[
          formatMessage({
            id: 'component.globalHeader.search.example1',
          }),
          formatMessage({
            id: 'component.globalHeader.search.example2',
          }),
          formatMessage({
            id: 'component.globalHeader.search.example3',
          }),
        ]}
        onSearch={value => {
          console.log('input', value);
        }}
        onPressEnter={value => {
          console.log('enter', value);
        }}
      /> */}
      {/* <Tooltip
        title={formatMessage({
          id: 'component.globalHeader.help',
        })}
      >
        <a
          target="_blank"
          href="https://pro.ant.design/docs/getting-started"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <Icon type="question-circle-o" />
        </a>
      </Tooltip> */}
      {configInfo && configInfo.IsShowQRcode === 'true' && (
        <Popover
          content={
            <div>
              {/* <img
          width={272}
          alt="logo"
          src={`/api/upload/phoneQRCode.png`}
        /> */}
              <QRCode value={getIp} size={200} />
            </div>
          }
          title="手机端下载"
          trigger="hover"
        >
          <a rel="noopener noreferrer" className={styles.action}>
            <QrcodeOutlined />
          </a>
        </Popover>
      )}

      {/** 污水处理厂权限去掉铃铛 */}
      <NoticeIconView />
      <Avatar menu {...props} />
      {/* <SelectLang className={styles.action} /> */}
    </div>
  );
};

export default connect(({ settings, login }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  appFlag: login.appFlag,
}))(GlobalHeaderRight);
