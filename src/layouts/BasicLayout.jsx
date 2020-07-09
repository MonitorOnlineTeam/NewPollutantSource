import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect, Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro } from '@/utils/utils';
import logo from '../../public/sdlicon.png';
import config from '@/config';
import Item from 'antd/lib/list/Item';
import styles from './BasicLayout.less';
import Cookie from 'js-cookie';
import Title from 'antd/lib/typography/Title';
import { DownOutlined } from '@ant-design/icons';
import { Tabs, Dropdown, Menu } from 'antd';
import PageLoading from '@/components/PageLoading';
import _ from 'lodash';
import defaultSettings from '../../config/defaultSettings.js';
import routerConfig from '../../config/config';
import webConfig from '../../public/webConfig';

function formatter(routes, parentPath = { path: '' }) {
  const fixedParentPath = parentPath.path.replace(/\/{1,}/g, '/');
  let result = [];
  routes.forEach(item => {
    if (item.path) {
      result.push({
        path: `${item.path}`.replace(/\/{1,}/g, '/'),
        redirect: !!item.redirect,
      });
    }
    if (item.routes) {
      result = result.concat(
        formatter(
          item.routes,
          item.path
            ? {
                path: `${item.path}`,
                redirect: !!item.redirect,
              }
            : parentPath,
        ),
      );
    }
  });
  return _.uniq(result.filter(item => !!item));
}

