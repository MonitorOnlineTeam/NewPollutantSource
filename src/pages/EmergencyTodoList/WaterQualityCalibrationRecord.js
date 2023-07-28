/*
 * @Author: 
 * @Date: 
 * @LastEditors: 
 * @LastEditTime: 
 * @Description: 页面：水质校准记录表
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./ConsumablesReplaceRecordContent.less";
import MonitorContent from '../../components/MonitorContent/index';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetWaterCalibrationRecordForPCList'],
    waterCalibrationRecordList: task.waterCalibrationRecordList
}))
/*
页面：水质校准记录表
*/
class WaterQualityCalibrationRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading:this.props.isloading
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetWaterCalibrationRecordForPCList',
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
                        {item.FirstV}{item.FirstU}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.FirstS}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.SecondV}{item.SecondU}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.SecondS}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.ThirdV}{item.ThirdU}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.ThirdS}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.FourthV}{item.FourthU}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.FourthS}
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
                height: 'calc(100vh - 170px)'
            }
        }
        const SCREEN_HEIGHT=this.props.scrolly==="none"?{overflowY:'none'}:{height:document.querySelector('body').offsetHeight - 250};
        const Record=this.props.waterCalibrationRecordList!==null?this.props.waterCalibrationRecordList.Record:null;
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
                            <td colSpan="11"  style={{ textAlign:'center',fontWeight:'bold',fontSize:16}}>
                            水污染源自动监测仪校准记录表 
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan="2" style={{ minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        运维单位
                            </td>
                            <td colSpan="4" style={{ textAlign: 'center', fontSize: '14px',minWidth: 200 }}>
                                {Content !== null ?Content.MaintenanceManagementUnit:null}
                            </td>
                            <td colSpan="2" style={{  height: '50px', textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                        安装地点
                            </td>
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Content !== null ?Content.PointPosition:null}
                            </td>
                        </tr>
                        <tr>
                        <td rowSpan={2} style={{ minWidth: 200, height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                        仪器名称
                            </td>
                            <td rowSpan={2} style={{ minWidth: 200,  height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                        校准完成时间
                            </td>
                            <td colSpan={2} style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                        第一点
                            </td>

                            <td colSpan={2}  style={{  height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                        第二点
                            </td>
                            <td colSpan={2} style={{  height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                        第三点
                            </td>
                            <td colSpan={2} style={{  height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                        第四点
                            </td>
                            <td rowSpan={2} style={{ minWidth: 150, height: '50px', textAlign: 'center', backgroundColor: '#FFF', fontSize: '14px', fontWeight: '500' }}>
                                        是否通过
                            </td>
                        </tr>
                        <tr>
                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        标液浓度
                            </td>
                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        信号值
                            </td>
                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        标液浓度
                            </td>
                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        信号值
                            </td>
                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        标液浓度
                            </td>
                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        信号值
                            </td>
                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        标液浓度
                            </td>
                            <td  style={{ minWidth: 150, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        信号值
                            </td>                                                                                
                        </tr>
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null)
                        }
                        <tr>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        运行维护人员
                            </td>
                            <td colSpan="4" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Record !== null ?Record.CreateUserID:null}
                            </td>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        时间
                            </td>
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px', colSpan: '2' }}>
                                {Record !== null ?Record.CreateTime:null}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default WaterQualityCalibrationRecord;