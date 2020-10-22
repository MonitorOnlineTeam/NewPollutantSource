/**
 * 功  能：停运记录
 * 创建人：胡孟弟
 * 创建时间：2020.10.22
 */
import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Checkbox, Row, Col, Radio, Select, DatePicker, Empty, message, Tabs, Modal,Icon } from 'antd'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from "dva";
import ReactEcharts from 'echarts-for-react';
import moment from 'moment'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'

import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading'
import { routerRedux } from 'dva/router';
import { Right } from '@/utils/icon';
import style from '@/pages/dataSearch/tableClass.less'
const { Option } = Select;
const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;

const pageUrl = {
    getRegions: 'autoForm/getRegions',
    GetEntByRegion:'exceedDataAlarmModel/GetEntByRegion',
    GetPointByEntCode:'StopRecordModel/GetPointByEntCode'
}
@connect(({ loading, autoForm, enterpriseMonitoringModel ,exceedDataAlarmModel,StopRecordModel}) => ({
    loading: loading.effects["enterpriseMonitoringModel/GetEntSummary"],
    regionList: autoForm.regionList,
    attention: enterpriseMonitoringModel.attention,
    total: StopRecordModel.total,
    PageSize: StopRecordModel.PageSize,
    PageIndex: StopRecordModel.PageIndex,
    priseList: exceedDataAlarmModel.priseList,
    PointByEntList:StopRecordModel.PointByEntList
}))
class index extends PureComponent {
    constructor(props) {
        super(props);
        this.newTabIndex = 0
        this.state = {
            Begintime: [moment().add(-24, "hour"), moment()],
            Endtime: [moment().add(-24, "hour"), moment()],
            regionValue: '',
            attentionValue: '',
            outletValue: '',
            entValue:'',
            voucher:'',
            pointValue:''
        };
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        //获取行政区列表
        this.props.dispatch({
            type: pageUrl.getRegions,
            payload: {
                PointMark: '2',
                RegionCode: ''
            },
        });
        this.props.dispatch({
            //获取企业列表
            type: pageUrl.GetEntByRegion,
            payload: { RegionCode: '' },
        });
    };


    // 导出
    exportReport = () => {
    }

    //查询数据
    getChartAndTableData =()=>{

    }
    //行政区
    children = () => {
        const { regionList } = this.props;
        const selectList = [];
        if (regionList.length > 0) {
            regionList[0].children.map(item => {
                selectList.push(
                    <Option key={item.key} value={item.value} title={item.title}>
                        {item.title}
                    </Option>,
                );
            });
            return selectList;
        }
    };
    //关注度
    attention = () => {
        const { attention } = this.props;
        const selectList = [];
        if (attention.length > 0) {
            attention.map(item => {
                selectList.push(
                    <Option key={item.AttentionCode} value={item.AttentionCode} title={item.AttentionName}>
                        {item.AttentionName}
                    </Option>,
                );
            });
            return selectList;
        }
    }
    //获取企业列表
    entList = () => {
        const { priseList } = this.props;
        const selectList = [];
        if (priseList.length > 0) {
            priseList.map(item => {
                selectList.push(
                    <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
                        {item.EntName}
                    </Option>,
                );
            });
            return selectList;
        }
    };

    //获取监测点
    PointByEntList = () => {
        const { PointByEntList } = this.props;
        console.log(PointByEntList)
        const selectList = [];
        // if (PointByEntList.length > 0) {
        //     PointByEntList.map(item => {
        //         selectList.push(
        //             <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
        //                 {item.EntName}
        //             </Option>,
        //         );
        //     });
        //     return selectList;
        // }
    };
    cardTitle = () => {
        const { Begintime,Endtime} = this.state;

        return (
            <>
                <label>停运开始时间:</label><RangePicker_ onRef={this.onRef1} isVerification={true} dateValue={Begintime} style={{ width: 400, minWidth: '200px', marginRight: 10,marginRight: 10 }} callback={
                    (dates, dataType) => {
                        this.setState({
                            Begintime: dates
                        })
                    }
                } />
                <label>停运结束时间:</label><RangePicker_ onRef={this.onRef1} isVerification={true} dateValue={Endtime} style={{ width: 400, minWidth: '200px', marginRight: 10,marginRight: 10 }} callback={
                    (dates, dataType) => {
                        this.setState({
                            Endtime: dates
                        })
                    }
                } />
                
                <div style={{ marginTop: 10 }}>
                    <label>行政区:</label><Select
                        allowClear
                        showSearch
                        style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                        placeholder="行政区"
                        maxTagCount={2}
                        maxTagTextLength={5}
                        maxTagPlaceholder="..."
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            if (option && option.props && option.props.title) {
                                return option.props.title === input || option.props.title.indexOf(input) !== -1
                            } else {
                                return true
                            }
                        }}
                        onChange={(value) => {
                            this.setState({
                                regionValue: value
                            })
                        }}>
                        {this.children()}
                    </Select>
                   
