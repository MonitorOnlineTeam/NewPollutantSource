import { Tooltip, Popover } from 'antd';
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';
import config from '@/config';
import NoticeIconView from './NoticeIconView'
import { ExpandOutlined, CompressOutlined, } from '@ant-design/icons';

const GlobalHeaderRight = props => {
  const { theme, layout, configInfo, appFlag } = props;
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

  useEffect(()=>{
    // window.addEventListener('keydown', function(event) {  
    //   if (event.key === 'F11') {  
    //     if (!document.fullscreenElement) {  //默认状态下执行操作   非全面屏状态 变 全面屏    
    //        console.log('非全面屏状态')
    //        setIsFullscreen(true)
    //     }
        //  else {    //全屏状态下执行操作   全面屏状态 变 非全面屏
        //   console.log('全面屏状态')
        //   setIsFullscreen(false)
        // }  
      // }  
    // });
    window.addEventListener('resize', function(event) {  
        if (!document.fullscreenElement) {  //全面屏 - 非全面屏  手动打开  esc关闭的情况 f11关闭的情况
          setIsFullscreen(false)
        }
      
    });
  },[])

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
     
    if (!document.fullscreenElement) { //默认状态
      const element = document.documentElement;
      element.requestFullscreen();
    } else {
      if (document.exitFullscreen) { //全屏状态
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };
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
      {
        /*
        configInfo && configInfo.IsShowQRcode === 'true' &&
        <Popover content={<div>
          <QRCode value={getIp} size={200} />
        </div>} title="手机端下载" trigger="hover">
          <a
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="qrcode" />
          </a>
        </Popover>*/
      }

      {/** 污水处理厂权限去掉铃铛<NoticeIconView /> */}
      <Popover zIndex={9999} overlayClassName={styles.expandPopSty} content={isFullscreen ? '退出全屏' : '全屏展示'}> <span onClick={toggleFullscreen} style={{ cursor: 'pointer', paddingRight: 4 }} >{isFullscreen ? <CompressOutlined style={{ color: '#fff' }} /> : <ExpandOutlined style={{ color: '#fff' }} />}</span></Popover>
      <Avatar menu {...props} />
      {/* <SelectLang className={styles.action} /> */}
    </div>
  );
};

export default connect(({ settings, login }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  appFlag: login.appFlag
}))(GlobalHeaderRight);
