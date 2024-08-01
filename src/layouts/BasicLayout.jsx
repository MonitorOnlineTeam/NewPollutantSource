import ProLayout, { PageLoading, SettingDrawer } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../../public/sdlicon.png';
import Cookie from 'js-cookie';
import { Tabs, Dropdown, Menu, message } from 'antd';
import webConfig from '../../public/webConfig';
import SdlMenu from '@/components/SdlMenu';
import styles from './BasicLayout.less';
import { isOperaSystem } from '@/utils/utils';
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panes: [],
    };

    message.config({
      top: 70,
      duration: 3,
      maxCount: 3,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    const { dispatch, configInfo } = this.props;
    // dispatch({
    //   type: 'global/getSystemConfigInfo',
    //   payload: {},
    // });
    // configInfo.IsOpera &&
    dispatch({
      //获取运维基础配置
      type: 'global/getOperationSetting',
      payload: {},
    });
    // 获取菜单
    dispatch({
      type: 'user/fetchCurrent',
      payload: {},
    });
    dispatch({
      type: 'global/updateState',
      payload: {
        clientHeight: document.body.clientHeight,
      },
    });
    const sysName = sessionStorage.getItem("sysName") || Cookie.get("sysName")
    dispatch({
      type: 'global/updateState',
      payload: {
        clientHeight: document.body.clientHeight,
        configInfo: { ...this.props.configInfo, IsOpera: isOperaSystem(sysName) }
      },
    });
    dispatch({
      type: 'login/IfSpecial',
      payload: {},
    });
    //获取行政区列表
    dispatch({
      type: 'autoForm/getRegions',
      payload: { PointMark: '2', RegionCode: '' },
    });
    // if (!this.props.sysPollutantTypeList.length && configInfo.IsShowSysPage === '1') {
    if (!this.props.sysPollutantTypeList.length) {
      dispatch({
        type: 'global/getSysPollutantTypeList',
      });
    }
  }

  onWindowResize = () => {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        clientHeight: document.body.clientHeight,
      },
    });
  };

  render() {
    const { dispatch, children, settings, currentMenu, configInfo, loading } = this.props;
    const { panes } = this.state;

    if (loading) {
      return <PageLoading />;
    }

    const handleMenuCollapse = payload =>
      dispatch &&
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });

    const menuDataRender = list => {
      let menuList = currentMenu;
      // 如果只有一个，平铺展示子菜单
      if (currentMenu && currentMenu.length === 1) {
        menuList = currentMenu[0].children.map(item => {
          return {
            ...item,
            NavigateUrl: `${currentMenu[0]}/${item.NavigateUrl}`,
          };
        });
      }
      return menuList;
    };

    const logoRender = Item => {
      return settings.layout === 'topmenu' ? (
        <img
          style={{ height: 60 }}
          src={configInfo.Logo ? `${configInfo.Logo}` : logo}
          alt="logo"
        />
      ) : (
          <img src={`${configInfo.Logo}`} alt="logo" />
        );
    }

    let userCookie = Cookie.get('currentUser');
    if (!userCookie) {
      router.push('/user/login');
    }
    let _settings = settings;
    const sysName = sessionStorage.getItem("sysName") || Cookie.get("sysName")
    if (sysName) {
      _settings.title = sysName;
    }
    const isShowLogo = configInfo && configInfo.IsShowLogo === 'true'
    const isScroll = !isShowLogo && _settings.title?.length > 14
    // const isLogoScroll = isShowLogo && _settings.title?.length > 11

    return (
      <>
        <SdlMenu match={this.props.match} location={this.props.location} />
        <ProLayout
          logo={logoRender}
          onCollapse={handleMenuCollapse}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.replace && userCookie !== 'null') {
            } else if (userCookie === 'null') {
              router.push('/user/login');
            }
            if (menuItemProps.isUrl) {
              return defaultDom;
            }
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => {
            return [
              {
                path: '/',
                breadcrumbName: formatMessage({
                  id: 'menu.home',
                  defaultMessage: 'Home',
                }),
              },
              ...routers,
            ];
          }}
          footerRender={() => {
            return <div></div>;
          }}
          menuDataRender={menuDataRender}
          rightContentRender={rightProps => <RightContent {...rightProps} />}
          {...this.props}
          {..._settings}
          menuHeaderRender={(logo, title, props) => {
            return <>
              {isShowLogo && logoRender()} {/*  || (isLogoScroll && styles.layoutSty2) 带logo的*/}
              <a className={(isScroll && styles.layoutSty)} href={currentMenu?.[0]?.path}> <h1 style={{ width: isScroll && _settings.title?.length * 19 }} title={_settings.title}>{_settings.title}</h1></a>
            </>
          }
          } //宝武 系统名称太长 添加滚动效果
        >
          {webConfig.isShowBreadcrumb ? (
            <div id="basicLayout">{children}</div>
          ) : (
              <div id="notBreadcrumbLayout"> {children} </div>
            )}
        </ProLayout>
        {process.env.NODE_ENV === 'development' && (
          <SettingDrawer
            settings={_settings}
            onSettingChange={config =>
              dispatch({
                type: 'settings/changeSetting',
                payload: config,
              })
            }
          />
        )}
      </>
    );
  }
}

export default connect(({ global, settings, user, loading }) => ({
  collapsed: global.collapsed,
  changePwdVisible: global.changePwdVisible,
  settings,
  currentMenu: user.currentMenu,
  configInfo: global.configInfo,
  unfoldMenuList: user.unfoldMenuList,
  loading: loading.effects['global/getSystemConfigInfo'],
  sysPollutantTypeList: global.sysPollutantTypeList,
}))(BasicLayout);
