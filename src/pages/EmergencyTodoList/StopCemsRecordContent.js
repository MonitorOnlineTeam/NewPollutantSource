/*
 * @Author: lzp
 * @Date: 2019-08-22 09:36:43
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:29:14
 * @Description: 停机记录表
 */
import React, { Component } from 'react';
import { Spin} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MonitorContent from '../../components/MonitorContent/index';
import styles from "./StopCemsRecordContent.less";

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetStopCemsRecord'],
    StopCemsRecord: task.StopCemsRecord
}))
class StopCemsRecordContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetStopCemsRecord',
            payload: {
                TaskID: this.props.TaskID,
                TypeID: this.props.TypeID,
            }
        });

        this.setState({
            isloading: false
        });
    }

    renderItem = (Record) => {
        const rtnVal = [];
        if (Record !== null && Record.length > 0) {
            Record.map((item, index) => {
                rtnVal.push(
                    <tr key={index}>
                        <td style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {index + 1}
                        </td>
                        <td style={{ width: '25%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.BeginTime}
                        </td>
                        <td style={{ width: '25%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.EndTime}
                        </td>
                        <td style={{ width: '32%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                            {item.ChangeSpareparts}
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
        const Record=this.props.StopCemsRecord!==null?this.props.StopCemsRecord.Record:null;
        const Content=Record!==null?Record.Content:null;
        const SignContent =Record!==null?Record.SignContent === null ? null : `data:image/jpeg;base64,${Record.SignContent}`:null;
        const scrolly=this.props.scrolly!==undefined?this.props.scrolly:'scroll';
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
                <div className={styles.FormName}>CEMS停机记录表</div>
                <div className={styles.HeadDiv} style={{ fontWeight: 'bold' }}>企业名称：{Content!==null ? Content.EnterpriseName:null}</div>
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        安装地点
                            </td>
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Content!==null ? Content.PointPosition:null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '18%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        序号
                            </td>
                            <td style={{ width: '25%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        停机开始时间
                            </td>
                            <td style={{ width: '25%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        停机结束时间
                            </td>
                            <td style={{ width: '32%', height: '50px', textAlign: 'center', backgroundColor: '#FAFAFA', fontSize: '14px', fontWeight: '600' }}>
                                        停机原因
                            </td>
                        </tr>
                        {
                            this.renderItem(Record !== null ?Record.RecordList:null)
                        }
                        <tr>
                            <td style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        停机情况总结
                            </td>
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Content!==null ? Content.StopSummary:null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        停机人
                            </td>
                            <td style={{ width: '25%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                {Record !== null ?Record.CreateUserID:null}
                            </td>
                            <td style={{ width: '25%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        时间
                            </td>
                            <td style={{ width: '32%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                {Record !== null ?Record.CreateTime:null}
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
export default StopCemsRecordContent;