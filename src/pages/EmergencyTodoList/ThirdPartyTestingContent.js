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
import moment from 'moment'
@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetDetectionTimesRecordList'],
    detectionTimesRecordList: task.detectionTimesRecordList
}))
class ThirdPartyTestingContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetDetectionTimesRecordList',
            payload: {
                TaskID: this.props.TaskID,
                TypeID: this.props.TypeID
            }
        });
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
        const Record = this.props.detectionTimesRecordList !== null ? this.props.detectionTimesRecordList.Record : null;
        const Content = this.props.detectionTimesRecordList !== null ? this.props.detectionTimesRecordList.Record&&this.props.detectionTimesRecordList.Record.Content : null;
        const RecordList = this.props.detectionTimesRecordList !== null ? this.props.detectionTimesRecordList.Record&&this.props.detectionTimesRecordList.Record.RecordList : null;
        
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
                             上月委托第三方检测次数
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan="2" style={{ minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        维护管理单位
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                {Content !== null ?Content.MaintenanceManagementUnit:null}
                            </td>
                            <td colSpan="2" style={{  height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                        安装地点
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Content !== null ?Content.PointPosition:null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        统计月份
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                {RecordList !== null ? `${moment(RecordList[0].DataTime).format('M')}月`:null}
                            </td>
                            <td colSpan="2" style={{minWidth: 250,  height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                        委托第三方检测次数
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {RecordList !== null ?RecordList[0].Times:null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        运行维护人员
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                {Record !== null ?Record.CreateUserID:null}
                            </td>
                            <td colSpan="2" style={{  height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                        时间
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Record !== null ?Record.CreateTime:null}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default ThirdPartyTestingContent;