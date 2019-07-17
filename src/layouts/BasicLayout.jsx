/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro } from '@/utils/utils';
import logo from '../../public/sdlicon.png';
import Item from 'antd/lib/list/Item';
import styles from './BasicLayout.less';
import Cookie from 'js-cookie';
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
  const { dispatch, children, settings, currentMenu } = props;
  ;
  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
        payload: {}
      });
      dispatch({
        type: 'settings/getSetting',
      });
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
    // console.log("user.currentMenu=", currentMenu);
    return currentMenu;
  }

  const logoRender = Item => {

    return settings.layout === "topmenu" ? <img style={{ height: 60 }} src={logo} alt="logo" /> : <img src={logo} alt="logo" />;
  }
  const myStyle = {

  };
  return (
    <>
      <ProLayout
        logo={logoRender}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          // console.log("menuItemProps=", menuItemProps)
          // console.log("defaultDom=", defaultDom)
          let userCookie = Cookie.get('token');
          if (menuItemProps.replace && userCookie) {
            dispatch({
              type: "global/getBtnAuthority",
              payload: {
                Menu_ID: menuItemProps.id,
                User_ID: JSON.parse(userCookie).User_ID
              }
            })
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
          return <div></div>
        }}
        menuDataRender={menuDataRender}
        formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...props}
        {...settings}
      >
        {children}
      </ProLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={config =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </>
  );
};

export default connect(({ global, settings, user }) => ({
  collapsed: global.collapsed,
  settings,
  currentMenu: user.currentMenu
}))(BasicLayout);
