/**
 * 功  能：超标数据报警核实记录查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.19
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
    GetAttentionDegreeList: 'enterpriseMonitoringModel/GetAttentionDegreeList',
    getRegions: 'autoForm/getRegions',
    GetEntByRegion:'exceedDataAlarmModel/GetEntByRegion',
}
@connect(({ loading, autoForm, enterpriseMonitoringModel ,exceedDataAlarmModel}) => ({
    loading: loading.effects["enterpriseMonitoringModel/GetEntSummary"],
    regionList: autoForm.regionList,
    attention: enterpriseMonitoringModel.attention,
    total: enterpriseMonitoringModel.total,
    PageSize: enterpriseMonitoringModel.PageSize,
    PageIndex: enterpriseMonitoringModel.PageIndex,
    priseList: exceedDataAlarmModel.priseList,
}))
class index extends PureComponent {
    constructor(props) {
        super(props);
        this.newTabIndex = 0
        this.state = {
            time: [moment().add(-24, "hour"), moment()],
            regionValue: '',
            attentionValue: '',
            outletValue: '',
            entValue:''
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
        //获取关注度列表
        this.props.dispatch({
            type: pageUrl.GetAttentionDegreeList,
            payload: {},
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
    //年份
    yearList = ()=>{
        let year = new Date().getFullYear()
        const option = []
        for(let i = 0; i < 10;i++)
        {
            option.push(
                <Option key={year} value={year}>
                {year}
                </Option>
            )
            year--;
        }
        return option
    }
    cardTitle = () => {
        const { time} = this.state;

        return (
            <>
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
                <label>关注度:</label><Select
                    allowClear
                    style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                    placeholder="关注度"
                    maxTagCount={2}
                    maxTagTextLength={5}
                    maxTagPlaceholder="..."
                    onChange={(value) => {
                        this.setState({
                            attentionValue: value,
                        })
                    }}>
                    {this.attention()}
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
                        this.setState({
                            entValue: value,
                        })
                    }}>
                    {this.entList()}
                </Select>
                <div style={{marginTop:10}}>
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
                        {this.entList()}
                    </Select>
                    <label>监测时间:</label> <Select
                     placeholder="监测时间列表"
                     style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                    >
                        {this.yearList()}
                    </Select>

                    <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
                    <Button style={{ marginRight: 10 }} onClick={this.exportReport}><Icon type="export" />导出</Button>
                    <span style={{fontSize:14,color:'red'}}>排放量为日均值*日流量</span>
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
                title: "监测时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'moniTime',
                key: 'moniTime',
            },
            {
                title: "COD",
                width: 100,
                align: 'center',
                fixed: fixed,
                children:[
                    {
                        title: "平均值(mg/L)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'CODAvg',
                        key: 'CODAvg',
                    },
                    {
                        title: "排放量(Kg)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'CODkg',
                        key: 'CODkg',
                    },
                ]
            },
            {
                title: "氨氮",
                width: 100,
                align: 'center',
                fixed: fixed,
                children:[
                    {
                        title: "平均值(mg/L)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'andanAvg',
                        key: 'andanAvg',
                    },
                    {
                        title: "排放量(Kg)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'andankg',
                        key: 'andankg',
                    },
                ]
            },
            {
                title: "总磷",
                width: 100,
                align: 'center',
                fixed: fixed,
                children:[
                    {
                        title: "平均值(mg/L)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'zonglinAvg',
                        key: 'zonglinAvg',
                    },
                    {
                        title: "排放量(Kg)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'zonglinkg',
                        key: 'zonglinkg',
                    },
                ]
            },
        ]

        let arr = [
            {
                moniTime:'2010-10-02 12:12:22',
                CODAvg:2,
                CODkg:1.001,
                andanAvg:1.001,
                andankg:1.001,
                zonglinkg:1.001,
                zonglinkg:1.001,
            },
            {
                moniTime:'2010-10-03 12:12:22',
                CODAvg:2,
                CODkg:1.001,
                andanAvg:1.001,
                andankg:1.001,
                zonglinkg:1.001,
                zonglinkg:1.001,
            },
            {
                moniTime:'2010-10-04 12:12:22',
                CODAvg:2,
                CODkg:1.001,
                andanAvg:1.001,
                andankg:1.001,
                zonglinkg:1.001,
                zonglinkg:1.001,
            },
            {
                moniTime:'2010-10-05 12:12:22',
                CODAvg:2,
                CODkg:1.001,
                andanAvg:1.001,
                andankg:1.001,
                zonglinkg:1.001,
                zonglinkg:1.001,
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
                    <BreadcrumbWrapper title="月平均值年报">
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

