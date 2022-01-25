/*
 * @Author: 
 * @Date: 
 * @LastEditors: 
 * @LastEditTime: 
 * @Description: 页面：标准溶液核查记录表
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./ConsumablesReplaceRecordContent.less";
import MonitorContent from '../../components/MonitorContent/index';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetWaterCheckRecordRecordForPCList'],
    tableTable: task.WaterCheckRecordRecordForPCList
}))
/*
页面：标准溶液核查记录表
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
            type: 'task/GetWaterCheckRecordRecordForPCList',
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
                    <tr key={item.AnalyzerName}>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.AnalyzerName}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.CompletionTime}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.Concentration}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.Result}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.IsQualified==1?'是': item.IsQualified==0? '否' : ''}
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
                             校准溶液核实记录 
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan="1" style={{ minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        运维单位
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                {Content !== null ?Content.MaintenanceManagementUnit:null}
                            </td>
                            <td colSpan="1" style={{  height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                        安装地点
                            </td>
                            <td colSpan="1" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Content !== null ?Content.PointPosition:null}
                            </td>
                        </tr>
                        <tr>
                        <td rowSpan={2} style={{ minWidth: 200, height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                        仪器名称
                            </td>
                            <td rowSpan={2} style={{ minWidth: 200,  height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                        核查完成时间
                            </td>
                            <td colSpan={3} style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        标样核查情况
                            </td>  
                        </tr>
                        <tr>
                           <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                       标准溶液浓度
                            </td>
                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        仪器测量结果
                            </td> 
                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        是否合格
                            </td>  
                        </tr>
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null)
                        }
                        <tr>
                            <td colSpan="1" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        运行维护人员
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Record !== null ?Record.CreateUserID:null}
                            </td>
                            <td colSpan="1" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        时间
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