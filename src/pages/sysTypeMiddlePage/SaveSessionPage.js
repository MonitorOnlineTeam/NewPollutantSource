import React, { PureComponent } from 'react'
import PageLoading from '@/components/PageLoading'
import { connect } from 'dva'
import { router } from 'umi'
import Cookie from 'js-cookie';

@connect()
class SaveSessionPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let sysInfo = JSON.parse(this.props.history.location.query.sysInfo)
    sessionStorage.setItem("sysMenuId", sysInfo.ID);
    sessionStorage.setItem("sysPollutantCodes", sysInfo.CodeList);
    sessionStorage.setItem("sysName", sysInfo.Name);
    this.getMenuList(sysInfo.ID);
  }

  // 获取菜单
  getMenuList = (menuId) => {
    let sysInfo = JSON.parse(this.props.history.location.query.sysInfo)
    this.props.dispatch({
      type: 'user/fetchCurrent',
      payload: {
        menu_id: menuId
      },
      callback: (response) => {
        let defaultNavigateUrl = response.Datas[0].children && response.Datas[0].children.length ? response.Datas[0].children[0].NavigateUrl : response.Datas[0].NavigateUrl;
        let systemNavigateUrl = '';
        if (response.Datas && response.Datas.length > 1) {
          if (response.Datas[0].name === "首页") {
            systemNavigateUrl = response.Datas[1].NavigateUrl;
          } else {
            if (response.Datas[0].children.length) {
              systemNavigateUrl = response.Datas[0].children[0].NavigateUrl;
            } else {
              systemNavigateUrl = response.Datas[1].NavigateUrl;
            }
          }
        }
        Cookie.set('systemNavigateUrl', systemNavigateUrl);

        let sysName = sessionStorage.getItem("sysName")
        // if (sysName === "一厂一档管理系统") {
        if (sysName === "一企一档管理系统") {
          if (sysInfo.EntCode && sysInfo.EntName) {
            sessionStorage.setItem("oneEntCode", sysInfo.EntCode)
            sessionStorage.setItem("oneEntName", sysInfo.EntName)
            sessionStorage.setItem('defaultNavigateUrl', defaultNavigateUrl)
            router.push(defaultNavigateUrl)
          } else {
            sessionStorage.setItem('defaultNavigateUrl', '/oneEntsOneArchives/entList')
            router.push('/oneEntsOneArchives/entList')
          }
        } else {
          sessionStorage.setItem('defaultNavigateUrl', defaultNavigateUrl)
          router.push(defaultNavigateUrl)
        }

      }
    });
  }



  render() {
    return (
      <PageLoading />
    );
  }
}

export default SaveSessionPage;
