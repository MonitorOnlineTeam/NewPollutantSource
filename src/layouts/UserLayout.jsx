import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../../public/sdlicon.png';
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
      dispatch({
        type: 'login/getSystemLoginConfigInfo',
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
    configInfo
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = configInfo ? `登录 - ${configInfo.SystemName}` : "登录";
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
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">

                {
                  configInfo && configInfo.IsShowLogo === "true" && <img alt="logo" className={styles.logo} src={logo} />
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
          configInfo && configInfo.IsShowFooterMessages === "true" && <DefaultFooter copyright={configInfo && configInfo.LoginFooterMessages} links={[]} />
        }

      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings, login }) => ({ ...settings, configInfo: login.configInfo }))(UserLayout);