                    <label>企业列表:</label><Select
                        allowClear
                        style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                        placeholder="企业列表"
                        maxTagCount={2}
                        maxTagTextLength={5}
                        defaultValue={this.state.entType}
                        maxTagPlaceholder="..."
                        onChange={(value) => {
                            //获取监测点
                            this.props.dispatch({
                                type: pageUrl.GetPointByEntCode,
                                payload: {
                                    EntCode:value
                                },
                            });
                            this.setState({
                                pointValue: value,
                            })
                        }}>
                        {this.entList()}
                    </Select>
                    <label>监测点:</label><Select
                        allowClear
                        style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                        placeholder="监测点列表"
                        maxTagCount={2}
                        maxTagTextLength={5}
                        defaultValue={this.state.entType}
                        maxTagPlaceholder="..."
                        onChange={(value) => {
                            this.setState({
                                entValue: value,
                            })
                        }}>
                        {this.PointByEntList()}
                    </Select>
                    <label>凭证状态:</label><Select
                        allowClear
                        style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                        placeholder="凭证状态"
                        onChange={(value) => {
                            this.setState({
                                voucher: value,
                            })
                        }}>
                        <Option value='1'>有凭证</Option>
                        <Option value='0'>缺失凭证</Option>
                    </Select>
                    <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
                    <Button style={{ marginRight: 10 }} onClick={this.exportReport}><Icon type="export" />导出</Button>
                </div>
            </>
        )
    }

    onChange = (PageIndex, PageSize) => {

    }

    pageContent = () => {
        const { attentionSummaryList } = this.props
        const fixed = false
        const columns = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'regionName',
                key: 'regionName',
            },
            {
                title: "企业名称",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'entName',
                key: 'entName',
            },
            {
                title: "监测点名称",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'pointName',
                key: 'pointName',
            },
            {
                title: "排口类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'entType',
                key: 'entType',
            },
            {
                title: "停运开始时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'stopBeginTime',
                key: 'stopBeginTime',
            },
            {
                title: "停运结束时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'stopEndTime',
                key: 'stopEndTime',
            },
            {
                title: "停运时长",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'stopDuratoin',
                key: 'stopDuratoin',
            },
            {
                title: "停运描述",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'stopDes',
                key: 'stopDes',
            },
            {
                title: "凭证",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'vouche',
                key: 'vouche',
            },
            {
                title: "创建人",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'creator',
                key: 'creator',
            },
            {
                title: "创建时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'creationTime',
                key: 'creationTime',
            },
        ]

        let arr = [
            {
                regionName:'第一师',
                entName:'阿拉尔艾特克有限公司',
                pointName:'出口',
                entType:'废水',
                stopBeginTime:'2020-09-11 19:12:00',
                stopEndTime:'2020-09-12 14:11:11',
                stopDuratoin:3,
                stopDes:'止料',
                vouche:'查看',
                creator:'小王',
                creationTime:'2020-09-20 12:12:11'
            },
            {
                regionName:'第一师',
                entName:'阿拉尔艾特克有限公司',
                pointName:'出口',
                entType:'废水',
                stopBeginTime:'2020-09-11 19:12:00',
                stopEndTime:'2020-09-12 14:11:11',
                stopDuratoin:3,
                stopDes:'停运,开机',
                vouche:'查看',
                creator:'小王',
                creationTime:'2020-09-20 12:12:11'
            },
        ]

        return <>{
            <SdlTable columns={columns} dataSource={arr}
                // pagination={{
                //     showSizeChanger: true,
                //     showQuickJumper: true,
                //     pageSize: this.props.pageSize,
                //     current: this.props.PageIndex,
                //     onChange: this.onChange,
                //     pageSizeOptions: ['20', '30', '40', '100'],
                //     total: this.props.total,
                // }} 
                pagination={
                    false
                }
            />
        }
        </>
        //
    }
    render() {
        const { loading,priseList } = this.props
        return (
            <>
                <div id="siteParamsPage" className={{}}>
                    <BreadcrumbWrapper title="停运记录">
                        <Card
                            title={this.cardTitle()}
                            extra={
                                <>
                                </>
                            }
                            className={style.dataTable}
                        >

                            {loading ? <PageLoading /> : this.pageContent()}
                        </Card>
                    </BreadcrumbWrapper>
                </div>
            </>
        );
    }
}

export default index;

