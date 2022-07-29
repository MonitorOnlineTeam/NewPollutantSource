import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'dva';
import { DownloadOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Button, Popover, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import Cookie from 'js-cookie';
import logo from '../../public/gg.png';
import config from '@/config';
import styles from './UserLayout.less';

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
        type: 'login/getSystemLoginConfigInfo',
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

  const QRCode = require('qrcode.react');
  // 获取当前ip地址和端口号
  let getIp = '';
  if (appFlag) {
    getIp = appFlag;
  } else {
    getIp = `http://${window.location.host}/appoperation/appqrcodemain`;
  }
  // const links = [{ key: '新疆空天地一体化系统', title: '新疆空天地一体化系统', href: 'http://xj.airsensor.top:5000/login', blankTarget: true }];
 
  const links = [{ key: '', title: '', href: '', blankTarget: false }];
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
      <div className={styles.container}>
        {

          <div className={styles.lang}>
            {
              configInfo && configInfo.IsShowQRcode === 'true' &&
              <SelectLang />
            }

          </div>
        }

        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">

                {
                  configInfo && configInfo.IsShowLogo === 'true' && <img alt="logo" className={styles.logo} src={configInfo.Logo ? `/${configInfo.Logo}` : logo} />
                }

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
        {
          configInfo && configInfo.IsShowQRcode === 'true' &&
          <Popover
            content={
              <Row gutter={48}>
                 <Col span={12} style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <Button type="danger" icon={<DownloadOutlined />} size="small">污染源监控下载</Button>
                  </div>
                  <div>
                    <QRCode value={getIp} size={200} />
                  </div>
                </Col> 
                <Col span={12} style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '10px' }}>
                    <Button type="danger" icon={<DownloadOutlined />} size="small">运维APP下载</Button>
                  </div>
                  <div>
                     <img
                    width={200}
                    alt=""
                    src="/yunweicode.png"
                  />
                  </div>
                </Col>
              </Row>
            }
            title="手机端下载" trigger="hover">
            <QrcodeOutlined
              style={{ position: 'absolute', cursor: 'pointer', right: '58px', top: '22px', fontSize: 16 }} />
          </Popover>
        }
        {
          configInfo && configInfo.IsShowFooterMessages === 'true' && <DefaultFooter copyright={configInfo && configInfo.LoginFooterMessages} links={links} />
        }
        {configInfo && configInfo.TechnicalSupport && <p style={{ fontSize: 14, textAlign: 'center', color: 'rgba(0, 0, 0, 0.45)', marginTop: -13 }}>{configInfo.TechnicalSupport}</p>}
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings, login }) => ({ ...settings, configInfo: login.configInfo, appFlag: login.appFlag }))(UserLayout);
