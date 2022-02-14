/*
 * @Author: lzp
 * @Date: 2022-02-14
 * @LastEditors: lzp
 * @LastEditTime: 2022-02-14
 * @Description: 质控记录表
 */
import React, { Component } from 'react';
import { Row, Col, Layout, Table, List, Button, Spin, Card } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./MaintainRepalceRecord.less";
import MonitorContent from '../../components/MonitorContent/index';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/MaintainRecordDetail'],
    MaintainRecordDetailRecord: task.MaintainRecordDetailRecord
}))

/*
质控记录表
*/

class QualityControlRecordContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/MaintainRecordDetail',
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
                       <td colSpan="1" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {index+1}
                        </td>
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
        const Record=this.props.MaintainRecordDetailRecord!==null?this.props.MaintainRecordDetailRecord.Record:null;
        const Content=Record!==null?Record.Content:null;
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
                <div className={styles.FormName}>质控记录表</div>
                <div className={styles.HeadDiv} style={{ fontWeight: 'bold' }}>企业名称：{Content!==null ? Content.EnterpriseName:null}</div>
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        维护管理单位
                            </td>
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px' }}>
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
                          <td colSpan="1"  style={{ width: '18%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        序号
                            </td> 
                            <td colSpan="2"  style={{ width: '18%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        监测因子
                            </td>
                            <td colSpan="2"  style={{ width: '14%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        质控类型
                            </td>
                            <td colSpan="2"  style={{ width: '12%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        相对误差
                            </td>
                            <td colSpan="2"  style={{ width: '10%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        是否合格
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
            </div>
        );
    }
}

export default QualityControlRecordContent;
