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
                            <td colSpan="12" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                                配合检查记录表
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ width: '18%', minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                被查日期
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', minWidth: 200 }}>
                                {Content !== null ? Content.CooperationDate : null}
                            </td>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                检查单位
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.CooperationCompany : null}
                            </td>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                核查成员
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.CooperationMember : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ width: '18%', minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                被查企业名称
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', minWidth: 200 }}>
                                {Content !== null ? Content.EnterpriseName : null}
                            </td>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                被查单位备注
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.CooperationCompanyRemark : null}
                            </td>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                问题等级
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.ProblemLevel : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ width: '18%', minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                被查对象所在区域
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', minWidth: 200 }}>
                                {Content !== null ? Content.RegionName : null}
                            </td>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                被核查对象对应项目
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.ProjectNumber : null}
                            </td>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                解决方式
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.Solution : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ minWidth: 200, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                核查主题
                            </td>
                            <td colSpan="4" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.CooperationTheme : null}
                            </td>

                            <td colSpan="2" style={{ minWidth: 200, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                核查内容
                            </td>
                            <td colSpan="4" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.CooperationContent : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ minWidth: 200, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                核查发现问题
                            </td>
                            <td colSpan="4" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.DiscoverProblems : null}
                            </td>

                            <td colSpan="2" style={{ minWidth: 200, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                整改措施
                            </td>
                            <td colSpan="4" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.Rectification : null}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                遗留问题
                            </td>
                            <td colSpan="4" style={{ textAlign: 'center', fontSize: '14px', minWidth: 200 }}>
                                {Content !== null ? Content.RemainingProblems : null}
                            </td>

                            <td colSpan="2" style={{ minWidth: 250, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                重大问题汇报
                            </td>
                            <td colSpan="4" style={{ textAlign: 'center', fontSize: '14px', minWidth: 200 }}>
                                {Content !== null ? Content.MajorProblemReport : null}
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="12" style={{ height: '50px', fontSize: '14px' }}>
                                <>
                                    图片
                                    {Content !== null ? Content.PictureFilesList && Content.PictureFilesList.LowimgList.map((item,index) => {
                                    return <img
                                        width={20}
                                        height={20}
                                        style={{ marginLeft: 10, cursor: 'pointer' }}
                                        src={`/upload/${item}`}
                                        onClick={() => {
                                            this.setState({
                                                isOpen: true,
                                                imageList: Content.PictureFilesList?.LowimgList.map(item=>`/upload/${item}`),
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
                                    {Content !== null ? Content.EnclosureFilesList && Content.EnclosureFilesList.ImgList.map(item => {
                                    return <a
                                        href={`/upload/${item}`}
                                        style={{ marginLeft: 10 }}
                                        download
                                    >
                                        {item}
                                    </a>
                                })
                                        : null}
                                </>
                            </td>
                        </tr>
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