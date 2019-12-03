import React, { PureComponent } from 'react';
import { Button, Card } from 'antd'
import router from 'umi/router';
import { MapInteractionCSS } from 'react-map-interaction';
import styles from './index.less'
import { connect } from 'dva';

@connect(({ loading, qualityControl }) => ({
  gasData: qualityControl.gasData,
  cemsList: qualityControl.cemsList,
  valveStatus: qualityControl.valveStatus,
  p2Pressure: qualityControl.p2Pressure,
  p1Pressure: qualityControl.p1Pressure,
  flowList: qualityControl.flowList,
  standardValue: qualityControl.standardValue,
  qualityControlName: qualityControl.qualityControlName,
}))

class ImagePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      QCAMN: props.QCAMN
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: "qualityControl/getCemsAndStandGasState",
      payload: {
        QCAMN: this.state.QCAMN
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.QCAMN !== nextProps.QCAMN) {
      this.setState({
        QCAMN: nextProps.QCAMN
      })
      this.props.dispatch({
        type: "qualityControl/getCemsAndStandGasState",
        payload: {
          QCAMN: nextProps.QCAMN
        }
      })
    }
  }

  render() {
    const { gasData, cemsList, valveStatus, p1Pressure, p2Pressure, flowList, standardValue, qualityControlName } = this.props;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <MapInteractionCSS style={{ position: 'relative' }}>
          {/* <div style={{ width: '100%', height: '100%' }}> */}
          <img src="/qualityControl/lct.jpg" />
          {/* O2 */}
          <div className={styles.gasInfoBox}>
            <ul>
              <li>
                浓度：{gasData.O2Info.Concentration}
              </li>
              <li>
                过期时间：{gasData.O2Info.ExpirationDate}
              </li>
              <li>
                余量：{gasData.O2Info.VolumeValue}
              </li>
              <li>
                流量：{flowList["s01"]}
              </li>
            </ul>
            {/* <img className={styles.gasImg} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="" /> */}
          </div>
          <img className={styles.valve} src="/qualityControl/valveClose.jpg" alt="" />
          {valveStatus.O2 &&
            <>
              <img className={styles.line} src="/qualityControl/O2.png" alt="" />
              <img className={styles.valve} src="/qualityControl/valveOpen.jpg" alt="" />
            </>
          }

          {/* NOx */}
          <div className={styles.gasInfoBox} style={{ top: "calc(63px + (121px + 30px) * 1" }}>
            <ul>
              <li>
                浓度：{gasData.NOxInfo.Concentration}
              </li>
              <li>
                过期时间：{gasData.NOxInfo.ExpirationDate}
              </li>
              <li>
                余量：{gasData.NOxInfo.VolumeValue}
              </li>
              <li>
                流量：{flowList["03"]}
              </li>
            </ul>
          </div>
          <img className={styles.valve} style={{ top: "calc(90px + 130px + 30px)" }} src="/qualityControl/valveClose.jpg" alt="" />
          {valveStatus.NOx &&
            <>
              <img className={styles.line} src="/qualityControl/NOx.png" alt="" />
              <img className={styles.valve} style={{ top: "calc(90px + 130px + 30px)" }} src="/qualityControl/valveOpen.jpg" alt="" />
            </>
          }

          {/* SO2 */}
          <div className={styles.gasInfoBox} style={{ top: "calc(63px + (121px + 30px) *2)" }}>
            <ul>
              <li>
                浓度：{gasData.SO2Info.Concentration}
              </li>
              <li>
                过期时间：{gasData.SO2Info.ExpirationDate}
              </li>
              <li>
                余量：{gasData.SO2Info.VolumeValue}
              </li>
              <li>
                流量：{flowList["02"]}
              </li>
            </ul>
          </div>
          <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px)* 2)" }} src="/qualityControl/valveClose.jpg" alt="" />
          {valveStatus.SO2 &&
            <>
              <img className={styles.line} src="/qualityControl/SO2.png" alt="" />
              <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px) * 2)" }} src="/qualityControl/valveOpen.jpg" alt="" />
            </>
          }

          {/* N2 */}
          <div className={styles.gasInfoBox} style={{ top: "calc(63px + (121px + 30px) *3)" }}>
            <ul>
              <li>
                浓度：{gasData.N2Info.Concentration}
              </li>
              <li>
                过期时间：{gasData.N2Info.ExpirationDate}
              </li>
              <li>
                余量：{gasData.N2Info.VolumeValue}
              </li>
              <li>
                流量：{flowList["065"]}
              </li>
            </ul>
          </div>
          <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px)* 3)" }} src="/qualityControl/valveClose.jpg" alt="" />
          {valveStatus.N2 &&
            <>
              <img className={styles.line} src="/qualityControl/N2.png" alt="" />
              <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px) * 3)" }} src="/qualityControl/valveOpen.jpg" alt="" />
            </>
          }
          {/* 吹扫 */}
          <img className={styles.valve} style={{ top: "496px", left: "384px" }} src="/qualityControl/valveClose2.jpg" alt="" />
          {
            valveStatus.purge && <>
              <img className={styles.line} src="/qualityControl/purge.png" alt="" />
              <img className={styles.valve} style={{ top: "496px", left: "384px" }} src="/qualityControl/valveOpen2.jpg" alt="" />
            </>
          }

          {/* CEMS */}
          {
            console.log("cemsList-", cemsList)
          }
          {
            cemsList.map((item, index) => {
              let top = 0;
              if (index === 0) {
                top = 245;
              }
              if (index === 1) {
                top = 358;
              }
              if (index === 2) {
                top = 468;
              }
              if (index === 3) {
                top = 586;
              }
              console.log("CEMSStatus=", item.isException)
              // if (item.MNHall !== undefined) {
              return <>
                <div className={styles.CEMSInfoBox} style={{ top: `calc(232px + 112px * ${index})` }}>
                  <div className={styles.CEMSName}>
                    {
                      item.CemsName &&
                      <>
                        {item.CemsName} <br />
                        CEMS
                      </>
                    }
                  </div>
                  {/* CEMS状态: 1.离线 2.异常 0.正常 */}
                  {item.isException == 1 && <img className={styles.CEMSImg} src="/qualityControl/cemsStatus1.png" alt="" />}
                  {item.isException == 2 && <img className={styles.CEMSImg} src="/qualityControl/cemsStatus2.png" alt="" />}
                  <div className={styles.concentration}>
                    <p>浓度</p>
                    <span></span>
                  </div>
                </div>
                <img src="/qualityControl/valveClose.jpg" className={styles.CEMSvalve} style={{ top: top }} alt="" />
                {
                  item.valve &&
                  <>
                    <img className={styles.CEMSLine} src="/qualityControl/CEMS1.png" />
                    <img className={styles.CEMSvalve} style={{ top: top }} src="/qualityControl/valveOpen.jpg" alt="" />
                  </>
                }
              </>
              // }
              // return <img src="/qualityControl/valveClose.jpg" className={styles.CEMSvalve} style={{ top: top }} alt="" />
            })
          }

          {/* 压力p1 */}
          <div className={styles.pressure}>
            {p1Pressure.value}
          </div>
          {
            p1Pressure.isException && <img className={styles.exceptionPressure} src="p1Exception.png" />
          }
          {/* 压力p2 */}
          <div className={styles.pressure} style={{ top: 518 }}>
            {p2Pressure.value}
          </div>
          {
            p2Pressure.isException && <img className={styles.exceptionPressure} style={{ top: 568 }} src="p2Exception.png" />
          }
          {/* 质控仪 */}
          <div className={styles.qualityControl}>
            {
              // 开门状态
              valveStatus.door === "0" && <img className={styles.doorOpen} src="/qualityControl/doorOpen.png" alt="" />
            }
            <div className={styles.title}>
              {qualityControlName}
            </div>
            {/* 标气浓度 */}
            <div className={styles.gasConcentration}>
              <p>标气浓度</p>
              <span>{standardValue}</span>
            </div>
          </div>
        </MapInteractionCSS>
      </div>
    );
  }
}

export default ImagePage;

