/*
 * @Author: 贾安波
 * @Date: 2022.1.25
 * @LastEditors: 
 * @LastEditTime: 
 * @Description: 页面：设备参数变动记录 废水
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./ConsumablesReplaceRecordContent.less";
import MonitorContent from '../../components/MonitorContent/index';
import moment from 'moment';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetWaterParametersChangeRecordForPCList'],
    tableTable: task.WaterParametersChangeRecordForPCList
}))
/*
页面：设备参数变动记录 废水
*/
class StandardSolutionVerificationRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading:this.props.isloading
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetWaterParametersChangeRecordForPCList',
            payload: {
                TaskID: this.props.TaskID,
                TypeID: this.props.TypeID,
            },
        });
        this.setState({
            isloading: false
        });
    }

    renderItem = (record,par) => {
        let rtnVal = []

        if (record !== null && record.length > 0) {
          let  recordList = record.filter((item)=>item.ItemName===par);
           rtnVal = [<tr> <td rowSpan={recordList.length+1} style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>  {par} </td></tr>];

            recordList.map((item, index) => {
                rtnVal.push(
                    <tr key={item.Parameters}>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.Parameters}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.Befor}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.After}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.ChageTime}
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
        const Record=this.props.tableTable!==null?this.props.tableTable.Record:null;
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
                            <td colSpan="5"  style={{ textAlign:'center',fontWeight:'bold',fontSize:16}}>
                              设备参数变动记录 
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan="1" style={{ minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                统计起始时间
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                {Content !== null ?moment(Content.BeginTime).format("YYYY-MM-DD hh:00:00"):null}
                            </td>
                            <td colSpan="1" style={{  height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                        统计截止时间
                            </td>
                            <td colSpan="1" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Content !== null ? moment(Content.EndTime).format("YYYY-MM-DD hh:00:00") :null}
                            </td>
                        </tr>
                        <tr>
                           <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                  测量项目         
                            </td>
                            <td style={{ minWidth: 150,  height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                     参数
                            </td>
                            <td style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                   参数值(变更前)
                            </td>  
                            <td style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                   参数值(变更后)
                            </td>
                            <td style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                   修改日期
                            </td>                                
                         </tr>
                         {IsFlag?
                         <>
                         {
                            this.renderItem(Record !== null ?Record.RecordList:null,"COD")
                        } 
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null,"氨氮")
                        } 
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null,"总磷")
                        } 
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null,"总氮")
                        } 
                       {
                            this.renderItem(Record !== null ?Record.RecordList:null,"pH")
                        } 
                        </>
                        :
                        <tr> <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }} colSpan="5">无参数变动</td></tr>
                    }
                         <tr>
                            <td colSpan="1" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                      填写人
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Record !== null ?Record.CreateUserID:null}
                            </td>
                            <td colSpan="1" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                     填写时间
                            </td>
                            <td colSpan="1" style={{ textAlign: 'center', fontSize: '14px', colSpan: '2' }}>
                                {Record !== null ?Record.CreateTime:null}
                            </td>
                        </tr> 
                    </tbody>
                </table>
            </div>
        );
    }
}

export default StandardSolutionVerificationRecord;