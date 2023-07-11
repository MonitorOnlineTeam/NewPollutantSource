import React, { Component } from 'react';
import { connect } from 'dva';
import styles from '../index.less';
import ReactSeamlessScroll from 'react-seamless-scroll';
@connect(({ loading, hometangy }) => ({
  environmentalpoints: hometangy.environmentalpoints,
}))
class Commonpoints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: window.screen.width === 1600 ? 50 : 70,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 治理设备情况
    dispatch({
      type: "hometangy/getEnvironmentalpoints",
      payload: {
        entcode: 'd7891158-f43e-43b5-805c-ad11db586f6f',
        type: 0
      }
    });
  }

  render() {
    const { environmentalpoints } = this.props;
    let bgcolor = 1;
    return <>
      <div className={styles.title}>
        <p>环保点位</p>
      </div>
      <div>
        <div className={styles['pointtabletitle']}>
          <span className={styles['title1']}>环保点位</span>
          <span className={styles['title2']}>排放标准</span>
          <span className={styles['title3']}>监测值</span>
          <div className={styles['clearboth']}></div>
        </div>
        <div id={styles['scrolldocker']}>
          {
            environmentalpoints.length ?
              <ReactSeamlessScroll speed={40} style={{ width: '100%', height: '100%' }}>
                {
                  environmentalpoints.map(item => {
                    bgcolor = bgcolor + 1;
                    return <div className={styles['pointtablecon']} style={{ backgroundColor: bgcolor % 2 == 0 ? '#102146' : '#0D1C3C' }}>
                      <span className={styles['con1']}>{item.BranchFactoryName + item.PointName} {item.PollutantName}</span>
                      <span className={styles['con2']}>{item.StandardValue}</span>
                      <span className={styles['con3']} style={{ color: item.IsOver == 1 ? 'red' : '#ccc' }}>{item.MonitoValue}</span>
                      <div className={styles['clearboth']}></div>
                    </div>
                  })
                }
              </ReactSeamlessScroll> :
              <div className={styles.notData}>
                <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
                <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
              </div>
          }
        </div>
      </div>
    </>;
  }
}

export default Commonpoints;