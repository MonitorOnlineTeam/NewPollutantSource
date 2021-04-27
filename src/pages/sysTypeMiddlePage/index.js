import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Card, Row, Col } from 'antd'
import styles from './index.less'
import Cookie from 'js-cookie'

@connect(({ global }) => ({
  sysPollutantTypeList: global.sysPollutantTypeList,
  configInfo: global.configInfo,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getSysPollutantTypeList();
  }

  // 获取系统的污染物类型
  getSysPollutantTypeList = () => {
    this.props.dispatch({
      type: 'global/getSysPollutantTypeList',
    })
  }


  onSysItemClick = (item) => {
    console.log('item=', item)
    window.open(`/sessionMiddlePage?sysInfo=${JSON.stringify(item)}`)
  }

  onLoglout = () => {
    this.props.dispatch({
      type: "login/logout",
    })
  }

  render() {
    const { sysPollutantTypeList, configInfo } = this.props;
    let currentUser = Cookie.get('currentUser');
    let userName = JSON.parse(currentUser).UserName;
    return (
      <div className={styles.middleContainer}>
        <header className={styles.header}>
          <div className={styles.left}>
            <img src={`/upload/${configInfo.Logo}`} alt="" />
            <span>污染源综合监控平台</span>
          </div>
          <div className={styles.right}>
            <span>{userName}</span>
            <span style={{ margin: '0 10px' }}>|</span>
            <span style={{ cursor: 'pointer' }} onClick={this.onLoglout}>退出</span>
          </div>
        </header>
        <div className={styles.pageContainer}>
          <div className={styles.cardListContainer}>
            {/* <Row gutter={[32, 32]} style={{ width: '100%' }}> */}
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              {
                sysPollutantTypeList.map((item, index) => {
                  return (
                    <Col className="gutter-row" span={6} onClick={() => this.onSysItemClick(item)}>
                      <div className={styles.itemContent} >
                        <img src={`/middlePage/${item.Name}.png`} alt="" />
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
