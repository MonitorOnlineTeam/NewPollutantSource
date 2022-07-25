import React, { Component } from 'react';
import {
  Row,
} from 'antd';
import styles from './ControlCabinLayout.less';
import { router } from 'umi';

const menuData = [
  {
    url: '/ControlCabin/Monitoring',
    name: '监控中心',
    title: '污染源自动监控中心'
  },
  {
    url: '/ControlCabin/QualityControl',
    name: '质控中心',
    title: '污染源自动质控中心'
  },
  {
    url: '/ControlCabin/operations',
    name: '运维中心',
    title: '污染源自动运维中心'
  },
  {
    url: '/ControlCabin/authorization',
    name: '授权中心',
    title: '污染源授权中心'
  },
]

class ControlCabinLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '污染源自动监控中心'
    };

  }

  onMenuClick = (index) => {
    this.setState({
      title: menuData[index].title
    })
    router.push(menuData[index].url)
  }

  render() {
    const { location: { pathname } } = this.props;
    const { title } = this.state;
    console.log('location=', location);
    return (
      <div className={styles.homeWrapper}>
        <header className={styles.homeHeader}>
          <div>
            <img className={styles.headerImg} src="/ProjectSummary/top.png" alt="" />
            <div className={styles['left-button']}>

              <span onClick={() => this.onMenuClick(0)} className={pathname === menuData[0].url ? styles.active : ''}>监控中心</span>
              <span onClick={() => this.onMenuClick(1)} className={pathname === menuData[1].url ? styles.active : ''}>质控中心</span>
            </div>
            <div className={styles['right-button']}>
              <span onClick={() => this.onMenuClick(2)} className={pathname === menuData[2].url ? styles.active : ''}>运维中心</span>
              <span onClick={() => this.onMenuClick(3)} className={pathname === menuData[3].url ? styles.active : ''}>授权中心</span>
            </div>
            <p>{title}</p>
          </div>
        </header>
        <Row gutter={16} className={styles.homeContainer}>
          {this.props.children}
        </Row>
      </div>
    );
  }
}
export default ControlCabinLayout;
