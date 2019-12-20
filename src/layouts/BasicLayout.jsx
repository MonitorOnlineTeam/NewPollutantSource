/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
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
import PageLoading from '@/components/PageLoading'
/**
 * use Authorized check all menu item
 */

// const menuDataRender = menuList => {
//   console.log("user.currentMenu=", menuList);
//   return [
//     {
//       "path": "/dashboard",
//       "name": "dashboard",
//       "icon": "dashboard",
//       "id": 1,
//       "children": [
//         {
//           "path": "/dashboard/analysis",
//           "name": "analysis",
//           "exact": true,
//           "id": 2,
//         },
//         {
//           "path": "/dashboard/monitor",
//           "name": "monitor",
//           "exact": true
//         },
//         {
//           "path": "/dashboard/workplace",
//           "name": "workplace",
//           "exact": true
//         }
//       ]
//     }
//   ];
// }
// menuList.map(item => {
//   const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
//   return Authorized.check(item.authority, localItem, null);
// });

const footerRender = (_, defaultDom) => {
  if (!isAntDesignPro()) {
    return defaultDom;
  }

  return (
    <>
      {defaultDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const BasicLayout = props => {
  const { dispatch, children, settings, currentMenu, configInfo, loading } = props;
  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'global/getSystemConfigInfo',
        payload: {},
      });
      dispatch({
        type: 'user/fetchCurrent',
        payload: {},
      });
      // dispatch({
      //   type: 'settings/getSetting',
      // });

    }
  }, []);
  /**
   * init variables
   */

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
    // console.log("menuList=", menuList);
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

  // const pageTitleRender = e => {
  //   if (configInfo) {
  //     e.settings.title = configInfo.SystemName
  //     e.title = configInfo.SystemName
  //     return e;
  //   }
  // }
  // const myStyle = {};
  if (loading) {
    return (<PageLoading />);
  }

  let userCookie = Cookie.get('currentUser');
  if (!userCookie) {
    router.push("/user/login");
  }
  return (
    <>
      <ProLayout
        logo={logoRender}
        // pageTitleRender={pageTitleRender}
        // headerRender={(e)=>{
        //   console.log('eee=',e)
        // }}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          // console.log("menuItemProps=", menuItemProps)
          // console.log("defaultDom=", defaultDom)

          // let userCookie = Cookie.get('currentUser');
          if (menuItemProps.replace && userCookie !== "null") {
            dispatch({
              type: 'global/getBtnAuthority',
              payload: {
                Menu_ID: menuItemProps.id,
                User_ID: JSON.parse(userCookie).User_ID,
              },
            });
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
        formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...props}
        {...settings}
      >
        <div style={{ margin: '-24px -24px 0px', padding: '24px 24px 0 24px', overflowY: 'auto' }}>
          {children}
        </div>
      </ProLayout>
      {process.env.NODE_ENV === "development" &&
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
};

export default connect(({ global, settings, user, loading }) => ({
  collapsed: global.collapsed,
  changePwdVisible: global.changePwdVisible,
  settings,
  currentMenu: user.currentMenu,
  configInfo: global.configInfo,
  loading: loading.effects["global/getSystemConfigInfo"],
}))(BasicLayout);
