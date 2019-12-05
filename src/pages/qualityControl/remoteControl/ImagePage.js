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
  standardValueUtin: qualityControl.standardValueUtin,
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
    const { gasData, cemsList, valveStatus, standardValueUtin, p1Pressure, p2Pressure, flowList, standardValue, qualityControlName } = this.props;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <MapInteractionCSS style={{ position: 'relative' }}>
          {/* <div style={{ width: '100%', height: '100%' }}> */}
          <img src="/qualityControl/lct.jpg" />
          {/* O2 */}
          <div className={styles.gasInfoBox}>
            <ul>
              <li>
                浓度：{gasData.O2Info.Concentration != undefined && `${gasData.O2Info.Concentration}%`}
              </li>
              <li>
                <span>过期时间：</span>
                <span className={styles.time} title={gasData.O2Info.ExpirationDate}>{gasData.O2Info.ExpirationDate}</span>
              </li>
              <li>
                余量：{gasData.O2Info.VolumeValue != undefined ? `${gasData.O2Info.VolumeValue} L` : undefined}
              </li>
              <li>
                流量：{flowList["s01"] != undefined ? `${flowList["s01"]} ml/min` : undefined}
              </li>
            </ul>
          </div>
          {
            (p1Pressure.pollutantCode == "s01" && p1Pressure.isException == "1") ?
              <div className={styles.gasImgBox}>
                <img src="/qualityControl/gasException.png" alt="" />
                <p>O₂</p>
              </div> : null
          }

          <img className={styles.valve} src="/qualityControl/valveClose.jpg" alt="" />
          {valveStatus.O2 ?
            <>
              <img className={styles.line} src="/qualityControl/O2.png" alt="" />
              <img className={styles.valve} src="/qualityControl/valveOpen.jpg" alt="" />
            </> : null
          }

          {/* NOx */}
          <div className={styles.gasInfoBox} style={{ top: "calc(63px + (121px + 30px) * 1" }}>
            <ul>
              <li>
                浓度：{gasData.NOxInfo.Concentration != undefined ? `${gasData.NOxInfo.Concentration} mg/m3` : undefined}
              </li>
              <li>
                <span>过期时间：</span>
                <span className={styles.time} title={gasData.NOxInfo.ExpirationDate}>{gasData.NOxInfo.ExpirationDate}</span>
              </li>
              <li>
                余量：{gasData.NOxInfo.VolumeValue != undefined ? `${gasData.NOxInfo.VolumeValue} L` : undefined}
              </li>
              <li>
                流量：{flowList["03"] != undefined ? `${flowList["03"]} ml/min` : undefined}
              </li>
            </ul>
          </div>
          {
            (p1Pressure.pollutantCode == "03" && p1Pressure.isException == "1") ?
              <div className={styles.gasImgBox} style={{ top: "calc(86px +  152px)" }}>
                <img src="/qualityControl/gasException.png" alt="" />
                <p style={{ fontSize: 15, left: 1 }}>NOx</p>
              </div> : null
          }

          <img className={styles.valve} style={{ top: "calc(90px + 130px + 30px)" }} src="/qualityControl/valveClose.jpg" alt="" />
          {valveStatus.NOx ?
            <>
              <img className={styles.line} src="/qualityControl/NOx.png" alt="" />
              <img className={styles.valve} style={{ top: "calc(90px + 130px + 30px)" }} src="/qualityControl/valveOpen.jpg" alt="" />
            </> : null
          }

          {/* SO2 */}
          <div className={styles.gasInfoBox} style={{ top: "calc(63px + (121px + 30px) *2)" }}>
            <ul>
              <li>
                浓度：{gasData.SO2Info.Concentration !== undefined ? `${gasData.SO2Info.Concentration} mg/m3` : undefined}
              </li>
              <li>
                <span>过期时间：</span>
                <span className={styles.time} title={gasData.SO2Info.ExpirationDate}>{gasData.SO2Info.ExpirationDate}</span>
              </li>
              <li>
                余量：{gasData.SO2Info.VolumeValue != undefined ? `${gasData.SO2Info.VolumeValue} L` : undefined}
              </li>
              <li>
                流量：{flowList["02"] != undefined ? `${flowList["02"]} ml/min` : undefined}
              </li>
            </ul>
          </div>
          {
            (p1Pressure.pollutantCode == "02" && p1Pressure.isException == "1") ?
              <div className={styles.gasImgBox} style={{ top: "calc(86px +  152px * 2)" }}>
                <img src="/qualityControl/gasException.png" alt="" />
                <p style={{ fontSize: 15, left: 2 }}>SO₂</p>
              </div> : null
          }
          <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px)* 2)" }} src="/qualityControl/valveClose.jpg" alt="" />
          {valveStatus.SO2 ?
            <>
              <img className={styles.line} src="/qualityControl/SO2.png" alt="" />
              <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px) * 2)" }} src="/qualityControl/valveOpen.jpg" alt="" />
            </> : null
          }
          {/* N2 */}
          <div className={styles.gasInfoBox} style={{ top: "calc(63px + (121px + 30px) *3)" }}>
            <ul>
              <li>
                浓度：{gasData.N2Info.Concentration}
              </li>
              <li>
                <span>过期时间：</span>
                <span className={styles.time} title={gasData.N2Info.ExpirationDate}>{gasData.N2Info.ExpirationDate}</span>
              </li>
              <li>
                余量：{gasData.N2Info.VolumeValue != undefined ? `${gasData.N2Info.VolumeValue} L` : undefined}
              </li>
              <li>
                流量：{flowList["065"] != undefined ? `${flowList["065"]} ml/min` : undefined}
              </li>
            </ul>
          </div>
          {
            (p2Pressure.pollutantCode == "065" && p2Pressure.isException == "1") ?
              <div className={styles.gasImgBox} style={{ top: "calc(86px +  152px * 3)" }}>
                <img src="/qualityControl/gasException.png" alt="" />
                <p>N₂</p>
              </div> : null
          }
          <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px)* 3)" }} src="/qualityControl/valveClose.jpg" alt="" />
          {valveStatus.N2 ?
            <>
              <img className={styles.line} src="/qualityControl/N2.png" alt="" />
              <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px) * 3)" }} src="/qualityControl/valveOpen.jpg" alt="" />
            </> : null
          }
          {/* 吹扫 */}
          <img className={styles.valve} style={{ top: "496px", left: "384px" }} src="/qualityControl/valveClose2.jpg" alt="" />
          {
            !!valveStatus.purge ? <>
              <img className={styles.line} src="/qualityControl/purge.png" alt="" />
              <img className={styles.valve} style={{ top: "496px", left: "384px" }} src="/qualityControl/valveOpen2.jpg" alt="" />
            </> : null
          }

          {/* CEMS */}
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
              let lineSrc = `/qualityControl/CEMS${index + 1}.png`
              // if (item.MNHall !== undefined) {
              return <>
                <div className={styles.CEMSInfoBox} style={{ top: `calc(232px + 112px * ${index})` }}>
                  <div className={styles.CEMSName}>
                    {
                      <>
                        {item.CemsName ?
                          <p title={item.CemsName}>{item.CemsName}</p>
                          : "未连接"} <br />
                        CEMS
                      </>
                    }
                  </div>
                  {/* CEMS状态: 1.离线 2.异常 0.正常 */}
                  {item.isException == 1 ? <img className={styles.CEMSImg} src="/qualityControl/cemsStatus1.png" alt="" /> : null}
                  {item.isException == 2 ? <img className={styles.CEMSImg} src="/qualityControl/cemsStatus2.png" alt="" /> : null}
                  {(item.isException == undefined && !item.CemsName) && <img className={styles.CEMSImg} src="/qualityControl/cemsStatus1.png" alt="" />}

                  <div className={styles.concentration}>
                    {
                      item.monitorValue != undefined ?
                        <>
                          <p>浓度</p>
                          <span>{item.monitorValue} {standardValueUtin}</span>
                        </> : null
                    }
                  </div>
                </div>
                <img src="/qualityControl/valveClose.jpg" className={styles.CEMSvalve} style={{ top: top }} alt="" />
                {
                  item.valve === "1" ?
                    <>
                      <img className={styles.CEMSLine} src={lineSrc} />
                      <img className={styles.CEMSvalve} style={{ top: top }} src="/qualityControl/valveOpen.jpg" alt="" />
                    </> : undefined
                }
              </>
              // }
              // return <img src="/qualityControl/valveClose.jpg" className={styles.CEMSvalve} style={{ top: top }} alt="" />
            })
          }

          {/* 压力p1 */}
          <div className={styles.pressure}>
            {p1Pressure.value != undefined ? `${p1Pressure.value}MPa` : undefined}
          </div>
          {
            p1Pressure.isException ? <img className={styles.exceptionPressure} src="p1Exception.png" /> : null
          }
          {/* 压力p2 */}
          <div className={styles.pressure} style={{ top: 518 }}>
            {p2Pressure.value != undefined ? `${p2Pressure.value}MPa` : undefined}
          </div>
          {
            p2Pressure.isException ? <img className={styles.exceptionPressure} style={{ top: 568 }} src="p2Exception.png" /> : null
          }
          {/* 质控仪 */}
          <div className={styles.qualityControl}>
            {
              // 开门状态
              valveStatus.door == "0" ? <img className={styles.doorOpen} src="/qualityControl/doorOpen.png" alt="" /> : null
            }
            <div className={styles.title}>
              {qualityControlName}
            </div>
            {/* 标气浓度 */}
            <div className={styles.gasConcentration}>
              <p>标气浓度</p>
              <span>{standardValue} {standardValueUtin}</span>
            </div>
          </div>
        </MapInteractionCSS>
      </div>
    );
  }
}

export default ImagePage;

