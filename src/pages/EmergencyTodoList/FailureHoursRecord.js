/*
 * @Author: lzp
 * @Date: 2020-06-08 09:36:43
 * @LastEditors: lzp
 * @LastEditTime: 2020-06-08 09:36:43
 * @Description: 故障小时数记录表
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./FailureHoursRecord.less";
import MonitorContent from '../../components/MonitorContent/index';
// import { content } from 'html2canvas/dist/types/css/property-descriptors/content';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetConsumablesReplaceRecord'],
    FailureHoursRecord: task.FailureHoursRecord
}))
/*
页面：故障小时数记录表
*/
class FailureHoursRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading: this.props.isloading
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetFailureHoursRecord',
            payload: {
                TaskID: this.props.TaskID,
                TypeID: this.props.TypeID
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
                    <tr>
                        <td style={{ width: '18%', minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {index + 1}
                        </td>
                        <td  style={{ textAlign: 'center', fontSize: '14px', minWidth: 200 }}>
                            {item.PollutantName}
                        </td>
                        <td  style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                            {item.ExceptionTypeName}
                        </td>
                        <td  style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                            {item.BeginTime}
                        </td>
                        <td style={{ width: '18%', minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.EndTime}
                        </td>
                        <td  style={{ textAlign: 'center', fontSize: '14px', minWidth: 200 }}>
                            {item.Hour}
                        </td>
                        <td  style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                            {item.Remark}
                        </td>                    
                    </tr>
                ); 
            });
        }
        else{
            rtnVal.push(
                <tr>
                    <td colSpan="8" style={{ width: '100%', minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                     暂无数据
                    </td>
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
        const Record = this.props.FailureHoursRecord !== null ? this.props.FailureHoursRecord.Record : null;
        const Content = Record !== null ? Record.Content : null;
        const SignContent = Record !== null ? Record.SignContent === null ? null : `data:image/jpeg;base64,${Record.SignContent}` : null;
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
                 <div className={styles.FormName}></div>
                <table
                    className={styles.FormTable}
                >
                    <tbody>
                         <tr>
                            <td colSpan="7"  style={{ textAlign:'center',fontWeight:'bold',fontSize:16}}>
                             异常小时记录表
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan="2" style={{ width: '18%',minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        维护管理单位
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                {Content !== null ?Content.MaintenanceManagementUnit:null}
                            </td>
                            <td colSpan="1" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                        安装地点
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Content !== null ?Content.PointPosition:null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ width: '18%',minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        统计开始时间
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                {Content !== null ?Content.BeginTime:null}
                            </td>
                            <td colSpan="1" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                         统计结束时间
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Content !== null ?Content.EndTime:null}
                            </td>
                        </tr>
                        <tr>
                        <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        序号
                            </td>
                            <td style={{ width: '15%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        设备参数类别
                            </td>
                            <td style={{ width: '15%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        异常类别
                            </td>

                            <td style={{ width: '15%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        开始时间
                            </td>
                            <td style={{ width: '15%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        结束时间
                            </td>
                            <td style={{ width: '15%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        异常小时个数
                            </td>
                            <td style={{ width: '15%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        异常原因
                            </td>
                        </tr>
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null)
                        }
                        <tr>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        运行维护人员
                            </td>
                            <td colSpan="1" style={{ textAlign: 'center', fontSize: '14px' }}>
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

export default FailureHoursRecord;