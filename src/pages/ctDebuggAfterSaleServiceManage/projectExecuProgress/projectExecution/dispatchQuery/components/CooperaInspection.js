/*
 * @Author: jab
 * @Date: 2023-09-20
 * @LastEditors: jab
 * @LastEditTime:2023-09-20
 * @Description: 配合检查表单
 */
import React, { Component } from 'react';
import { Spin, Image } from 'antd';
import { connect } from 'dva';
import styles from "./ConsumablesReplaceRecordContent.less";
import ImageView from '@/components/ImageView';

@connect(({ dispatchQuery, loading }) => ({
    isloading: loading.effects['dispatchQuery/getCooperateRecord'],
}))
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageList: [],
            imageIndex: -1,
            isOpen: false,
        };
    }

    componentDidMount() {
    }

    render() {
        const appStyle = this.props.appStyle;
        let style = null;
        if (appStyle) {
            style = appStyle;
        }
        else {
            style = {
                height: 'calc(100vh - 90px)',
            }
        }
        const { cooperatInspectionRecordList } = this.props;
        const Content = cooperatInspectionRecordList? cooperatInspectionRecordList : null;
        console.log(Content)
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
                                {Content !== null ? Content.CooperationCompanyName : null}
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
                                {Content !== null ? Content.ProblemLevelName : null}
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
                                {Content !== null ? Content.ProjectNumberName : null}
                            </td>
                            <td colSpan="2" style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                解决方式
                            </td>
                            <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px', minWidth: 250 }}>
                                {Content !== null ? Content.SolutionName : null}
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
                        </tr>
                    </tbody>
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

export default Index;