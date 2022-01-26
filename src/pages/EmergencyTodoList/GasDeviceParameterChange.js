/*
 * @Author: 
 * @Date: 
 * @LastEditors: 
 * @LastEditTime: 
 * @Description: 页面：设备参数变动记录 废气
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./ConsumablesReplaceRecordContent.less";
import MonitorContent from '../../components/MonitorContent/index';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetGasParametersChangeRecordForPCList'],
    tableData: task.GasParametersChangeRecordForPCList
}))
/*
页面：设备参数变动记录 废气
*/
class GasDeviceParameterChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading:this.props.isloading
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetGasParametersChangeRecordForPCList',
            payload: {
                TaskID: this.props.TaskID,
                TypeID: this.props.TypeID,
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
                        {item.ParametersName}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.RangeAfterChange}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.RangeAfterChange}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.ChangeTime}
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
        const Record=this.props.tableData!==null?this.props.tableData.Record:null;
        const Content=Record!==null?Record.Content:null;
        const IsFlag = Record&&Record.Content&&Record.Content.IsFlag;
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
                <table
                    className={styles.FormTable}
                >
                    <tbody>
                         <tr>
                            <td colSpan="4"  style={{ textAlign:'center',fontWeight:'bold',fontSize:16}}>
                              设备参数变动记录 
                            </td>
                        </tr> 
                        <tr>
                            <td  style={{ minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px',fontWeight:'bold' }}>
                                    统计起始时间
                            </td>
                            <td  style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                 {Content !== null ?Content.BeginTime:null}
                            </td>
                            <td  style={{  height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250,fontWeight:'bold' }}>
                                       统计截止时间
                            </td>
                            <td  style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Content !== null ?Content.EndTime:null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{minWidth: 150,  height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>
                                        测量参数
                            </td>
                            <td style={{minWidth: 150, height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>
                                        量程值(变更前)
                            </td>

                            <td  style={{  minWidth: 150, textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>
                                        量程值(变更后)
                            </td>
                            <td style={{  minWidth: 150, textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>
                                        修改日期
                            </td>
                        </tr>
                        {IsFlag?
                         <>
                        {
                            this.renderItem(Record !== null ?Record.RecordList&&Record.RecordList.filter((item)=>item.PType==1):null)
                        }
                         </>
                        :
                           <tr> <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }} colSpan="4">无参数变动</td></tr>
                         }
                     <tr>
                        <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>
                                        其他参数
                            </td>
                            <td style={{minWidth: 150, height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>
                                        参数值(变更前)
                            </td>

                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>
                                        参数值(变更后)
                            </td>
                            <td style={{ minWidth: 150, height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>
                                        修改日期
                            </td>
                        </tr>
                        {IsFlag?
                         <>
                        {
                            this.renderItem(Record !== null ?Record.RecordList&&Record.RecordList.filter((item)=>item.PType==2):null)
                        }
                         </>
                        :
                           <tr> <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }} colSpan="4">无参数变动</td></tr>
                         }
                        <tr>
                            <td style={{ height: '50px', textAlign: 'center', fontSize: '14px',fontWeight:'bold' }}>
                                        填写人
                            </td>
                            <td style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Record !== null ?Record.CreateUserID:null}
                            </td>
                            <td  style={{ height: '50px', textAlign: 'center', fontSize: '14px',fontWeight:'bold' }}>
                                       填写时间
                            </td>
                            <td  style={{ textAlign: 'center', fontSize: '14px', colSpan: '2' }}>
                                {Record !== null ?Record.CreateTime:null}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default GasDeviceParameterChange;