const { TabPane } = Tabs;
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panes: [],
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getSystemConfigInfo',
      payload: {},
    });
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

    const contentElement = document.querySelector('.ant-pro-basicLayout-content');

    if (config.isShowTabs && defaultSettings.layout === 'sidemenu' && contentElement) {
      contentElement.style.margin = '8px';
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

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.location.pathname != this.props.location.pathname &&
      nextProps.unfoldMenuList.length &&
      config.isShowTabs &&
      defaultSettings.layout === 'sidemenu'
    ) {
      this._updatePanesAndActiveKey(nextProps);
    }

    if (
      nextProps.unfoldMenuList !== this.props.unfoldMenuList &&
      config.isShowTabs &&
      defaultSettings.layout === 'sidemenu'
    ) {
      this._updatePanesAndActiveKey(nextProps);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // 处理tab样式
    if (this.state.activeKey !== prevState.activeKey) {
      const activeElement = document.getElementsByClassName('ant-tabs-tabpane-active')[0];
      const treeElement = activeElement
        ? activeElement.getElementsByClassName('ant-drawer-open')
        : [];
      const tabElement = document.querySelector('.ant-tabs-card-bar');
      if (treeElement.length) {
        tabElement ? (tabElement.style.marginRight = '320px') : undefined;
      } else {
        tabElement ? (tabElement.style.marginRight = 0) : undefined;
      }
      if (document.querySelector('.ant-pro-basicLayout-content')) {
        // document.querySelector(".ant-pro-basicLayout-content").style.margin = "8px"
      }
    }
  }

  // 匹配路由
  matchCurrentPath = (props, unfoldMenuList, pathname) => {
    const {
      location,
      match: {
        params: { parentcode },
      },
    } = props;
    // 当前页面
    let currentPath = _.toUpper(pathname);

    let matchPathObj =
      unfoldMenuList.find(menu => {
        let menuPath = _.toUpper(menu.path);

        // 二级页面路由和父路由能匹配上
        if (menuPath.indexOf(currentPath) > -1) {
          return menuPath.indexOf(currentPath) > -1;
        } else if (menuPath.indexOf(currentPath.split('/').pop()) > -1) {
          // 二级页面路由和父路由不能匹配上，匹配configId
          return menuPath.indexOf(currentPath.split('/').pop()) > -1;
        }
      }) || {};
    return matchPathObj;
  };

  // 更新Tab
  _updatePanesAndActiveKey = props => {
    const { location, unfoldMenuList, children, history } = props;
    // console.log("_updatePanesAndActiveKey=", props)
    let _unfoldMenuList = _.cloneDeep(unfoldMenuList);

    let currentPathObj =
      _unfoldMenuList.find(item => {
        if (item.path) {
          return item.path.split('?')[0] === location.pathname;
        }
      }) || {};

    if (!currentPathObj.name && location.pathname.indexOf('AutoFormView') > -1) {
      // AutoForm - 详情
      let pathname = location.pathname.match(/(\S*)\/AutoFormView/)[1];
      currentPathObj = this.matchCurrentPath(props, _unfoldMenuList, pathname);
      currentPathObj.name += ' - 详情';
    } else if (!currentPathObj.name && location.pathname.indexOf('autoformadd') > -1) {
      // AutoForm - 添加
      let pathname = _.toLower(location.pathname).match(/(\S*)\/autoformadd/)[1];
      currentPathObj = this.matchCurrentPath(props, _unfoldMenuList, pathname);
      currentPathObj.name += ' - 添加';
    } else if (!currentPathObj.name && _.toLower(location.pathname).indexOf('autoformedit') > -1) {
      // AutoForm - 编辑
      let pathname = _.toLower(location.pathname).match(/(\S*)\/autoformedit/)[1];
      currentPathObj = this.matchCurrentPath(props, _unfoldMenuList, pathname);
      currentPathObj.name += ' - 编辑';
    } else if (!currentPathObj.name) {
      // 从地址栏中获取tabName
      currentPathObj.name = location.query.tabName;
    }

    const panes = [...this.state.panes];
    const pane = {
      key: location.pathname,
      tab: currentPathObj.name,
      content: children,
      closable: true,
    };
    if (!panes.length) {
      panes.push(pane);
    } else if (panes.filter(item => item.key === pane.key).length === 0) {
      panes.push(pane);
    }
    const activeKey = pane.key;
    this.setState({ panes, activeKey });
  };

  // tab切换，更改选中key及手动跳转路由
  onChange = activeKey => {
    this.setState({ activeKey });
    router.push(activeKey);
  };

  // tab - 删除
  onTabsEdit = (targetKey, action) => {
    let panes = [...this.state.panes];

    if (action === 'remove') {
      panes = panes.filter(item => item.key !== targetKey);
      this.setState({ activeKey: [...panes].pop().key, panes }, () => {
        router.push(this.state.activeKey);
      });
    }
  };

  // tab右侧更多菜单
  onClickHover = e => {
    let { key } = e,
      { activeKey, panes } = this.state;
    if (key === '1') {
      panes = panes.filter(item => item.key !== activeKey);
      activeKey = [...panes].pop().key;
      this.setState(
        {
          panes,
          activeKey,
        },
        () => {
          router.push(activeKey);
        },
      );
    } else if (key === '2') {
      panes = panes.filter(item => item.key === activeKey);
      activeKey = [...panes].pop().key;
      this.setState(
        {
          panes,
          activeKey,
        },
        () => {
          router.push(activeKey);
        },
      );
    }
  };

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
            NavigateUrl: `${currentMenu[0]}/${item.NavigateUrl}`,
          };
        });
      }
      // console.log("menuList=", menuList);
      return menuList;
    };

    const logoRender = Item => {
      if (configInfo && configInfo.IsShowLogo === 'true') {
        return settings.layout === 'topmenu' ? (
          <img
            style={{ height: 60 }}
            src={configInfo.Logo ? `/api/upload/${configInfo.Logo}` : logo}
            alt="logo"
          />
        ) : (
          <img src={`/api/upload/${configInfo.Logo}`} alt="logo" />
        );
      } else {
        return <div></div>;
      }
    };

    const menu = (
      <Menu onClick={this.onClickHover}>
        <Menu.Item key="1">关闭当前标签页</Menu.Item>
        <Menu.Item key="2">关闭其他标签页</Menu.Item>
      </Menu>
    );
    const operations = (
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" href="#">
          更多
          <DownOutlined />
        </a>
      </Dropdown>
    );

    if (loading) {
      return <PageLoading />;
    }

    let userCookie = Cookie.get('currentUser');
    if (!userCookie) {
      router.push('/user/login');
    }
    return (
      <>
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
          // formatMessage={formatMessage}
          rightContentRender={rightProps => <RightContent {...rightProps} />}
          {...this.props}
          {...settings}
        >
          {config.isShowTabs && defaultSettings.layout === 'sidemenu' ? (
            <div
              id="sideMenuTabsLayout"
              style={{ margin: '-24px -24px 0px', padding: '10px', paddingTop: 4 }}
            >
              <Tabs
                type="editable-card"
                size="small"
                hideAdd
                activeKey={this.state.activeKey}
                onChange={this.onChange}
                onEdit={this.onTabsEdit}
                className={styles.pageTabs}
                tabBarStyle={{ marginBottom: 3 }}
                tabBarGutter={0}
                tabBarExtraContent={panes.length > 1 ? operations : ''}
              >
                {this.state.panes.map(pane => (
                  <TabPane tab={pane.tab} key={pane.key} closable={panes.length != 1}>
                    {pane.content}
                  </TabPane>
                ))}
              </Tabs>
            </div>
          ) : webConfig.isShowBreadcrumb ? (
            <div id="basicLayout">{children}</div>
          ) : (
            <div id="notBreadcrumbLayout"> {children} </div>
          )}
        </ProLayout>
        {process.env.NODE_ENV === 'development' && (
          <SettingDrawer
            settings={settings}
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
}))(BasicLayout);
