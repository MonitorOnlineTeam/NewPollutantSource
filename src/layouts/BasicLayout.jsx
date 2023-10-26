import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect, Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro } from '@/utils/utils';
import config from '@/config';
import Item from 'antd/lib/list/Item';
import Cookie from 'js-cookie';
import Title from 'antd/lib/typography/Title';
import { DownOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import { Tabs, Dropdown, Menu, message } from 'antd';
import PageLoading from '@/components/PageLoading'
import _ from 'lodash'
import styles from './BasicLayout.less';
import logo from '../../public/gg.png';
import defaultSettings from '../../config/defaultSettings.js'
import routerConfig from '../../config/config'
import webConfig from '../../public/webConfig'


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
        formatter(item.routes, item.path ? {
          path: `${item.path}`,
          redirect: !!item.redirect,
        } : parentPath),
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

    message.config({
      top: 70,
      duration: 3,
      maxCount: 3,
    });
  }

  menuPermissions = () => {
    const { dispatch, location: { pathname }, } = this.props;
    const mateObj = {
      '/noticeManger/detail': '/systemManger/noticeManger', //系统管理-公告管理
      '/problemManger/detail': '/systemManger/problemManger',
      '/equipmentAccount/point': '/commissionTest/equipmentAccount/pollutantManager/TestEnterprise',
      '/TestPoint/AutoFormView': '/commissionTest/equipmentAccount/pollutantManager/TestEnterprise',
      '/projectManager/detail': '/platformconfig/basicInfo/projectManager',
      '/user/userinfoview': '/rolesmanager/user/newUserInfo',
      '/user/userinfoedit': '/rolesmanager/user/newUserInfo',
      '/equipmentFeedback/detail': '/operations/equipmentFeedback',
      '/overVerifyRate/cityLevel': '/Intelligentanalysis/dataAlarm/overVerifyRate',
      '/overVerifyRate/pointVerifyRate': '/Intelligentanalysis/dataAlarm/overVerifyRate',
      '/overVerifyRate/pointVerifyRate': '/Intelligentanalysis/dataAlarm/overVerifyRate',
      '/missingData/ent/cityLevel': '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/ent',
      '/missingData/ent/missDataSecond': '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/ent',
      '/missingDataRate/ent/citylevel': '/Intelligentanalysis/dataAlarm/missingDataRate/ent',
      '/missingDataRate/missRateDataSecond': '/Intelligentanalysis/dataAlarm/missingDataRate/ent',
      '/exceptionrecord/cityLevel': '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/exceptionrecord',
      '/exceptionrecord/details': '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/exceptionrecord',
      '/abnormal/cityLevel': '/Intelligentanalysis/dataAlarm/abnormal',
      '/abnormal/details': '/Intelligentanalysis/dataAlarm/abnormal',
      '/abnormalWorkStatistics/regionDetail': '/Intelligentanalysis/operationWorkStatis/abnormalWorkStatistics',
      '/transmissionefficiency/cityLevel': '/Intelligentanalysis/transmissionefficiency',
      '/transmissionefficiency/qutDetail': '/Intelligentanalysis/transmissionefficiency',
      '/accessStatistics/missDataSecond': '/Intelligentanalysis/accessStatistics',
    }

    const menuComparison = (meunData) => {
      const sysName = sessionStorage.getItem("sysName")
      // if(sysName!='设备运维管理平台'){
      //   return
      // }
      if (!pathname || pathname == '/' || pathname == '/hrefLogin' || pathname == '/account/settings') {
        return
      }
      if (meunData.includes(pathname)) {
        // console.log('路由存在')
        return;
      } else {
        const autoFormDetailRegeMatch = pathname.match(/TestEnterprise/) || pathname.match(/AEnterpriseTest/) || pathname.match(/OperationMaintenanceEnterprise/) || pathname.match(/MaintenanceDatabase/) || pathname.match(/OperationMaintenancePersonnel/) || pathname.match(/OperationCycle/) || pathname.match(/Storehouse/) || pathname.match(/OutputStopNew/) || pathname.match(/CTEnterprise/)  //autoForm详情 存在上级页面 通过configId匹配
        const subPagesRegeMatch = pathname.match(/\/noticeManger\/detail/) || pathname.match(/\/problemManger\/detail/) || pathname.match(/\/equipmentAccount\/point/) || pathname.match(/\/TestPoint\/detail/) || pathname.match(/\/projectManager\/AutoFormView/) || pathname.match(/\/user\/userinfoview/) || pathname.match(/\/user\/userinfoedit/) || pathname.match(/\/equipmentFeedback\/detail/) ||
          pathname.match(/\/overVerifyRate\/cityLevel/) || pathname.match(/\/overVerifyRate\/pointVerifyRate/) || pathname.match(/\/missingData\/ent\/cityLevel/) || pathname.match(/\/missingData\/ent\/missDataSecond/) || pathname.match(/\/missingDataRate\/ent\/citylevel/) || pathname.match(/\/missingDataRate\/missRateDataSecond/) ||
          pathname.match(/\/exceptionrecord\/cityLevel/) || pathname.match(/\/exceptionrecord\/details/) || pathname.match(/\/abnormal\/cityLevel/) || pathname.match(/\/abnormal\/details/) || pathname.match(/\/abnormalWorkStatistics\/regionDetail/) || pathname.match(/\/transmissionefficiency\/cityLevel/) || pathname.match(/\/transmissionefficiency\/qutDetail/) ||
          pathname.match(/\/accessStatistics\/missDataSecond/); //存在上级页面

        if (autoFormDetailRegeMatch?.length > 0) {
          const meunStr = JSON.stringify(meunData)
          if (new RegExp(autoFormDetailRegeMatch[0]).test(meunStr)) {
            // console.log('autoFormDetail  -  存在上级页面')
            return;
          } else {
            router.push('/404')
          }

        } else if (subPagesRegeMatch?.length > 0) {
          if (meunData.includes(mateObj[subPagesRegeMatch[0]])) {
            // console.log('子页面  -  存在上级页面')
            return;
          } else {
            router.push('/404')
          }
        } else {
          router.push('/404')
        }
      }
    }
    let meunList = sessionStorage.getItem('menuDatas') ? JSON.parse(sessionStorage.getItem('menuDatas')) : []
    if (meunList?.length > 0) {
      menuComparison(meunList)
    } else {
      dispatch({
        type: 'user/fetchCurrent',
        payload: {},
        callback: (menu) => {
          const meunArr = [];
          const meunData = (data) => {
            if (data?.length > 0) {
              data.map(item => {
                meunArr.push(item.path)
                meunData(item.children)
              })
            }
            return meunArr
          }
          meunList = meunData(menu)
          if (meunList?.length > 0) {
            menuComparison(meunList)
          }
        }
      });
    }
  }
  componentWillMount() {
    // this.menuPermissions()
  }
  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize)
    const token = Cookie.get(config.cookieName);
    const tokenFlag = token && token != 'null' && token != 'undefined' && token != '';
    const { dispatch, configInfo, sysPollutantTypeList, currentMenu } = this.props;
    if (!tokenFlag) { return }
    dispatch({
      type: 'global/getSystemConfigInfo',
      payload: {},
    });
    // console.log(currentMenu)
    dispatch({
      type: 'user/fetchCurrent',
      payload: {},
    });
    const currentUser = JSON.parse(Cookie.get('currentUser'));
    if (currentUser && currentUser.UserName != '展厅演示') {
        dispatch({
          type: 'global/getSysPollutantTypeList',
        });
     }
    dispatch({
      type: 'global/updateState',
      payload: {
        clientHeight: document.body.clientHeight,
      },
    })

    const contentElement = document.querySelector('.ant-pro-basicLayout-content');

    if (config.isShowTabs && defaultSettings.layout === 'sidemenu' && contentElement) {
      contentElement.style.margin = '8px'
    }

    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: { PointMark: '2', RegionCode: '' }
    }); //获取行政区列表

    // window._AMapSecurityConfig = {
    //   securityJsCode: 'c960e3ce0a08f155f22e676a378fc03e',
    // }
    window._AMapSecurityConfig = {
      securityJsCode: 'a74ee5d040647b0512c842cff7d76517',
    }

  }

  onWindowResize = () => {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        clientHeight: document.body.clientHeight,
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname && nextProps.unfoldMenuList.length && config.isShowTabs && defaultSettings.layout === 'sidemenu') {
      this._updatePanesAndActiveKey(nextProps)
    }

    if (nextProps.unfoldMenuList !== this.props.unfoldMenuList && config.isShowTabs && defaultSettings.layout === 'sidemenu') {
      this._updatePanesAndActiveKey(nextProps)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // 处理tab样式
    if (this.state.activeKey !== prevState.activeKey) {
      const activeElement = document.getElementsByClassName('ant-tabs-tabpane-active')[0];
      const treeElement = activeElement ? activeElement.getElementsByClassName('ant-drawer-open') : [];
      const tabElement = document.querySelector('.ant-tabs-card-bar');
      if (treeElement.length) {
        tabElement ? tabElement.style.marginRight = '320px' : undefined;
      } else {
        tabElement ? tabElement.style.marginRight = 0 : undefined;
      }
      if (document.querySelector('.ant-pro-basicLayout-content')) {
        // document.querySelector(".ant-pro-basicLayout-content").style.margin = "8px"
      }
    }
  }

  // 匹配路由
  matchCurrentPath = (props, unfoldMenuList, pathname) => {
    const { location, match: { params: { parentcode } } } = props;
    // 当前页面
    const currentPath = _.toUpper(pathname);

    const matchPathObj = unfoldMenuList.find(menu => {
      const menuPath = _.toUpper(menu.path);

      // 二级页面路由和父路由能匹配上
      if (menuPath.indexOf(currentPath) > -1) {
        return menuPath.indexOf(currentPath) > -1;
      } if (menuPath.indexOf(currentPath.split('/').pop()) > -1) {
        // 二级页面路由和父路由不能匹配上，匹配configId
        return menuPath.indexOf(currentPath.split('/').pop()) > -1;
      }
    }) || {};
    return matchPathObj
  }

  // 更新Tab
  _updatePanesAndActiveKey = props => {
    const { location, unfoldMenuList, children, history } = props;
    // console.log("_updatePanesAndActiveKey=", props)
    const _unfoldMenuList = _.cloneDeep(unfoldMenuList);

    let currentPathObj = _unfoldMenuList.find(item => {
      if (item.path) {
        return item.path.split('?')[0] === location.pathname
      }
    }) || {};


    if (!currentPathObj.name && location.pathname.indexOf('AutoFormView') > -1) {
      // AutoForm - 详情
      const pathname = location.pathname.match(/(\S*)\/AutoFormView/)[1];
      currentPathObj = this.matchCurrentPath(props, _unfoldMenuList, pathname)
      currentPathObj.name += ' - 详情'
    } else if (!currentPathObj.name && location.pathname.indexOf('autoformadd') > -1) {
      // AutoForm - 添加
      const pathname = _.toLower(location.pathname).match(/(\S*)\/autoformadd/)[1];
      currentPathObj = this.matchCurrentPath(props, _unfoldMenuList, pathname)
      currentPathObj.name += ' - 添加'
    } else if (!currentPathObj.name && _.toLower(location.pathname).indexOf('autoformedit') > -1) {
      // AutoForm - 编辑
      const pathname = _.toLower(location.pathname).match(/(\S*)\/autoformedit/)[1];
      currentPathObj = this.matchCurrentPath(props, _unfoldMenuList, pathname)
      currentPathObj.name += ' - 编辑'
    } else if (!currentPathObj.name) {
      // 从地址栏中获取tabName
      currentPathObj.name = location.query.tabName
    }

    const panes = [...this.state.panes];
    const pane = {
      key: location.pathname,
      tab: currentPathObj.name,
      content: children,
      closable: true,
    }
    if (!panes.length) {
      panes.push(pane);
    } else if (panes.filter(item => (item.key === pane.key)).length === 0) {
      panes.push(pane);
    }
    const activeKey = pane.key;
    this.setState({ panes, activeKey })
  }

  // tab切换，更改选中key及手动跳转路由
  onChange = activeKey => {
    this.setState({ activeKey });
    router.push(activeKey)
  };

  // tab - 删除
  onTabsEdit = (targetKey, action) => {
    let panes = [...this.state.panes]

    if (action === 'remove') {
      panes = panes.filter(item => item.key !== targetKey)
      this.setState({ activeKey: [...panes].pop().key, panes }, () => { router.push(this.state.activeKey) });
    }
  }

  // tab右侧更多菜单
  onClickHover = e => {
    const { key } = e; let
      { activeKey, panes } = this.state;
    if (key === '1') {
      panes = panes.filter(item => item.key !== activeKey)
      activeKey = [...panes].pop().key
      this.setState({
        panes,
        activeKey,
      }, () => {
        router.push(activeKey)
      })
    } else if (key === '2') {
      panes = panes.filter(item => item.key === activeKey)
      activeKey = [...panes].pop().key
      this.setState({
        panes,
        activeKey,
      }, () => {
        router.push(activeKey)
      })
    }
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
        menuList = currentMenu[0].children.map(item => ({
          ...item,
          NavigateUrl: `${currentMenu[0]}/${item.NavigateUrl}`,
        }))
      }
      // console.log("menuList=", menuList);
      return menuList;
    };


    const logoRender = Item => {
      // if (configInfo && configInfo.IsShowLogo === 'true') {
      //   return settings.layout === 'topmenu' ? (
      //     <img style={{ height: 60 }} src={configInfo.Logo ? `/${configInfo.Logo}` : logo} alt="logo" />
      //   ) : (
      //       <img src={`/${configInfo.Logo}`} alt="logo" />
      //     );
      // }

      return <div></div>
    };

    const menu = (
      <Menu onClick={this.onClickHover}>
        <Menu.Item key="1">关闭当前标签页</Menu.Item>
        <Menu.Item key="2">关闭其他标签页</Menu.Item>
      </Menu>
    );
    const operations = (
      <Dropdown overlay={menu} >
        <a className="ant-dropdown-link" >
          更多<DownOutlined />
        </a>
      </Dropdown>
    );

    if (loading) {
      return (<PageLoading />);
    }

    const userCookie = Cookie.get('currentUser');
    if (!userCookie) {
      router.push('/user/login');
    }
    return (
      <>
        <ProLayout
          // logo={logoRender}
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
          ]
          }
          footerRender={() => <div></div>}
          menuDataRender={menuDataRender}
          // formatMessage={formatMessage}
          rightContentRender={rightProps => <RightContent {...rightProps} />}
          {...this.props}
          {...settings}
          menuHeaderRender={() => <a href={currentMenu?.[0]?.path}> <h1>{configInfo && configInfo.SystemName}</h1></a>}
        >
          {
            config.isShowTabs && defaultSettings.layout === 'sidemenu' ? <div id="sideMenuTabsLayout" style={{ margin: '-24px -24px 0px', padding: '10px', paddingTop: 4 }}><Tabs
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
              {
                this.state.panes.map(pane => (
                  <TabPane tab={pane.tab} key={pane.key} closable={panes.length != 1}>
                    {pane.content}
                  </TabPane>
                ))
              }
            </Tabs></div> :
              (webConfig.isShowBreadcrumb ? <div id="basicLayout">{children}</div> : <div id="notBreadcrumbLayout"> {children} </div>)
          }


        </ProLayout>
        {process.env.NODE_ENV === 'development' &&
          <SettingDrawer
            settings={settings}
            onSettingChange={config =>
              dispatch({
                type: 'settings/changeSetting',
                payload: config,
              })
            }
          />
        }
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
