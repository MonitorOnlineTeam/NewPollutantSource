/*
 * @Author: lzp
 * @Date: 2019-08-22 09:36:43
 * @LastEditors: lzp
 * @LastEditTime: 2019-08-22 09:36:43
 * @Description: 保养项更换记录表
 */
import React, { Component } from 'react';
import { Row, Col, Layout, Table, List, Button, Icon, Spin, Card } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./MaintainRepalceRecord.less";
import MonitorContent from '../../components/MonitorContent/index';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/MaintainRecordDetail'],
    MaintainRecordDetailRecord: task.MaintainRecordDetailRecord
}))

/*
保养项更换记录表
*/

class MaintainRepalceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/MaintainRecordDetail',
            payload: {
                TaskID: this.props.TaskID
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
                        <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.DateOfChange}
                        </td>
                        <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.MaintainName}
                        </td>
                        <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.Remark}
                        </td>
                        <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.AnotherTimeOfChange}
                        </td>
                    </tr>
                );
            });
        }

        return rtnVal;
    }

    render() {
        const SCREEN_HEIGHT=this.props.scrolly==="none"?{overflowY:'none'}:{height:document.querySelector('body').offsetHeight - 250};
        const Record=this.props.MaintainRecordDetailRecord!==null?this.props.MaintainRecordDetailRecord.Record:null;
        const Content=Record!==null?Record.Content:null;
        const SignContent =Record!==null?Record.SignContent === null ? null : `data:image/jpeg;base64,${Record.SignContent}`:null;  
        // const columns = [ {
        //     title: '更换日期',
        //     dataIndex: 'DateOfChange',
        //     width: '25%',
        //     align: 'center',
        // }, {
        //     title: '标准物质名称',
        //     dataIndex: 'StandardGasName',
        //     width: '25%',
        //     align: 'center',
        // }, {
        //     title: '气体浓度',
        //     dataIndex: 'GasStrength',
        //     width: '25%',
        //     align: 'center',
        // }, {
        //     title: '单位',
        //     dataIndex: 'Unit',
        //     width: '25%',
        //     align: 'center',
        // }];
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
            <div className={styles.FormDiv} style={{height: 'calc(100vh - 200px)'}}>
                <div className={styles.FormName}>设备保养记录表</div>
                <div className={styles.HeadDiv} style={{ fontWeight: 'bold' }}>企业名称：{Content!==null ? Content.EnterpriseName:null}</div>
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
                           
                            <td colSpan="2"  style={{ width: '18%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        保养日期
                            </td>
                            <td colSpan="2"  style={{ width: '14%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        保养内容
                            </td>
                            <td colSpan="2"  style={{ width: '12%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        备注
                            </td>
                            <td colSpan="2"  style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        下次保养日期
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
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', colSpan: '2' }}>
                                {Record !== null ?Record.CreateTime:null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="8" style={{ width: '18%', height: '50px', fontSize: '14px', paddingLeft: 15 }}>
                                        注：更换保养项时应及时记录，每半年汇总存档。
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td style={{ width: '87%', height: '50px', textAlign: 'right', border: '0', fontWeight: 'bold' }}>负责人签名：</td>
                            <td style={{ width: '13%', height: '50px', border: '0' }}>
                                {
                                    SignContent === null ? null : <img style={{ width: '80%', height: '110%' }} src={SignContent} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '87%', height: '50px', textAlign: 'right', border: '0', fontWeight: 'bold' }}>签名时间：</td>
                            <td style={{ width: '13%', height: '50px', border: '0' }}>{Record !== null ?Record.SignTime:null}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default MaintainRepalceRecord;
