import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import styles from "./DeviceExceptionRecordContent.less";

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetDeviceExceptionRecord'],
    ExceptionRecord: task.ExceptionRecord
}))
class DeviceExceptionRecordContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetDeviceExceptionRecord',
            payload: {
                TaskID: this.props.TaskID
            }
        });

        this.setState({
            loading: false
        });
    }

    render() {
        const {pointName}=this.props;
        const SCREEN_HEIGHT=this.props.scrolly==="none"?{overflowY:'none'}:{height:document.querySelector('body').offsetHeight - 250};
        const Record = this.props.ExceptionRecord!==null?this.props.ExceptionRecord.Record:null;
        const Content=Record!==null?Record.Content:null;
        let SignContent =Record!==null?Record.SignContent === null ? null : `data:image/jpeg;base64,${Record.SignContent}`:null;
        console.log('Record-',Record)
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
            <div className={styles.FormDiv} style={SCREEN_HEIGHT}>
                <div className={styles.FormName}>CEMS设备数据异常记录表</div>
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        站点名称
                            </td>
                            <td style={{ width: '30%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                {pointName}
                            </td>
                            <td style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        设备名称
                            </td>
                            <td style={{ width: '30%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                {Content!==null?Content.DeviceName:null}
                            </td>
                        </tr>
                        <tr>
                            <td rowSpan="3" style={{ height: '100px', textAlign: 'center', fontSize: '14px' }}>
                                        数据异常
                            </td>
                            <td style={{ height: '100px', textAlign: 'center', fontSize: '14px' }}>
                                        异常状况
                            </td>
                            <td colSpan="2" style={{ height: '100px', textAlign: 'center', fontSize: '14px' }}>
                                {Record && (Record.RecordList!==null?Record.RecordList[0].ExceptionStatus:null)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ height: '100px', textAlign: 'center', fontSize: '14px' }}>
                                        异常原因
                            </td>
                            <td colSpan="2" style={{ height: '100px', textAlign: 'center', fontSize: '14px' }}>
                                {Record && (Record.RecordList!==null?Record.RecordList[0].ExceptionReason:null)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ height: '100px', textAlign: 'center', fontSize: '14px' }}>
                                        处理情况
                            </td>
                            <td colSpan="2" style={{ height: '100px', textAlign: 'center', fontSize: '14px' }}>
                                {Record && (Record.RecordList!==null?Record.RecordList[0].DealingSituations:null)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '30%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        是否正常恢复运行
                            </td>
                            <td colSpan="3" style={{ width: '30%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                {Record && (Record.RecordList!==null?Record.RecordList[0].IsOk=== 1 ? '是' : '否':null)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        维护人
                            </td>
                            <td style={{ width: '30%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                {Record && (Record.CreateUserID!==null?Record.CreateUserID:null)}
                            </td>
                            <td style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        维护时间
                            </td>
                            <td style={{ width: '30%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                {Record && (Record.CreateTime!==null?Record.CreateTime:null)}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td style={{ width: '87%', height: '50px', textAlign: 'right', border: '0', fontWeight: 'bold' }}>负责人签名：</td>
                            <td style={{ width: '13%', height: '50px', border: '0' }}>{SignContent === null ? null : <img style={{ width: '80%', height: '110%' }} src={SignContent} />}</td>
                        </tr>
                        <tr>
                            <td style={{ width: '87%', height: '50px', textAlign: 'right', border: '0', fontWeight: 'bold' }}>签名时间：</td>
                            <td style={{ width: '13%', height: '50px', border: '0',minWidth: 120 }}>{Record && (Record.SignTime!==null?Record.SignTime:null)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default DeviceExceptionRecordContent;
