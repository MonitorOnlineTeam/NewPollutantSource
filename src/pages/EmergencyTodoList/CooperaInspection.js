/*
 * @Author: jab
 * @Date: 2021-12-03
 * @LastEditors: jab
 * @LastEditTime: 2021-12-03
 * @Description: 配合检查表单
 */
import React, { Component } from 'react';
import { Spin, Image } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./ConsumablesReplaceRecordContent.less";
import MonitorContent from '../../components/MonitorContent/index';
import ImageView from '@/components/ImageView';
import index from '@/components/YearPicker';
import config from '@/config';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetCooperationInspectionRecordList'],
    cooperatInspectionRecordList: task.cooperatInspectionRecordList
}))
/*
页面：配合检查表单
*/
class RepalceRecordList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading: this.props.isloading,
            imageList: [],
            imageIndex: -1,
            isOpen: false,
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetCooperationInspectionRecordList',
            payload: {
                TaskID: this.props.TaskID,
                TypeID: this.props.TypeID,
            },
        });
        this.setState({
            isloading: false
        });
    }

    // renderItem = (record) => {
    //     const rtnVal = [];
    //     if (record !== null && record.length > 0) {
    //         record.map((item, index) => {
    //             rtnVal.push(
    //                 <tr key={index}>
    //                 <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
    //                     { index + 1 }
    //                 </td>
    //                 <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
    //                     {item.EquipmentName}
    //                 </td>
    //                 <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
    //                     {item.InventoryCode}
    //                 </td>
    //                 <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
    //                     {item.StandardLiquidName}
    //                 </td>
    //                 <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
    //                     {item.LiquidStrength}
    //                 </td>
    //                 <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
    //                     {item.Unit}
    //                 </td>
    //                 <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
    //                     {item.Num}
    //                 </td>
    //                 <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
    //                     {item.ReplaceDate}
    //                 </td>
    //                 <td style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
    //                     {item.AnotherTimeOfChange}
    //                 </td>
    //             </tr>
    //             );
    //         });
    //     }

    //     return rtnVal;
    // }

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
        const SCREEN_HEIGHT = this.props.scrolly === "none" ? { overflowY: 'none' } : { height: document.querySelector('body').offsetHeight - 250 };
        const Record = this.props.cooperatInspectionRecordList !== null ? this.props.cooperatInspectionRecordList.Record : null;
        const Content = Record !== null ? Record.RecordList[0] : null;
        const SignContent = Record !== null ? Record.SignContent === null ? null : `data:image/jpeg;base64,${Record.SignContent}` : null;
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
                            <td colSpan="4" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                              配合检查记录表
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center' }}>
                                检查日期
                            </td>
                            <td>
                                {Content !== null ? Content.CooperationDate : null}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                行业类型
                            </td>
                            <td >
                                {Content !== null ? Content.ProjectNumber : null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center' }}>
                                检查属性
                            </td>
                            <td>
                                {Content !== null ? Content.CooperationCompany : null}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                检查属性其他说明
                            </td>
                            <td>
                                {Content !== null ? Content.CooperationCompanyRemark : null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center' }}>
                                检查单位
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.InspectionUnit : null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center' }}>
                                检查成员
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.CooperationMember : null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center' }}>
                                检查主题
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.CooperationTheme : null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center' }}>
                                被检查企业省/直辖市
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.RegionName : null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center', }}>
                                被检查企业名称
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.EnterpriseName : null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center' }}>
                                被检查企业点位
                            </td>
                            <td colSpan="3">
                                {Record?.Content?.PointPosition || null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center' }}>
                                检查内容
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.CooperationContent : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="1" style={{ textAlign: 'center' }}>
                                核查发现问题
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.DiscoverProblems : null}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center' }}>
                                问题等级
                            </td>
                            <td >
                                {Content !== null ? Content.ProblemLevel : null}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                解决方式
                            </td>
                            <td>
                                {Content !== null ? Content.Solution : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="1" style={{ textAlign: 'center' }}>
                                遗留问题
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.RemainingProblems : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="1" style={{ textAlign: 'center' }}>
                                整改措施
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.Rectification : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="1" style={{ textAlign: 'center' }}>
                                是否上报主管领导
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.IsReportLeader : null}
                            </td>
                        </tr>
                        <tr>

                            <td colSpan="1" style={{ textAlign: 'center' }}>
                                重大问题汇报
                            </td>
                            <td colSpan="3">
                                {Content !== null ? Content.MajorProblemReport : null}
                            </td>
                        </tr>

                        {/* <tr>
                            <td colSpan="12" style={{ height: '50px', fontSize: '14px' }}>
                                <>
                                    图片
                                    {Content !== null ? Content.PictureFilesList && Content.PictureFilesList.ImgList && Content.PictureFilesList.ImgList.map((item,index) => {
                                    return <img
                                        width={20}
                                        height={20}
                                        style={{ marginLeft: 10, cursor: 'pointer' }}
                                        src={`/${item}`}
                                        onClick={() => {
                                            this.setState({
                                                isOpen: true,
                                                imageList: Content.PictureFilesList.ImgList.map(item=>`/${item}`),
                                                imageIndex:index,
                                            })
                                        }}
                                    />
                                })
                                        : null}
                                </>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="12" style={{ fontSize: '14px' }}>
                                <>
                                    附件
                                    {Content !== null ? Content.EnclosureFilesList && Content.EnclosureFilesList.ImgList.map((item,index) => {
                                    return <a
                                        href={`/${item}`}
                                        style={{ marginLeft: 10 }}
                                        download
                                    >
                                        {Content.EnclosureFilesList?.ImgNameList?.[0]? Content.EnclosureFilesList.ImgNameList[index] : '附件.pdf'}
                                    </a>
                                })
                                        : null}
                                </>
                            </td>
                        </tr> */}
                    </tbody>
                </table>
                <table className={styles.FormTable} style={{ height: '50px' }}>
                </table>
                {/* 查看附件弹窗 */}
                <ImageView
                    isOpen={this.state.isOpen}
                    images={this.state.imageList}
                    imageIndex={this.state.imageIndex}
                    onCloseRequest={() => {
                        this.setState({ isOpen: false })
                    }}
                />
            </div>
        );
    }
}

export default RepalceRecordList;