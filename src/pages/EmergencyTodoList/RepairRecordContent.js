/*
 * @Author: lzp
 * @Date: 2019-08-22 09:36:43
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:29:00
 * @Description: 维修记录表
 */
import React, { Component } from 'react';
import { Spin, Button, Card } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MonitorContent from '../../components/MonitorContent/index';
import styles from "./RepairRecordContent.less";

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetRepairRecord'],
    Repair: task.RepairRecord
}))
class RepairRecordContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetRepairRecord',
            payload: {
                TaskID: this.props.TaskID,
                TypeID: this.props.TypeID
            }
        });
        this.setState({
            isloading: false
        });
    }

    renderItem = (Repair) => {
        const rtnVal = [];
        if (Repair !== null) {
            if (Repair.RecordList && Repair.RecordList.length > 0) {
                Repair.RecordList.map((item, index) => {
                    rtnVal.push(
                        <tr>
                        <td style={{ width: '5%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                            {index + 1}
                                 </td>
                                 <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                             {item.FaultUnitName}
                                 </td>
                                 <td style={{ width: '9%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                             {item.FaultTime}
                                 </td>
     
                                 <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                              {item.MonitorPointEquipmentName}
                                 </td>
                                 <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                             {item.EquipmentName}
                                 </td>
                                 <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                              {item.EquipmentNumber}
                                 </td>
                                 <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                             {item.ManufacturerName}
                                 </td>
                                 <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                             {item.FaultPhenomenon}
                                 </td>
     
                                 <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                            {item.CauseAnalysis}
                                 </td>
                                 <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                            {item.ProcessingMethod}
                                 </td>
                                 <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                           {item.ProcessingResults}
                                 </td> 
                                 <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                            {item.Remark}
                                 </td>                    
                         </tr>
                    );
                });
            }
        }
        return rtnVal;
    }

    renderItemChildOne = (item, Repair) => {
        const rtnValChildOne = [];
        if (Repair.Record.RecordList !== null && Repair.Record.RecordList.length > 0) {
            Repair.Record.RecordList.map((items, index) => {
                if (items.ItemID === item) {
                    rtnValChildOne.push(
                        <td key={index} style={{ width: '60%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {items.RepairDescription}
                        </td>
                    );
                }
            });
        }
        if (rtnValChildOne.length === 0) {
            rtnValChildOne.push(
                <td key="a" style={{ width: '60%', height: '50px', textAlign: 'center', fontSize: '14px' }} />
            );
        }
        return rtnValChildOne;
    }

    renderItemChildTwo = (item, Repair) => {
        const rtnValChildTwo = [];
        if (Repair.Record.RecordList !== null && Repair.Record.RecordList.length > 0) {
            Repair.Record.RecordList.map((items, index) => {
                if (items.ItemID === item) {
                    rtnValChildTwo.push(
                        <td key={`${index}1`} style={{ width: '60%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {items.ChangeSpareparts}
                        </td>
                    );
                }
            });
        }
        if (rtnValChildTwo.length === 0) {
            rtnValChildTwo.push(
                <td key="a" style={{ width: '60%', height: '50px', textAlign: 'center', fontSize: '14px' }} />
            );
        }
        return rtnValChildTwo;
    }

    render() {
        const appStyle = this.props.appStyle;
        let style =null;
        if(appStyle)
        {
            style=appStyle;
        }
        else
        {
            style=   {
                height: 'calc(100vh - 200px)'
            }
        }
        const SCREEN_HEIGHT = this.props.scrolly === "none" ? { overflowY: 'none' } : { height: 'calc(100vh-200px)' };
        const Record = this.props.Repair !== null ? this.props.Repair.Record : null;
        const Content = Record !== null ? Record.Content : null;
        const SignContent = Record !== null ? Record.SignContent === null ? null : `data:image/jpeg;base64,${Record.SignContent}` : null;
        const StartTime = Content !== null ? Content.StartTime !== null ? Content.StartTime : "--" : null;
        const EndTime = Content !== null ? Content.EndTime !== null ? Content.EndTime : "--" : null;
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
                <div className={styles.FormName}></div>
                <table key="1" className={styles.FormTable}>
                    <tbody>
                    <tr>
                            <td colSpan="12"  style={{ textAlign:'center',fontWeight:'bold',fontSize:16}}>
                             设备维修记录表
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan="3" style={{ width: '18%',minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        运行维护单位
                            </td>
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                {Content !== null ?Content.EnterpriseName:null}
                            </td>
                            <td colSpan="3" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                        安装地点
                            </td>
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Content !== null ?Content.PointPosition:null}
                            </td>
                        </tr>
                        <tr>
                        <td style={{ width: '5%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        序号
                            </td>
                            <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        故障单元
                            </td>
                            <td style={{ width: '9%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        故障时间
                            </td>

                            <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        系统型号
                            </td>
                            <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        主机名称型号
                            </td>
                            <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        主机序列号
                            </td>
                            <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        主机生产厂商
                            </td>
                            <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        故障现象
                            </td>

                            <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        原因分析
                            </td>
                            <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        处理方法
                            </td>
                            <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        处理结果
                            </td> 
                            <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '' }}>
                                        备注
                            </td>                                                       
                        </tr>
                        {
                            this.renderItem(Record)
                        }
                        <tr>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                       维修人
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Record !== null ?Record.CreateUserID:null}
                            </td>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        维修日期
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', colSpan: '2' }}>
                                {Record !== null ?Record.StartTime:null}
                            </td>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        离开时间
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', colSpan: '2' }}>
                                {Record !== null ?Record.EndTime:null}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default RepairRecordContent;