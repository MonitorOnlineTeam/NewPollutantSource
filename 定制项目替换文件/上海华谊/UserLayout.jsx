import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'dva';
import { QrcodeOutlined, DownloadOutlined } from '@ant-design/icons';
import { Modal, Popover, Row, Col, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../../public/sdlicon.png';
import config from '@/config';
import styles from './UserLayout.less';
import Cookie from 'js-cookie';

const IsShhy = true;

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
    configInfo: { IsOpera },
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
  const bgImageUrl = IsShhy
    ? `/bgImage/shhy/login_bg.jpg`
    : bgImageType
    ? `/bgImage/${bgImageType}/login_bg.jpg`
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
      <Fragment>
        {IsShhy && (
          <Row
            style={{ backgroundColor: '#fff', padding: '8px 14px' }}
            align="middle"
            justify="space-between"
          >
            <span style={{ fontSize: 18, fontWeight: 'bold' }}>服务热线：4008-728-118</span>
            <img style={{ width: 160, height: 66 }} src={`/bgImage/shhy/login_bg2.png`} />
          </Row>
        )}
        <div
          className={`${styles.container} ${bgImageType ? styles.container_bg : ''}`}
          style={{
            backgroundImage: `url(${bgImageUrl})`,
            height: IsShhy ? 'calc(100vh - 120px)' : '100vh',
          }}
        >
          {
            <div className={styles.lang}>
              {/* {
              configInfo && configInfo.IsShowQRcode === "true" &&
              <SelectLang />
            } */}
              {configInfo && configInfo.IsShowQRcode === 'true' && IsShhy ? (
                <div
                  style={{
                    position: 'absolute',
                    right: 14,
                    marginTop: 18,
                    width: 480,
                    lineHeight: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: 28,
                      color: '#fff',
                      fontWeight: 'bold',
                      lineHeight: '100%',
                      paddingBottom: 2,
                    }}
                  >
                    上海华谊环保科技有限公司
                  </div>
                  <div>
                    <div style={{ backgroundColor: '#fff', height: 10 }}></div>
                    <div
                      style={{
                        padding: '4px 0',
                        fontSize: 16,
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    >
                      Shanghai Huayi Environmental Protection Technology Co., Ltd.
                    </div>
                    {/* <img style={{width:'100%'}} src={`/bgImage/shhy/login_text.png`} /> */}
                    {/* backgroundColor:'rgba(255,255,255,.3)', */}
                  </div>
                </div>
              ) : IsOpera ? (
                <Popover
                  placement="rightTop"
                  content={
                    <Row gutter={48}>
                      {!configInfo.IsShowProjectRegion && (
                        <Col span={12} style={{ textAlign: 'center' }}>
                          <div style={{ marginBottom: '10px' }}>
                            <Button type="danger" icon={<DownloadOutlined />} size="small">
                              企业运维版下载
                            </Button>
                          </div>
                          <div>
                            <QRCode value={getIp} size={200} />
                            <div style={{ paddingTop: 6, fontSize: 16 }}>企业业主使用</div>
                          </div>
                        </Col>
                      )}
                      <Col
                        span={!configInfo.IsShowProjectRegion ? 12 : 24}
                        style={{ textAlign: 'center' }}
                      >
                        <div style={{ marginBottom: '10px' }}>
                          <Button type="danger" icon={<DownloadOutlined />} size="small">
                            运维APP下载
                          </Button>
                        </div>
                        <div>
                          <img width={200} alt="" src="/yunweicode.png" />
                          {!configInfo.IsShowProjectRegion && (
                            <div
                              style={{
                                position: 'absolute',
                                width: 200,
                                left: 24,
                                bottom: 24,
                                fontSize: 16,
                                background: '#fff',
                              }}
                            >
                              运维工程师使用
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  }
                  title="手机端下载"
                  trigger="hover"
                >
                  <QrcodeOutlined
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      right: '58px',
                      top: '22px',
                      fontSize: 16,
                    }}
                  />
                </Popover>
              ) : (
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

          <div className={styles.content} style={IsShhy ? { paddingTop: 80 } : {}}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  {configInfo && configInfo.IsShowLogo === 'true' && !IsShhy && (
                    <img alt="logo" className={styles.logo} src={configInfo.Logo || '/logo.png'} />
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
          <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.45)' }}>
            请使用谷歌chrome浏览器访问系统
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

        {/* <DefaultFooter copyright={'污染源智能分析平台  2019 SDL'} links={[]} /> */}

        {configInfo && configInfo.IsShowFooterMessages === 'true' && (
          <DefaultFooter copyright={configInfo && configInfo.LoginFooterMessages} links={[]} />
        )}
        {IsShhy && (
          <Row
            justify="end"
            style={{
              backgroundColor: '#fff',
              height: '100%',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            <span style={{ paddingRight: 14, paddingTop: 4 }}>中化学华谊环保&雪迪龙联合开发</span>
          </Row>
        )}
      </Fragment>
    </DocumentTitle>
  );
};

export default connect(({ settings, login, global }) => ({
  ...settings,
  configInfo: global.configInfo,
  appFlag: login.appFlag,
}))(UserLayout);
