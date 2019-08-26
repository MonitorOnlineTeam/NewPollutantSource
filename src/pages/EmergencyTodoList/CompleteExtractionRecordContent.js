import React, { Component } from 'react';
import { Button, Icon, Spin, Card } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./CompleteExtractionRecordContent.less";
import MonitorContent from '../../components/MonitorContent/index';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetPatrolRecord'],
    PatrolRecord: task.PatrolRecord
}))

/*
页面：完全抽取法CEMS日常巡检记录表
*/

class CompleteExtractionRecordContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.onChange();
        this.setState({
            isloading: false
        });
    }

    onChange = () => {
        this.props.dispatch({
            type: 'task/GetPatrolRecord',
            payload: {
                TaskID: this.props.TaskID
            },
        });
    }

    renderItem = (Repair) => {
        const remark = [];
        let childIDarray = [];
        let flag = 0;
        if (Repair !== null) {
            if (Repair.Content!== null) {
                remark.push(
                    Repair.Content.Remark1,Repair.Content.Remark2,Repair.Content.Remark3,
                    Repair.Content.Remark4,Repair.Content.Remark5,Repair.Content.Remark6,
                    Repair.Content.Remark7
                );
            }

            const rtnValChild = [];
            if (Repair.RecordList !== null && Repair.RecordList.length > 0) {
                Repair.RecordList.map((items, index) => {
                    if (items.count !== 0) {
                        rtnValChild.push(
                            <tr key={index}>
                                <td rowSpan={items.count} style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                    {items.parentName}
                                </td>
                                <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                    {items.childName}
                                </td>
                                <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                    {items.MintenanceDescription}
                                </td>
                                <td rowSpan={items.count} style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                    {remark[index]}
                                </td>
                            </tr>
                        );
                    } else {
                        Repair.RecordList.map((itemss, indexs) => {
                            if (itemss.parentId === items.parentId) {
                                if (itemss.count === 0) {
                                    if (childIDarray !== null) {
                                        childIDarray.map((itemsss, indexss) => {
                                            if (itemss.childID === itemsss) {
                                                flag = 1;
                                            }
                                        });
                                        if (flag === 0) {
                                            rtnValChild.push(
                                                <tr key={`${indexs}a`}>
                                                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                                        {itemss.childName}
                                                    </td>
                                                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                                        {itemss.MintenanceDescription}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    } else {
                                        rtnValChild.push(
                                            <tr key={`${indexs}b`}>
                                                <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                                    {itemss.childName}
                                                </td>
                                                <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                                    {itemss.MintenanceDescription}
                                                </td>
                                            </tr>
                                        );
                                    }
                                    childIDarray.push(itemss.childID);
                                }
                            }
                            flag = 0;
                        });
                    }
                });
            }
            if (rtnValChild.length === 0) {
                rtnValChild.push(
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }} />
                );
            }
            return rtnValChild;
        }
    }

    renderItemChild = (id, item) => {
        let rtnValChildren = '';
        if (item !== null && item.length > 0) {
            item.map((items, index) => {
                if (items.parentId === id) {
                    if (items.count === 0) {
                        rtnValChildren.push(
                            <tr key={index}>
                                <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                    {item.childName}
                                </td>
                            </tr>
                        );
                    }
                }
            });
        }
        if (rtnValChildren.length === 0) {
            rtnValChildren.push(
                <tr key="0">
                    <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }} />
                </tr>
            );
        }
        return rtnValChildren;
    }

    render() {
        const SCREEN_HEIGHT=this.props.scrolly==="none"?{overflowY:'none'}:{height:document.querySelector('body').offsetHeight - 250};
        const Record=this.props.PatrolRecord!==null?this.props.PatrolRecord.Record:null;
        const Content=Record!==null?Record.Content:null;
        let SignContent =Record!==null?Record.SignContent === null ? null : `data:image/jpeg;base64,${Record.SignContent}`:null;

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
                <div className={styles.FormName}>完全抽取法CEMS日常巡检记录表</div>
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td style={{ width: '50%',minWidth: 450, height: '50px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', border: 0 }}>企业名称：{Content!==null?Content.EnterpriseName:null}</td>
                            <td style={{ width: '50%',minWidth: 500, height: '50px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', border: 0 }}> 巡检日期：{Content!==null?Content.PatrolDate:null}</td>
                        </tr>
                    </tbody>
                </table>
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td style={{ width: '50%',minWidth: 450, height: '50px', textAlign: 'left', fontSize: '14px' }}>{Content!==null?Content.GasCemsEquipmentManufacturer:null}</td>
                            <td style={{ width: '50%',minWidth: 500, height: '50px', textAlign: 'left', fontSize: '14px' }}>{Content!==null?Content.GasCemsCode:null}</td>
                        </tr>
                        <tr>
                            <td style={{ width: '50%',minWidth: 450, height: '50px', textAlign: 'left', fontSize: '14px' }}>{Content!==null?Content.KlwCemsEquipmentManufacturer:null}</td>
                            <td style={{ width: '50%',minWidth: 500, height: '50px', textAlign: 'left', fontSize: '14px' }}>{Content!==null?Content.KlwCemsCode:null}</td>
                        </tr>
                        <tr>
                            <td style={{ width: '50%',minWidth: 450, height: '50px', textAlign: 'left', fontSize: '14px' }}>{Content!==null?Content.PointPosition:null}</td>
                            <td style={{ width: '50%',minWidth: 500, height: '50px', textAlign: 'left', fontSize: '14px' }}>{Content!==null?Content.MaintenanceManagementUnit:null}</td>
                        </tr>
                    </tbody>
                </table>
                <div className={styles.HeadDiv} style={{ fontWeight: 'bold' }}>运行维护内容及处理说明：</div>
                <table

                    className={styles.FormTable}
                >
                    <tbody>
                        <tr>
                            <td style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 200 }}>项目</td>
                            <td style={{ width: '40%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 350 }}>内容</td>
                            <td style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 200 }}>维护情况</td>
                            <td style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 200 }}>备注</td>
                        </tr>
                        {
                            this.renderItem(Record)
                        }
                        <tr>
                            <td style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        异常情况处理
                            </td>
                            <td colSpan="3" style={{ textAlign: 'center', fontSize: '14px' }}>
                                {Content!==null?Content.ExceptionHandling:null}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className={styles.FormTable}>
                    <tbody>
                        <tr>
                            <td style={{ width: '87%', minWidth: 800,height: '50px', textAlign: 'right', border: '0', fontWeight: 'bold' }}>负责人签名：</td>
                            <td style={{ width: '13%', height: '50px', border: '0' }}>
                                {
                                    SignContent === null ? null : <img style={{ width: '80%', height: '110%' }} src={SignContent} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '87%', minWidth: 800,height: '50px', textAlign: 'right', border: '0', fontWeight: 'bold' }}>签名时间：</td>
                            <td style={{ width: '13%', height: '50px', border: '0' , minWidth: 150}}>{Record!==null?Record.SignTime:null}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default CompleteExtractionRecordContent;
