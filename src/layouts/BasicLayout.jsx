import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import React, { Component, Suspense } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../../public/sdlicon.png';
import config from '@/config';
import styles from './BasicLayout.less';
import Cookie from 'js-cookie';
import { DownOutlined } from '@ant-design/icons';
import { Tabs, Dropdown, Menu, message } from 'antd';
import PageLoading from '@/components/PageLoading'
import _ from "lodash"
import defaultSettings from '../../config/defaultSettings.js'
import webConfig from "../../public/webConfig"
import SdlMenu from "@/components/SdlMenu"

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
    window.addEventListener('resize', this.onWindowResize)
    const { dispatch, configInfo } = this.props;
    // dispatch({
    //   type: 'global/getSystemConfigInfo',
    //   payload: {},
    // });
    dispatch({
      type: 'user/fetchCurrent',
      payload: {},
    });
    dispatch({
      type: "global/updateState",
      payload: {
        clientHeight: document.body.clientHeight
      },
    })

    if (!this.props.sysPollutantTypeList.length && configInfo.IsShowSysPage === '1') {
      dispatch({
        type: 'global/getSysPollutantTypeList',
      })
    }
  }

  onWindowResize = () => {
    this.props.dispatch({
      type: "global/updateState",
      payload: {
        clientHeight: document.body.clientHeight
      },
    })
  }

  render() {
    const { dispatch, children, settings, currentMenu, configInfo, loading } = this.props;
    const { panes } = this.state;

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
            NavigateUrl: `${currentMenu[0]}/${item.NavigateUrl}`
          }
        })
      }
      return menuList;
    };

    const logoRender = Item => {
      if (configInfo && configInfo.IsShowLogo === "true") {
        return settings.layout === 'topmenu' ? (
          <img style={{ height: 60 }} src={configInfo.Logo ? `/api/upload/${configInfo.Logo}` : logo} alt="logo" />
        ) : (
          <img src={`/api/upload/${configInfo.Logo}`} alt="logo" />
        );
      }
      else {
        return <div></div>
      }
    };

    let userCookie = Cookie.get('currentUser');
    if (!userCookie) {
      router.push("/user/login");
    }
    let _settings = settings;
    if (sessionStorage.getItem('sysName')) {
      _settings.title = sessionStorage.getItem('sysName')
    }
    return (
      <>
        <Suspense fallback={<PageLoading />}>
          <SdlMenu match={this.props.match} location={this.props.location} />
        </Suspense>
        <ProLayout
          logo={logoRender}
          onCollapse={handleMenuCollapse}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.replace && userCookie !== "null") {
            } else if (userCookie === "null") {
              router.push("/user/login");
            }
            if (menuItemProps.isUrl) {
              return defaultDom;
            }
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: formatMessage({
                id: 'menu.home',
                defaultMessage: 'Home',
              }),
            },
            ...routers,
          ]}
          footerRender={() => {
            return <div></div>;
          }}
          menuDataRender={menuDataRender}
          rightContentRender={rightProps => <RightContent {...rightProps} />}
          {...this.props}
          {..._settings}
        >
          {
            (webConfig.isShowBreadcrumb ? <div id="basicLayout">{children}</div> : <div id="notBreadcrumbLayout"> {children} </div>)
          }
        </ProLayout>
        <Suspense fallback={<PageLoading />}>
          {process.env.NODE_ENV === "development" &&
            <SettingDrawer
              settings={_settings}
              onSettingChange={config =>
                dispatch({
                  type: 'settings/changeSetting',
                  payload: config,
                })
              }
            />
          }
        </Suspense>
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
  loading: loading.effects["global/getSystemConfigInfo"],
  sysPollutantTypeList: global.sysPollutantTypeList,
}))(BasicLayout);
