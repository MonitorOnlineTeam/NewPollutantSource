/*
 * @Author: lzp
 * @Date: 2019-08-22 09:36:43
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:29:32
 * @Description: 易耗品更换记录表
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./ConsumablesReplaceRecordContent.less";
import MonitorContent from '../../components/MonitorContent/index';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetConsumablesReplaceRecord'],
    ConsumablesReplaceRecord: task.ConsumablesReplaceRecord
}))
/*
页面：易耗品更换记录表
*/
class ConsumablesReplaceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading:this.props.isloading
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetConsumablesReplaceRecord',
            payload: {
                TaskID: this.props.TaskID
            },
        });
        this.setState({
            isloading: false
        });
    }

    renderItem = (record) => {
        const rtnVal = [];
        if (record !== null && record.length > 0) {
            record.map((item, index) => {
                rtnVal.push(
                    <tr key={index}>
                        <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {index + 1}
                        </td>
                        <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.ReplaceDate}
                        </td>
                        <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.ConsumablesName}
                        </td>
                        <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.Model}
                        </td>
                        <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.Unit}
                        </td>
                        <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.Num}
                        </td>
                        <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.Remark}
                        </td>
                        <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.AnotherTimeOfChange}
                        </td>
                    </tr>
                );
            });
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
        const Record=this.props.ConsumablesReplaceRecord!==null?this.props.ConsumablesReplaceRecord.Record:null;
        const Content=Record!==null?Record.Content:null;
        const SignContent =Record!==null?Record.SignContent === null ? null : `data:image/jpeg;base64,${Record.SignContent}`:null;
        const DeviceName = 'CEMS'; //设备名称
        if (this.state.isloading) {
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
                <div className={styles.FormName}>易耗品更换记录表</div>
                <div className={styles.HeadDiv} style={{ fontWeight: 'bold' }}>企业名称：{Content!==null ? Content.EnterpriseName:null}</div>
                <table
                    className={styles.FormTable}
                >
                    <tbody>
                        <tr>
                            <td style={{ width: '12%',minWidth: 100, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        设备名称
                            </td>
                            <td style={{ width: '16%',minWidth: 150, textAlign: 'center', fontSize: '14px' }}>
                                {DeviceName}
                            </td>
                            <td style={{ width: '13%',minWidth: 100, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        规格型号
                            </td>
                            <td style={{ width: '13%',minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                                {Content !== null ? Content.Code:null}
                            </td>
                            <td style={{ width: '12%',minWidth: 100, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        设备编号
                            </td>
                            <td colSpan="3" style={{ width: '30%',minWidth: 200, textAlign: 'center', fontSize: '14px' }}>
                                {Content !== null ?Content.EquipmentCode:null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ width: '18%',minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        维护管理单位
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                {Content !== null ?Content.MaintenanceManagementUnit:null}
                            </td>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                        安装地点
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Content !== null ?Content.PointPosition:null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '9%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        序号
                            </td>
                            <td style={{ width: '18%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        更换日期
                            </td>
                            <td style={{ width: '14%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        易耗品名称
                            </td>
                            <td style={{ width: '12%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        规格型号
                            </td>
                            <td style={{ width: '12%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        单位
                            </td>
                            <td style={{ width: '12%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        数量
                            </td>
                            <td style={{ width: '23%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        更换原因说明（备注）
                            </td>
                            <td style={{ width: '23%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        下次更换日期
                            </td>
                        </tr>
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null)
                        }
                        <tr>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        运行维护人员
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Record !== null ?Record.CreateUserID:null}
                            </td>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        时间
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', colSpan: '2' }}>
                                {Record !== null ?Record.CreateTime:null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="8" style={{ width: '18%', height: '50px', fontSize: '14px', paddingLeft: 15 }}>
                                        注：更换易耗品时应及时记录，每半年汇总存档。
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td style={{ width: '87%', height: '50px', textAlign: 'right', border: '0', fontWeight: 'bold',minWidth: 750 }}>负责人签名：</td>
                            <td style={{ width: '13%', height: '50px', border: '0' }}>
                                {
                                    SignContent === null ? null : <img style={{ width: '80%', height: '110%' }} src={SignContent} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '87%', height: '50px', textAlign: 'right', border: '0', fontWeight: 'bold',minWidth: 750 }}>签名时间：</td>
                            <td style={{ width: '13%', height: '50px', border: '0',minWidth: 150 }}>{Record !== null ?Record.SignTime:null}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ConsumablesReplaceRecord;