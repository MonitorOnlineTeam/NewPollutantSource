/*
 * @Author: 
 * @Date: 2022-02-14
 * @LastEditors: 
 * @LastEditTime: 2022-02-14
 * @Description: 运维记录表
 */
import React, { Component } from 'react';
import { Row, Col, Layout, Table, List, Button, Spin, Card } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./MaintainRepalceRecord.less";

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetOperationRecordList'],
    operationRecordList: task.operationRecordList
}))

/*
运维记录表
*/

class OperationRecordContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetOperationRecordList',
            payload: {
                TaskID: this.props.TaskID,
                TypeID: this.props.TypeID,
            },
        });
        this.setState({
            isloading: false
        });
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
        const Record=this.props.operationRecordList!==null?this.props.operationRecordList.Record:null;
        const Content=Record!==null?Record.Content:null;
        const RecordList=this.props.operationRecordList&&this.props.operationRecordList.Record&&this.props.operationRecordList.Record.RecordList!==null?this.props.operationRecordList.Record.RecordList[0]:null;

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
                <div className={styles.FormName}>运维记录表</div>
                {/* <div className={styles.HeadDiv} style={{ fontWeight: 'bold' }}>企业名称：{Content!==null ? Content.EnterpriseName:null}</div> */}
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        维护管理单位
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Content!==null ? Content.MaintenanceManagementUnit:null}
                            </td>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        安装地点
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Content!==null ? Content.PointPosition:null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        是否故障
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {RecordList!==null ? RecordList.IsFaultName:null}
                            </td>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        设备状态
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {RecordList!==null ? RecordList.EquipmentStatusName:null}
                            </td>
                        </tr>
                        <tr>
                          <td colSpan="2"  style={{ width: '18%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '500' }}>
                                        告警问题
                            </td>
                            <td colSpan="6"  style={{ width: '14%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '500' }}>
                               {RecordList!==null ? RecordList.AlarmProblem:null}
                            </td>
                        </tr>
                        <tr>
                          <td colSpan="2"  style={{ width: '18%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '500' }}>
                                        处理方式
                            </td>
                            <td colSpan="6"  style={{ width: '14%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '500' }}>
                               {RecordList!==null ? RecordList.TreatmentMethod:null}
                            </td>
                        </tr>
                        <tr>
                          <td colSpan="2"  style={{ width: '18%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '500' }}>
                                        维修内容
                            </td>
                            <td colSpan="6"  style={{ width: '14%', height: '50px', textAlign: 'center', backgroundColor: '#fff', fontSize: '14px', fontWeight: '500' }}>
                               {RecordList!==null ? RecordList.MaintenanceContent:null}
                            </td>
                        </tr>
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
                    </tbody>
                </table>
            </div>
        );
    }
}

export default OperationRecordContent;
