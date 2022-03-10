/*
 * @Author: 贾安波
 * @Date: 2022.1.25
 * @LastEditors: 
 * @LastEditTime: 
 * @Description: 页面：比对试验结果记录表
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./ConsumablesReplaceRecordContent.less";
import MonitorContent from '../../components/MonitorContent/index';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetWaterComparisonTestRecordForPCList'],
    tableTable: task.WaterComparisonTestRecordForPCList
}))
/*
页面：比对试验结果记录表
*/
class ComparisonTestResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading:this.props.isloading
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetWaterComparisonTestRecordForPCList',
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
          let  recordList = record.filter((item)=>item.ParametersName===par);
             rtnVal=[<tr><td rowSpan={recordList.length + 1} style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>  
                       {par } 
                      </td></tr>]
            recordList.map((item, index) => {
                rtnVal.push(
                    <tr key={index}>

                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.Number}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.Unit}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.OnlineMonitoringValue}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.AlignmentMethodValue1}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.AlignmentMethodValue2}
                    </td> 
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.AlignmentMethodAvgValue}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.ErrorValue}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.IsQualified}
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
        const Content=Record!==null?Record.Content:null;;
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
                            <td colSpan="9"  style={{ textAlign:'center',fontWeight:'bold',fontSize:16}}>
                            实际水样比对试验结果记录表 
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan="2" style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                 运维单位
                            </td>
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px',minWidth: 150 }}>
                                {Content !== null ?Content.MaintenanceManagementUnit:null}
                            </td>
                            <td colSpan="2" style={{  height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                        比对试验日期
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 150 }}>
                                {Content !== null ?Content.TestTime:null}
                            </td>
                        </tr>
                        <tr>
                           <td rowSpan={2} style={{ minWidth: 150, height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                  比对项目         
                            </td>
                            <td rowSpan={2} style={{ minWidth: 150,  height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                     序号
                            </td>
                            <td  rowSpan={2} style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                   单位
                            </td>  
                            <td rowSpan={2}  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                   在线监测测定结果
                            </td>
                             <td   colSpan={2} style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                   比对方法测定结果
                            </td>      
                            <td rowSpan={2} style={{ minWidth: 150,  height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                  比对方法测定结果平均值
                            </td>
                            <td  rowSpan={2} style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                   测定误差
                            </td>  
                            <td rowSpan={2}  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                   是否合格
                            </td>                              
                         </tr>
                         <tr>
                           <td   style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                   1
                            </td> 
                            <td   style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                   2
                            </td> 
                            </tr>
                         {
                            this.renderItem(Record !== null ?Record.RecordList:null,"COD")
                        } 
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null,"NH3-N")
                        } 
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null,"TP")
                        } 
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null,"TN")
                        } 
                       {
                            this.renderItem(Record !== null ?Record.RecordList:null,"pH")
                        } 
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null,"温度")
                        } 
                        {
                             this.renderItem(Record !== null ?Record.RecordList:null,"流量")
                        }
                          <tr>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                      运行维护人员
                            </td>
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Record !== null ?Record.CreateUserID:null}
                            </td>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                     填写日期
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

export default ComparisonTestResults;