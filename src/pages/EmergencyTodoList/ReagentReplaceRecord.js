/*
 * @Author: jab
 * @Date: 2021-11-25
 * @LastEditors: jab
 * @LastEditTime: 2021-11-25
 * @Description: 试剂更换表单
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./ConsumablesReplaceRecordContent.less";
import MonitorContent from '../../components/MonitorContent/index';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetStandardLiquidRepalceRecordList'],
    RepalceRecordList: task.RepalceRecordList
}))
/*
页面：试剂更换表单
*/
class RepalceRecordList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading:this.props.isloading
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetStandardLiquidRepalceRecordList',
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
                        { index + 1 }
                    </td>
                    {/* <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.EquipmentName}
                    </td> */}
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.InventoryCode}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.StandardLiquidName}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.LiquidStrength}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.Unit}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.Num}
                    </td>
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                        {item.ReplaceDate}
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
        const Record=this.props.RepalceRecordList!==null?this.props.RepalceRecordList.Record:null;
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
                {/* <div className={styles.FormName}>试剂更换记录表</div> */}
                <div className={styles.FormName}></div>
                <table
                    className={styles.FormTable}
                >
                    <tbody>
                          <tr>
                            <td colSpan="9"  style={{ textAlign:'center',fontWeight:'bold',fontSize:16}}>
                                 试剂更换记录表
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
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px',minWidth: 250 }}>
                                {Content !== null ?Content.PointPosition:null}
                            </td>
                        </tr>
                        <tr>
                        <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        序号
                            </td>
                            {/* <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        设备名称
                            </td> */}
                            <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        存货编号
                            </td>

                            <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        试剂名称
                            </td>
                            <td style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        规格型号
                            </td>
                            <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        单位
                            </td>
                            <td style={{ width: '8%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        数量
                            </td>
                            <td style={{ width: '16%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        更换日期
                            </td>
                            <td style={{ width: '20%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        有效日期
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
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px', colSpan: '2' }}>
                                {Record !== null ?Record.CreateTime:null}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className={styles.FormTable} style={{height: '50px'}}>
                </table>
            </div>
        );
    }
}

export default RepalceRecordList;