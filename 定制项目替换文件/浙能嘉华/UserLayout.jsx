import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'dva';

import { QrcodeOutlined } from '@ant-design/icons';
import { Carousel, Popover } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../../public/sdlicon.png';
import config from '@/config';
import styles from './UserLayout.less';
import Cookie from 'js-cookie';

const UserLayout = props => {
  const {
    dispatch,
    route = {
      routes: [],
    },
  } = props;
  useEffect(() => {
    if (dispatch) {
      Cookie.set(config.cookieName, null);
      Cookie.set('currentUser', null);
      dispatch({
        type: 'global/getSystemLoginConfigInfo',
        payload: {},
      });
      dispatch({
        type: 'login/IfSpecial',
        payload: {},
      });
    }
  }, []);
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: configInfo && configInfo.SystemName,
    },
    configInfo,
    appFlag,
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = configInfo ? `登录 - ${configInfo.SystemName}` : '登录';

  var QRCode = require('qrcode.react');
  //获取当前ip地址和端口号
  var getIp = '';
  if (appFlag) {
    getIp = appFlag;
  } else {
    getIp = 'http://' + window.location.host + '/appoperation/appqrcodemain';
  }
  const bgImageType = configInfo.LAMImgType;
  const bgImageUrl = bgImageType
    ? `/bgImage/${bgImageType}/浙能嘉华.png`
    : 'https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg';
  return (
    <DocumentTitle
      // title={getPageTitle({
      //   // pathname: configInfo && configInfo.SystemName,
      //   pathname: location.pathname,
      //   breadcrumb,
      //   formatMessage,
      //   ...props,
      // })}
      title={title}
    >
      <div
        className={`${styles.container} ${bgImageType ? styles.container_bg : ''}`}
        style={{ backgroundImage: `` }}
      >
        <Carousel autoplay effect="fade" autoplaySpeed={90000}>
          <div>
            <div
              className={`${styles.container} ${styles.container_bg}`}
              style={{
                // position: 'absolute',
                // top: 0,
                // right: 0,
                backgroundImage: `url(/bgImage/1/浙能嘉华.png)`,
                width: '100vw',
                height: '100vh',
              }}
            ></div>
          </div>
          <div>
            <div
              className={`${styles.container} ${styles.container_bg}`}
              style={{
                // position: 'absolute',
                // top: 0,
                // right: 0,
                backgroundImage: `url(/bgImage/2/浙能嘉华.png)`,
                width: '100vw',
                height: '100vh',
              }}
            ></div>
          </div>
          <div>
            <div
              className={`${styles.container} ${styles.container_bg}`}
              style={{
                // position: 'absolute',
                // top: 0,
                // right: 0,
                backgroundImage: `url(/bgImage/3/浙能嘉华.png)`,
                width: '100vw',
                height: '100vh',
              }}
            ></div>
          </div>
        </Carousel>

        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1,
          }}
        >
          {
            <div className={styles.lang}>
              {/* {
              configInfo && configInfo.IsShowQRcode === "true" &&
              <SelectLang />
            } */}
              {configInfo && configInfo.IsShowQRcode === 'true' && (
                <Popover
                  content={
                    <div>
                      <QRCode value={getIp} size={200} />
                    </div>
                  }
                  title="手机端下载"
                  trigger="hover"
                >
                  <QrcodeOutlined style={{ marginRight: '20px' }} />
                </Popover>
              )}
            </div>
          }

          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  {configInfo && configInfo.IsShowLogo === 'true' && (
                    <img alt="logo" className={styles.logo} src={configInfo.Logo} />
                  )}

                  {/* <span className={styles.title}>污染源智能分析平台</span> */}
                  <span className={styles.title}>{configInfo && configInfo.SystemName}</span>
                </Link>
              </div>
              {/* <div className={styles.desc}>SDL 一流的污染源监控专家</div> */}
              <div className={styles.desc}>{configInfo && configInfo.LoginSubtitle}</div>
            </div>
            {children}
          </div>
          {/* <DefaultFooter copyright={'污染源智能分析平台  2019 SDL'} links={[]} /> */}
          {configInfo && configInfo.IsShowFooterMessages === 'true' && (
            <DefaultFooter copyright={configInfo && configInfo.LoginFooterMessages} links={[]} />
          )}
          {configInfo && configInfo.TechnicalSupport && (
            <p
              style={{
                fontSize: 14,
                textAlign: 'center',
                color: 'rgba(0, 0, 0, 0.45)',
                marginTop: -13,
              }}
            >
              {configInfo.TechnicalSupport}
            </p>
          )}
        </div>
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings, login, global }) => ({
  ...settings,
  configInfo: global.configInfo,
  appFlag: login.appFlag,
}))(UserLayout);
