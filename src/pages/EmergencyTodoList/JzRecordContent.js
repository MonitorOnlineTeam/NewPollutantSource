/*
 * @Author: lzp
 * @Date: 2019-08-22 09:36:43
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:30:48
 * @Description: cems零点量程漂移与校准记录表
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MonitorContent from '../../components/MonitorContent/index';
import styles from "./JzRecordContent.less";
import moment from 'moment'
//import * as fstream from 'fstream';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetJzRecord'],
    JzRecord: task.JzRecord
}))
class JzRecordContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetJzRecord',
            payload: {
                TaskID: this.props.TaskID
            }
        });
    }

    renderItem = (Record, code) => {
        const rtnVal = [];
        if (code != null && code.length > 0) {
            if (Record != null && Record.length > 0) {
                code.map((item, key) => {
                    let rd = Record.filter((item1) => item1.ItemID === item);
                    if (rd) {
                        rtnVal.push(<table key={key} className={styles.FormTable}>
                            <tbody>
                                <tr>
                                    <td colSpan="7" style={{ height: '30px', fontWeight: 'bold', minWidth: 150 }}>{item}分析仪校准</td>
                                </tr>
                                <tr>
                                    <td style={{ width: '16%', height: '30px', minWidth: 150 }}>分析仪原理</td>
                                    <td style={{ width: '14%', height: '30px', minWidth: 150 }} colSpan="2">{rd[0].FxyYl}</td>
                                    <td style={{ width: '14%', height: '30px', minWidth: 150 }}>分析仪量程</td>
                                    <td style={{ width: '14%', height: '30px', minWidth: 150 }}>{rd[0].FxyLc}</td>
                                    <td style={{ width: '14%', height: '30px', minWidth: 150 }}>计量单位</td>
                                    <td style={{ width: '14%', height: '30px', minWidth: 150 }}>{rd[0].JlUnit}</td>
                                </tr>
                                <tr>
                                    <td rowSpan="2" style={{ width: '16%', height: '30px' }}>零点漂移校准</td>
                                    <td style={{ width: '14%', height: '30px' }}>{item !== '颗粒物' ? '零气浓度值' : '零气校准参考值'}</td>
                                    <td style={{ width: '14%', height: '30px' }}>上次校准后测试值</td>
                                    <td style={{ width: '14%', height: '30px' }}>校前测试值</td>
                                    <td style={{ width: '14%', height: '30px' }}>零点漂移%F.S.</td>
                                    <td style={{ width: '14%', height: '30px' }}>仪器校准是否正常</td>
                                    <td style={{ width: '14%', height: '30px' }}>校准后测试值</td>
                                </tr>
                                <tr>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LqNdz}</td>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LdLastCalibrationValue}</td>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LdCalibrationPreValue}</td>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LdPy}</td>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LdCalibrationIsOk}</td>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LdCalibrationSufValue}</td>
                                </tr>
                                <tr>
                                    <td rowSpan="2" style={{ width: '16%' }}>量程漂移校准</td>
                                    <td style={{ width: '14%', height: '30px' }}>{item !== '颗粒物' ? '标气浓度值' : '量程校准参考值'}</td>
                                    <td style={{ width: '14%', height: '30px' }}>上次校准后测试值</td>
                                    <td style={{ width: '14%', height: '30px' }}>校前测试值</td>
                                    <td style={{ width: '14%', height: '30px' }}>量程漂移%F.S.</td>
                                    <td style={{ width: '14%', height: '30px' }}>仪器校准是否正常</td>
                                    <td style={{ width: '14%', height: '30px' }}>校准后测试值</td>
                                </tr>
                                <tr>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].BqNdz}</td>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LcLastCalibrationValue}</td>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LcCalibrationPreValue}</td>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LcPy}</td>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LcCalibrationIsOk}</td>
                                    <td style={{ width: '14%', height: '30px' }}>{rd[0].LcCalibrationSufValue}</td>
                                </tr>
                            </tbody>
                        </table>);
                    } else {
                        rtnVal.push(<table key={`${key }a`} className={styles.FormTable}>
                            <tbody>
                                <tr>
                                    <td colSpan="7" style={{ height: '30px', fontWeight: 'bold' }}>{item}分析仪校准</td>
                                </tr>
                                <tr>
                                    <td style={{ width: '16%', height: '30px' }}>分析仪原理</td>
                                    <td colSpan="2" />
                                    <td style={{ width: '14%', height: '30px' }}>分析仪量程</td>
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }}>计量单位</td>
                                    <td style={{ width: '14%', height: '30px' }} />
                                </tr>
                                <tr>
                                    <td rowSpan="2" style={{ width: '16%', height: '30px' }}>零点漂移校准</td>
                                    <td style={{ width: '14%', height: '30px' }}>{item !== '颗粒物' ? '零气浓度值' : '零气'}</td>
                                    <td style={{ width: '14%', height: '30px' }}>上次校准后测试值</td>
                                    <td style={{ width: '14%', height: '30px' }}>校前测试值</td>
                                    <td style={{ width: '14%', height: '30px' }}>零点漂移%F.S.</td>
                                    <td style={{ width: '14%', height: '30px' }}>仪器校准是否正常</td>
                                    <td style={{ width: '14%', height: '30px' }}>校准后测试值</td>
                                </tr>
                                <tr>
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }} />
                                </tr>
                                <tr>
                                    <td rowSpan="2" style={{ width: '16%', height: '30px' }}>量程漂移校准</td>
                                    <td style={{ width: '14%', height: '30px' }}>{item !== '颗粒物' ? '标气浓度值' : '校准用量程值'}</td>
                                    <td style={{ width: '14%', height: '30px' }}>上次校准后测试值</td>
                                    <td style={{ width: '14%', height: '30px' }}>校前测试值</td>
                                    <td style={{ width: '14%', height: '30px' }}>量程漂移%F.S.</td>
                                    <td style={{ width: '14%', height: '30px' }}>仪器校准是否正常</td>
                                    <td style={{ width: '14%', height: '30px' }}>校准后测试值</td>
                                </tr>
                                <tr>
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }} />
                                    <td style={{ width: '14%', height: '30px' }} />
                                </tr>
                            </tbody>
                        </table>);
                    }
                });
            }
        }
        return rtnVal;
    }

    render() {
        const appStyle = this.props.appStyle;
        let style = null;
        if (appStyle) {
            style = appStyle;
        }
        else {
            style = {
                height: 'calc(100vh - 200px)'
            }
        }
        const SCREEN_HEIGHT=this.props.scrolly==="none"?{overflowY:'none'}:{height:document.querySelector('body').offsetHeight - 250};
        const Record=this.props.JzRecord!==null?this.props.JzRecord.Record:null;
        const Content=Record!==null?Record.Content:null;
        const Code=this.props.JzRecord!==null?this.props.JzRecord.Code:null;
        const SignContent =Record!==null?Record.SignContent === null ? null : `data:image/jpeg;base64,${Record.SignContent}`:null;
        if (this.props.isloading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                size="large"
            />);
        }

        return (
            <div className={styles.FormDiv} style={style}>
                <div className={styles.FormName}>CEMS零点量程漂移与校准记录表</div>
                <div className={styles.HeadDiv} style={{ fontWeight: 'bold' }}>企业名称：
                    {Content!==null?Content.EnterpriseName:null}
                </div>
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td style={{ width: '18%', height: '30px', textAlign: 'left',minWidth: 150 }}>
                                        气态污染物CEMS设备生产商
                            </td>
                            <td style={{ width: '16%', height: '30px' , minWidth: 150}}>
                                {Content!==null?Content.GasCemsEquipmentManufacturer:null}
                            </td>
                            <td style={{ width: '18%', height: '30px', minWidth: 150 }}>
                                        气态污染物CEMS设备规格型号
                            </td>
                            <td style={{ width: '18%', height: '30px', minWidth: 150 }}>
                                {Content!==null?Content.GasCemsCode:null}
                            </td>
                            <td style={{ width: '18%', height: '30px', minWidth: 150 }}>
                                        校准日期
                            </td>
                            <td style={{ width: '16%', height: '30px', minWidth: 150 }}>
                                {Content!==null?moment(Content.AdjustStartTime).format("YYYY-MM-DD"):null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '18%', height: '30px', textAlign: 'left' }}>
                                        颗粒物CEMS设备生产商
                            </td>
                            <td style={{ width: '16%', height: '30px' }}>
                                {Content!==null?Content.KlwCemsEquipmentManufacturer:null}
                            </td>
                            <td>
                                        颗粒物CEMS设备规格型号
                            </td>
                            <td style={{ width: '18%', height: '30px' }}>
                                {Content!==null?Content.KlwCemsCode:null}
                            </td>
                            <td style={{ width: '16%', height: '30px' }}>
                                        校准开始日期
                            </td>
                            <td style={{ width: '16%', height: '30px' }}>
                                {Content!==null?Content.AdjustStartTime:null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '18%', height: '30px', textAlign: 'left' }}>
                                        安装地点
                            </td>
                            <td style={{ width: '16%', height: '30px' }}>
                                {Content!==null?Content.PointPosition:null}
                            </td>
                            <td style={{ width: '18%', height: '30px', textAlign: 'left' }}>
                                        维护管理单位
                            </td>
                            <td colSpan="3">
                                {Content!==null?Content.MaintenanceManagementUnit:null}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {
                    this.renderItem(Record!==null?Record.RecordList:null, Code)
                }
                <table className={styles.FormTable} style={{ border: '0' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '25%', height: '30px', minWidth: 225 }}>运维人：</td>
                            <td style={{ width: '25%', height: '30px', minWidth: 225 }}>{Record!==null?Record.CreateUserID:null }</td>
                            <td style={{ width: '25%', height: '30px', minWidth: 225 }}>校准结束时间：</td>
                            <td style={{ width: '25%', height: '30px', minWidth: 225 }}>{Content!==null?Content.AdjustEndTime:null}</td>
                        </tr>
                    </tbody>
                </table>
                {/* <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td style={{ width: '87%', height: '50px', textAlign: 'right', border: '0', fontWeight: 'bold', minWidth: 800 }}>负责人签名：</td>
                            <td style={{ width: '13%', height: '50px', border: '0' }}>{SignContent === null ? null : <img style={{ width: '80%', height: '110%' }} src={SignContent} />}</td>
                        </tr>
                        <tr>
                            <td style={{ width: '87%', height: '50px', textAlign: 'right', border: '0', fontWeight: 'bold', minWidth: 800 }}>签名时间：</td>
                            <td style={{ width: '13%', height: '50px', border: '0', minWidth: 150 }}>{Record!==null?Record.SignTime:null}</td>
                        </tr>
                    </tbody>
                </table> */}
            </div>
        );
    }
}
export default JzRecordContent;