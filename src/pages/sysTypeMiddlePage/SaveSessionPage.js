/*
 * @Author: outman0611
 * @Date: 2024-08-06 09:36:37
 * @LastEditors: outman0611
 * @LastEditTime: 2024-11-21 15:26:12
 * @Description: 
 */

import React, { PureComponent } from 'react';
import PageLoading from '@/components/PageLoading';
import { connect } from 'dva';
import { router } from 'umi';
import Cookie from 'js-cookie';
import { getFirstChildNavigateUrl } from '@/pages/user/login/utils/utils.js';

@connect()
class SaveSessionPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let sysInfo = JSON.parse(this.props.history.location.query.sysInfo);
    sessionStorage.setItem('sysMenuId', sysInfo.ID);
    sessionStorage.setItem('sysPollutantCodes', sysInfo.CodeList);
    sessionStorage.setItem('sysName', sysInfo.Name);
    Cookie.set('sysMenuId', sysInfo.ID);
    Cookie.set("sysName", sysInfo.Name);
    this.getMenuList(sysInfo.ID);
  }

  // 获取菜单
  getMenuList = menuId => {
    let sysInfo = JSON.parse(this.props.history.location.query.sysInfo);
    this.props.dispatch({
      type: 'user/fetchCurrent',
      payload: {
        menu_id: menuId,
      },
      callback: response => {
        let defaultNavigateUrl =
            response.Datas[0].children?.[0]?.children?.[0]
            ? response.Datas[0].children[0].children[0].NavigateUrl
            : response.Datas[0].children && response.Datas[0].children.length
            ? response.Datas[0].children[0].NavigateUrl
            : response.Datas[0].NavigateUrl;

        let systemNavigateUrl = getFirstChildNavigateUrl(response.Datas[0]);
        Cookie.set('systemNavigateUrl', systemNavigateUrl);

        let sysName = sessionStorage.getItem('sysName');
        // if (sysName === "一厂一档管理系统") {
        if (sysName === '一企一档管理系统') {
          if (sysInfo.EntCode && sysInfo.EntName) {
            sessionStorage.setItem('oneEntCode', sysInfo.EntCode);
            sessionStorage.setItem('oneEntName', sysInfo.EntName);
            sessionStorage.setItem('defaultNavigateUrl', defaultNavigateUrl);
            router.push(defaultNavigateUrl);
          } else {
            sessionStorage.setItem('defaultNavigateUrl', '/oneEntsOneArchives/entList');
            router.push('/oneEntsOneArchives/entList');
          }
        } else {
          const meunArr = [];
          const meunData = data => {
            if (data?.length > 0) {
              data.map(item => {
                meunArr.push(item.path);
                meunData(item.children);
              });
            }
            return meunArr;
          };
          const meunList = meunData(response?.Datas);
          sessionStorage.setItem('menuDatas', meunList?.length > 0 ? JSON.stringify(meunList) : '');
          sessionStorage.setItem('defaultNavigateUrl', defaultNavigateUrl)
          router.push(defaultNavigateUrl)
        }
      },
    });
  };

  render() {
    return <PageLoading />;
  }
}

export default SaveSessionPage;
