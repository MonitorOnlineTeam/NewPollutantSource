/*
 * @Author: lzp
 * @Date: 2019-08-22 09:36:43
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:30:59
 * @Description: cems校验测试记录
 */
import React, { Component } from 'react';
import { Spin, Checkbox } from 'antd';
import { connect } from 'dva';
import styles from "./BdTestRecordContent.less";
import moment from 'moment';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetBdTestRecord'],
    BdRecord: task.BdRecord
}))
class BdTestRecordContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: [{ item: '颗粒物', unit: '', wcFormula: '' },
            { item: 'SO2', unit: '', wcFormula: '' },
            { item: 'NOX', unit: '', wcFormula: '' },
            { item: 'O2', unit: '', wcFormula: '' },
            { item: '流速', unit: '', wcFormula: '' },
            { item: '温度', unit: '', wcFormula: '' },
            { item: '湿度', unit: '', wcFormula: '' }],
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetBdTestRecord',
            payload: {
                TaskID: this.props.TaskID,
                TypeID: this.props.TypeID,
            }
        });
    }

    renderCemsMainInstrument = (record) => {
        const rtnVal = [];
        rtnVal.push(<tr key="0">
            <td style={{ width: '20%', minWidth: 200 }} className={styles.tdTitle}>仪器名称</td>
            <td style={{ width: '20%', minWidth: 200 }} className={styles.tdTitle}>设备型号</td>
            <td style={{ width: '20%', minWidth: 200 }} className={styles.tdTitle}>制造商</td>
            <td style={{ width: '20%', minWidth: 200 }} className={styles.tdTitle}>测试项目</td>
            <td style={{ width: '20%', minWidth: 200 }} className={styles.tdTitle}>测量原理</td>
        </tr>);
        if (record !== null && record !== undefined) {
            record.map((item, key) => {
                rtnVal.push(
                    <tr key={key + 1}>
                        <td>{item.EquipmentName}</td>
                        <td>{item.EquipmentType}</td>
                        <td>{item.ManufacturerName}</td>
                        <td>{item.PollutantName}</td>
                        <td colSpan="2">{item.AnalyticalMethod}</td>
                    </tr>
                );
            });
        } else {
            rtnVal.push(
                <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td colSpan="2" />
                </tr>
            );
        }
        return rtnVal;
    }

    renderCemsTestInfo = (recordResult, itemName) => {
        const rtnVal = [];
        let rowNum = 0;
        if (recordResult !== null &&
            itemName !== null) {
            let result = recordResult.filter((item) => item.ItemName === itemName);
            let record = result !== null && result !== undefined && result.length > 0 ? result[0].TestResult : null;
            if (record !== null && record !== undefined) {
                this.state.unit.map((item) => {
                    if (item.item === itemName) {
                        item.unit = result.Unit;
                        item.wcFormula = result.Formula;
                    }
                });
                record.map((item, key) => {
                    if (rowNum === 0) {
                        let evaluateResult = result !== null && result.length > 0 ? result[0].EvaluateResults === "1" ? "合格" : "不合格" : '';
                        rtnVal.push(
                            <tr key={key}>
                                <td>{item.TestTime}</td>
                                <td>{item.CbValue}</td>
                                <td>{item.CemsTextValue}</td>
                                <td rowSpan={record.length + 1} style={{ textAlign: 'center' }}>{result !== null && result.length > 0 ? result[0].WcValue : ''}</td>
                                <td rowSpan={record.length + 1}>{result !== null && result.length > 0 ? result[0].EvaluateStadard : ''}</td>
                                <td rowSpan={record.length + 1} style={{ textAlign: 'center' }}>{evaluateResult}</td>
                            </tr>
                        );
                    } else {
                        rtnVal.push(
                            <tr key={`${key}a`}>
                                <td>{item.TestTime}</td>
                                <td>{item.CbValue}</td>
                                <td>{item.CemsTextValue}</td>
                            </tr>
                        );
                    }
                    rowNum += 1;
                });
                rtnVal.push(
                    <tr key="b">
                        <td>平均值</td>
                        <td>{result !== null && result.length > 0 ? result[0].CbAvgValue : ''}</td>
                        <td>{result !== null && result.length > 0 ? result[0].CemsTextValue : ''}</td>
                    </tr>);
            }
        }
        return rtnVal;
    }

    //填充选择的公式
    renderFormulaInfo = (recordResult, itemName) => {
        let result = null;
        const rtnVal = [];
        if (recordResult !== null && recordResult !== undefined) {
            result = recordResult.filter((item) => item.ItemName === itemName);
        }
        let sltValue1 = !!(result !== null && result.length > 0 && result[0].Formula === '相对准确度');
        let sltValue2 = !!(result !== null && result.length > 0 && result[0].Formula === '相对误差');
        let sltValue3 = !!(result !== null && result.length > 0 && result[0].Formula === '绝对误差');
        switch (itemName) {
            case '颗粒物':
                rtnVal.push(<td key="0" rowSpan="2" style={{ width: '10%' }}>
                    <Checkbox checked={sltValue2}>相对误差</Checkbox><br />
                    <Checkbox checked={sltValue3}>绝对误差</Checkbox>
                </td>);
                break;
            case 'SO2':
                rtnVal.push(
                    <td key="1" rowSpan="2" style={{ width: '10%' }}>
                        <Checkbox checked={sltValue1}>相对准确度</Checkbox><br />
                        <Checkbox checked={sltValue2}>相对误差</Checkbox><br />
                        <Checkbox checked={sltValue3}>绝对误差</Checkbox>
                    </td>);
                break;
            case 'NOX':
                rtnVal.push(
                    <td key="2" rowSpan="2" style={{ width: '10%' }}>
                        <Checkbox checked={sltValue1}>相对准确度</Checkbox><br />
                        <Checkbox checked={sltValue2}>相对误差</Checkbox><br />
                        <Checkbox checked={sltValue3}>绝对误差</Checkbox>
                    </td>);
                break;
            case 'O2':
                rtnVal.push(<td key="3" rowSpan="2" style={{ width: '10%' }}>
                    <Checkbox checked={sltValue1}>相对准确度</Checkbox><br />
                    <Checkbox checked={sltValue3}>绝对误差</Checkbox>
                </td>);
                break;
            case '流速':
                rtnVal.push(<td key="4" rowSpan="2" style={{ width: '10%' }}>
                    <Checkbox checked={sltValue2}>相对误差</Checkbox><br />
                    <Checkbox checked={sltValue3}>绝对误差</Checkbox>
                </td>);
                break;
            case '湿度':
                rtnVal.push(<td key="5" rowSpan="2" style={{ width: '10%' }}>
                    <Checkbox checked={sltValue2}>相对误差</Checkbox><br />
                    <Checkbox checked={sltValue3}>绝对误差</Checkbox>
                </td>);
                break;
            default:
                break;
        }

        return rtnVal;
    }

    //填充选择的单位
    renderUnitInfo = (recordResult, itemName) => {
        let result = null;
        const rtnVal = [];
        if (recordResult !== null && recordResult !== undefined) {
            result = recordResult.filter((item) => item.ItemName === itemName);
        }
        let sltValue1 = !!(result !== null && result.length > 0 && result[0].Unit === 'μmol/mol');
        let sltValue2 = !!(result !== null && result.length > 0 && result[0].Unit === 'mg/m3');
        switch (itemName) {
            case 'SO2':
                rtnVal.push(<tr key="0">
                    <td><Checkbox checked={sltValue1}>μmol/mol</Checkbox>
                        <Checkbox checked={sltValue2}>mg/m3</Checkbox>
                    </td>
                    <td><Checkbox checked={sltValue1}>μmol/mol</Checkbox>
                        <Checkbox checked={sltValue2}>mg/m3</Checkbox>
                    </td>
                </tr>
                );
                break;
            case 'NOX':
                rtnVal.push(<tr key="1">
                    <td><Checkbox checked={sltValue1}>μmol/mol</Checkbox>
                        <Checkbox checked={sltValue2}>mg/m3</Checkbox>
                    </td>
                    <td><Checkbox checked={sltValue1}>μmol/mol</Checkbox>
                        <Checkbox checked={sltValue2}>mg/m3</Checkbox>
                    </td>
                </tr>);
                break;
            default:
                break;
        }

        return rtnVal;
    }

    //展示测试中的标气使用信息
    renderGasInfo = (record) => {
        const rtnVal = [];
        rtnVal.push(<tr key="0">
            <td style={{ width: '33%' }} className={styles.tdTitle}>标准气体名称</td>
            <td style={{ width: '33%' }} className={styles.tdTitle}>浓度值</td>
            <td style={{ width: '34%' }} className={styles.tdTitle}>生产厂商名称</td>
        </tr>);
        if (record !== null && record !== undefined) {
            record.map((item, key) => {
                rtnVal.push(
                    <tr key={key + 1}>
                        <td>{item.Name}</td>
                        <td>{item.ConcentrationValue}</td>
                        <td>{item.Manufacturer}</td>
                    </tr>
                );
            });
        } else {
            rtnVal.push(
                <tr>
                    <td />
                    <td />
                    <td />
                </tr>
            );
        }
        return rtnVal;
    }

    //展示测试中手持设备
    renderCbInfo = (record) => {
        const rtnVal = [];
        rtnVal.push(<tr key="0">
            <td style={{ width: '25%' }} className={styles.tdTitle}>测试项目</td>
            <td style={{ width: '25%' }} className={styles.tdTitle}>测试设备生产商</td>
            <td style={{ width: '25%' }} className={styles.tdTitle}>测试设备型号</td>
            <td style={{ width: '25%' }} className={styles.tdTitle}>方法依据</td>
        </tr>);
        if (record !== null && record !== undefined) {
            record.map((item, key) => {
                rtnVal.push(
                    <tr key={key + 1}>
                        <td>{item.Name}</td>
                        <td>{item.Manufacturer}</td>
                        <td>{item.EquipmentModel}</td>
                        <td>{item.TestMethod}</td>
                    </tr>
                );
            });
        } else {
            rtnVal.push(
                <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                </tr>
            );
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
        const SCREEN_HEIGHT = this.props.scrolly === "none" ? { overflowY: 'none' } : { height: document.querySelector('body').offsetHeight - 250 };
        const Record = this.props.BdRecord !== null ? this.props.BdRecord.Record : null;
        const Content = Record !== null ? Record.Content : null;
        const StandardGasList = this.props.BdRecord !== null ? this.props.BdRecord.StandardGasList : null;
        const TestEquipmentList = this.props.BdRecord !== null ? this.props.BdRecord.TestEquipmentList : null;
        const EquipmentInfoList = this.props.BdRecord !== null ? this.props.BdRecord.EquipmentInfoList : null;
       let SignContent = Record !== null ? Record.SignContent === null ? null : `data:image/jpeg;base64,${Record.SignContent}` : null;
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
                <div className={styles.FormName}>CEMS校验测试记录</div>
                <div className={styles.HeadDiv} style={{ fontWeight: 'bold' }}>企业名称：{Content !== null ? Content.EnterpriseName : null}</div>
                <table className={styles.FormTable}>
                    <tbody>
                        {/* <tr>
                            <td style={{ minWidth: 150 }}>
                                CEMS供应商：
                            </td>
                            <td colSpan="5" style={{ minWidth: 150 }}>
                                {Content !== null ? Content.CemsSupplier : null}
                            </td>
                        </tr> */}
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '0' }}>
                                CEMS主要仪器型号：
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="6" style={{ padding: '0', border: '0' }}>
                                <table style={{ width: '100%', marginTop: '0', marginBottom: '0' }} className={styles.FormTable}>
                                    <tbody>
                                        {
                                            this.renderCemsMainInstrument(EquipmentInfoList)
                                        }
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ borderTop: '0' }}>CEMS安装地点</td>
                            <td colSpan="2" style={{ borderTop: '0' }}>{Content !== null ? Content.PointPosition : null}</td>
                            <td style={{ borderTop: '0' }}>维护管理单位</td>
                            <td colSpan="2" style={{ borderTop: '0' }}>{Content !== null ? Content.MaintenanceManagementUnit : null}</td>
                        </tr>
                        <tr>
                            <td>本次校验日期</td>
                            <td colSpan="2">{Content !== null ? Content.CurrentCheckTime ? moment(Content.CurrentCheckTime).format('YYYY-MM-DD') : null : null}</td>
                            <td>上次校验日期</td>
                            <td colSpan="2">{Content !== null ? Content.LastCheckTime ? moment(Content.LastCheckTime).format('YYYY-MM-DD') : null : null}</td>
                        </tr>
                        <tr><td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold' }}>颗粒物校验</td></tr>
                        <tr>
                            <td rowSpan="2" style={{ width: '20%' }}>监测时间</td>
                            <td style={{ width: '20%' }}>参比方法测定值</td>
                            <td style={{ width: '20%' }}>CEMS测定值</td>
                            {
                                this.renderFormulaInfo(Record !== null ? Record.RecordList : null, '颗粒物')
                            }
                            <td rowSpan="2" style={{ width: '20%' }}>评价标准</td>
                            <td rowSpan="2" style={{ width: '10%' }}>评价结果</td>
                        </tr>
                        <tr>
                            <td>（mg/m3）</td>
                            <td>（mg/m3）</td>
                        </tr>
                        {this.renderCemsTestInfo(Record !== null ? Record.RecordList : null, '颗粒物')}
                        <tr><td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold' }}>SO2校验</td></tr>
                        <tr>
                            <td rowSpan="2">监测时间</td>
                            <td>参比方法测定值</td>
                            <td>CEMS测定值</td>
                            {
                                this.renderFormulaInfo(Record !== null ? Record.RecordList : null, 'SO2')
                            }
                            <td rowSpan="2">评价标准</td>
                            <td rowSpan="2">评价结果</td>
                        </tr>
                        {
                            this.renderUnitInfo(Record !== null ? Record.RecordList : null, 'SO2')
                        }
                        {this.renderCemsTestInfo(Record !== null ? Record.RecordList : null, 'SO2')}
                        <tr><td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold' }}>NOX校验</td></tr>
                        <tr>
                            <td rowSpan="2">监测时间</td>
                            <td>参比方法测定值</td>
                            <td>CEMS测定值</td>
                            {
                                this.renderFormulaInfo(Record !== null ? Record.RecordList : null, 'NOX')
                            }
                            <td rowSpan="2">评价标准</td>
                            <td rowSpan="2">评价结果</td>
                        </tr>
                        {
                            this.renderUnitInfo(Record !== null ? Record.RecordList : null, 'SO2')
                        }
                        {this.renderCemsTestInfo(Record !== null ? Record.RecordList : null, 'NOX')}
                        <tr><td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold' }}>O2校验</td></tr>
                        <tr>
                            <td rowSpan="2">监测时间</td>
                            <td>参比方法测定值</td>
                            <td>CEMS测定值</td>
                            {
                                this.renderFormulaInfo(Record !== null ? Record.RecordList : null, 'O2')
                            }
                            <td rowSpan="2">评价标准</td>
                            <td rowSpan="2">评价结果</td>
                        </tr>
                        <tr>
                            <td>（%）</td>
                            <td>（%）</td>
                        </tr>
                        {this.renderCemsTestInfo(Record !== null ? Record.RecordList : null, 'O2')}
                        <tr><td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold' }}>流速校验</td></tr>
                        <tr>
                            <td rowSpan="2">监测时间</td>
                            <td>参比方法测定值</td>
                            <td>CEMS测定值</td>
                            {
                                this.renderFormulaInfo(Record !== null ? Record.RecordList : null, '流速')
                            }
                            <td rowSpan="2">评价标准</td>
                            <td rowSpan="2">评价结果</td>
                        </tr>
                        <tr>
                            <td>（m/s）</td>
                            <td>（m/s）</td>
                        </tr>
                        {this.renderCemsTestInfo(Record !== null ? Record.RecordList : null, '流速')}
                        <tr><td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold' }}>温度校验</td></tr>
                        <tr>
                            <td rowSpan="2">监测时间</td>
                            <td>参比方法测定值</td>
                            <td>CEMS测定值</td>
                            <td rowSpan="2">绝对误差（℃）</td>
                            <td rowSpan="2">评价标准</td>
                            <td rowSpan="2">评价结果</td>
                        </tr>
                        <tr>
                            <td>（℃）</td>
                            <td>（℃）</td>
                        </tr>
                        {this.renderCemsTestInfo(Record !== null ? Record.RecordList : null, '温度')}
                        <tr><td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold' }}>湿度校验</td></tr>
                        <tr>
                            <td rowSpan="2">监测时间</td>
                            <td>参比方法测定值</td>
                            <td>CEMS测定值</td>
                            {
                                this.renderFormulaInfo(Record !== null ? Record.RecordList : null, '湿度')
                            }
                            <td rowSpan="2">评价标准</td>
                            <td rowSpan="2">评价结果</td>
                        </tr>
                        <tr>
                            <td>（%）</td>
                            <td>（%）</td>
                        </tr>
                        {this.renderCemsTestInfo(Record !== null ? Record.RecordList : null, '湿度')}
                        <tr>
                            <td rowSpan="6">校验结论</td>
                            <td colSpan="5" className={styles.tdTitle}>如校验合格前对系统进行过处理、调整、参数修改，请说明：</td>
                        </tr>
                        <tr>
                            <td colSpan="5">
                                {Content !== null ? Content.CheckConclusionResult1 : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="5" className={styles.tdTitle}>如校验后，颗粒物测量仪、流速仪的原校正系统改动，请说明：</td>
                        </tr>
                        <tr>
                            <td colSpan="5">
                                {Content !== null ? Content.CheckConclusionResult2 : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="5" className={styles.tdTitle}>总体校验是否合格：</td>
                        </tr>
                        <tr>
                            <td colSpan="5">
                                {Content !== null && Content.CheckIsOk !== null ? Content.CheckIsOk === "1" ? "合格" : "不合格" : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="6" style={{ borderBottom: '0', textAlign: 'center', fontWeight: 'bold' }}>标准气体</td>
                        </tr>
                        <tr>
                            <td colSpan="6" style={{ padding: '0', border: '0' }}>
                                <table style={{ width: '100%', marginTop: '0', marginBottom: '0' }} className={styles.FormTable}>
                                    <tbody>
                                        {
                                            this.renderGasInfo(StandardGasList )
                                        }
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="6" style={{ borderTop: '0', borderBottom: '0', textAlign: 'center', fontWeight: 'bold' }}>参比方法测试设备</td>
                        </tr>
                        <tr>
                            <td colSpan="6" style={{ padding: '0', border: '0' }}>
                                <table style={{ width: '100%', marginTop: '0', marginBottom: '0' }} className={styles.FormTable}>
                                    <tbody>
                                        {
                                            this.renderCbInfo(TestEquipmentList)
                                        }
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'right', borderTop: '0' }}>
                                日期：
                            </td>
                            <td colSpan="2" style={{ borderTop: '0' }}>
                                {Content !== null ? Content.CheckDate ? moment(Content.CheckDate).format("YYYY-MM-DD") : null : null}
                            </td>
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
                            <td style={{ width: '13%', height: '50px', border: '0' }}>{Record !== null ? Record.SignTime : null}</td>
                        </tr>
                    </tbody>
                </table> */}
            </div>
        );
    }
}
export default BdTestRecordContent;