import React, { PureComponent } from 'react'
import PageLoading from '@/components/PageLoading'
import { connect } from 'dva'
import { router } from 'umi'

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
    this.props.dispatch({
      type: 'user/fetchCurrent',
      payload: {
        menu_id: menuId
      },
      callback: (response) => {
        let defaultNavigateUrl = response.Datas[0].children && response.Datas[0].children.length ? response.Datas[0].children[0].NavigateUrl : response.Datas[0].NavigateUrl;
        let sysName = sessionStorage.getItem("sysName")
          if( sysName === "一企一档管理系统" ){
            sessionStorage.setItem('defaultNavigateUrl', '/oneEntsOneArchives/entList')
            router.push('/oneEntsOneArchives/entList')
          }else{
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