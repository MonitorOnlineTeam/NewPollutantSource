import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Card, Row, Col } from 'antd'
import styles from './index.less'
import Cookie from 'js-cookie'
import webConfig from '../../../public/webConfig'
import PageLoading from '@/components/PageLoading'
import { router } from 'umi'

@connect(({ global }) => ({
  sysPollutantTypeList: global.sysPollutantTypeList,
  configInfo: global.configInfo,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    let currentUser = Cookie.get('currentUser');
    if (currentUser == 'null') {
      router.push('/user/login');
      return;
    }
    this.getSysPollutantTypeList();
  }

  // 获取系统的污染物类型
  getSysPollutantTypeList = () => {
    this.props.dispatch({
      type: 'global/getSysPollutantTypeList',
    }).then(() => {
      // // 如果中间页只有一个菜单，直接进入该菜单
      // if (this.props.sysPollutantTypeList.length === 1) {
      //   sessionStorage.setItem("isShowSelectSystem", 0);
      //   this.onSysItemClick(this.props.sysPollutantTypeList[0])
      // } else {
      //   sessionStorage.setItem("isShowSelectSystem", 1);
      //   this.setState({ loading: false });
      // }
      sessionStorage.setItem("isShowSelectSystem", 1);
      this.props.sysPollutantTypeList?.[0]&&this.onSysItemClick(this.props.sysPollutantTypeList[0])
    })
  }


  onSysItemClick = (item) => {
    let url = item.Url ? new URL(item.Url) : item.Url;
    if (url && (url.protocol === 'http:' || url.protocol === 'https:')) {
      if (webConfig.middlePageOpenMode === 'single') {
        window.location.href = url.href;
      } else {
        window.open(url);
      }
    } else {
      if (webConfig.middlePageOpenMode === 'single') {
        router.push(`/sessionMiddlePage?sysInfo=${JSON.stringify(item)}`)
      } else {
        window.open(`/sessionMiddlePage?sysInfo=${JSON.stringify(item)}`)
      }
    }
  }

  onLoglout = () => {
    this.props.dispatch({
      type: "login/logout",
    })
  }

  render() {
    const { sysPollutantTypeList, configInfo } = this.props;
    let currentUser = Cookie.get('currentUser');
    let userName = (currentUser != undefined && currentUser != 'null') ? JSON.parse(currentUser).UserName : '';
    const bgImageType = configInfo.LAMImgType;
    const bgImageUrl = bgImageType ? `url('/bgImage/${bgImageType}/middlePage_bg.jpg')` : `url('/middlePage/bg.jpg')`;
    if (this.state.loading) {
      return <PageLoading />;
    }

    return (
      <div className={styles.middleContainer}>
        <header className={styles.header}>
          <div className={styles.left}>
            <img src={`${configInfo.Logo}`} alt="" />
            <span>{configInfo.SystemName}</span>
          </div>
          <div className={styles.right}>
            <span>{userName}</span>
            <span style={{ margin: '0 10px' }}>|</span>
            <span style={{ cursor: 'pointer' }} onClick={this.onLoglout}>退出</span>
          </div>
        </header>
        <div className={styles.pageContainer} style={{ backgroundImage: bgImageUrl }}>
          <div className={styles.cardListContainer}>
            {/* <Row gutter={[32, 32]} style={{ width: '100%' }}> */}
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              {
                sysPollutantTypeList.map((item, index) => {
                  return (
                    <Col className="gutter-row" span={6} onClick={() => this.onSysItemClick(item)}>
                      <div className={styles.itemContent} >
                        <img src={`/middlePage/${item.MenuImg}.png`} alt="" />
                        <span className={styles.sysName}>
                          {item.Name}
                        </span>
                      </div>
                    </Col>
                  )
                  // return <div className={styles.cardItem} onClick={() => this.onSysItemClick(item)} bordered={false}>
                  //   <div className={styles.itemContent}>
                  //     <img src={`/middlePage/${index + 1}.png`} alt="" />
                  //     <span className={styles.sysName}>
                  //       {item.Name}
                  //     </span>
                  //   </div>
                  // </div>
                })
              }
            </Row>
          </div>
        </div >
      </div >
    );
  }
}

export default index;
