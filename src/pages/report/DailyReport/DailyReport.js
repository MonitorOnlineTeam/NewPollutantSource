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
    GetEntByRegionAndAtt:'wasteWaterReportModel/GetEntByRegionAndAtt',
    GetPointByEntCode:'wasteWaterReportModel/GetPointByEntCode',
    GetAllTypeDataListWater:'wasteWaterReportModel/GetAllTypeDataListWater',
    ExportAllTypeDataListWater:'wasteWaterReportModel/ExportAllTypeDataListWater',
}
@connect(({ loading, autoForm, wasteWaterReportModel ,exceedDataAlarmModel,enterpriseMonitoringModel}) => ({
    loading: loading.effects['wasteWaterReportModel/GetAllTypeDataListWater'],
    regionList: autoForm.regionList,
    attention: enterpriseMonitoringModel.attention,
    total: wasteWaterReportModel.total,
    PageSize: wasteWaterReportModel.PageSize,
    PageIndex: wasteWaterReportModel.PageIndex,
    priseList: exceedDataAlarmModel.priseList,
    EntByRegionAndAttList:wasteWaterReportModel.EntByRegionAndAttList,
    PointByEntCodeList:wasteWaterReportModel.PointByEntCodeList,
    AllTypeDataListWaterList:wasteWaterReportModel.AllTypeDataListWaterList,
}))
class index extends PureComponent {
    constructor(props) {
        super(props);
        this.newTabIndex = 0
        this.state = {
            time: moment(new Date(),'YYYY-MM-DD'),
            regionValue: '',
            attentionValue: '',
            outletValue: '',
            entValue:undefined,
            pointValue:undefined
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
            type: pageUrl.GetEntByRegionAndAtt,
            payload: { RegionCode: '' ,Attention:'',PollutantTypeCode:'1'},
        });
        this.props.dispatch({
            type:'wasteWaterReportModel/updateState',
            payload:{
                AllTypeDataListWaterList:[]
            }
        })
    };


    // 导出
    exportReport = () => {
        const {time,pointValue} = this.state

        if(pointValue == '' || pointValue == undefined)
        {
            return message.error('请选择监测点')
        }
        let  begintime = moment(time).format("YYYY-MM-DD 00:00:00")
        let endTime = moment(time).format("YYYY-MM-DD 23:59:59")
        this.props.dispatch({
            type:pageUrl.ExportAllTypeDataListWater,
            payload:{
                BeginTime:begintime,
                EndTime: endTime,
                DGIMN: pointValue,
                dataType: 'day',
                time: moment(time).format('YYYY-MM-DD HH:mm:ss')
            }
        })
    }

    //查询数据
    getChartAndTableData =()=>{
        const {time,pointValue} = this.state

        if(pointValue == '' || pointValue == undefined)
        {
            return message.error('请选择监测点')
        }
        let  begintime = moment(time).format("YYYY-MM-DD 00:00:00")
        let endTime = moment(time).format("YYYY-MM-DD 23:59:59")
        this.props.dispatch({
            type:pageUrl.GetAllTypeDataListWater,
            payload:{
                BeginTime:begintime,
                EndTime: endTime,
                DGIMN: pointValue,
                dataType: 'day',
                time: moment(time).format('YYYY-MM-DD HH:mm:ss')
            }
        })
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
        const { EntByRegionAndAttList } = this.props;
        const selectList = [];
        if (EntByRegionAndAttList.length > 0) {
            EntByRegionAndAttList.map(item => {
                selectList.push(
                    <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
                        {item.EntName}
                    </Option>,
                );
            });
            return selectList;
        }
    };
    //监测列表
    pointList = ()=>{
        const { PointByEntCodeList } = this.props;
        const selectList = [];
        if (PointByEntCodeList.length > 0) {
            PointByEntCodeList.map(item => {
                selectList.push(
                    <Option key={item.DGIMN} value={item.DGIMN} >
                        {item.PointName}
                    </Option>,
                );
            });
            return selectList;
        }
    }
    DatePickerHandle=(date,dateString)=>{
        this.setState({
            time:dateString
        })
    }
    cardTitle = () => {
        const { time} = this.state;

        return (
            <>
                <label style={{fontSize:14}}>行政区:</label><Select
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
                        //获取关注度列表
                        this.props.dispatch({
                            type: pageUrl.GetEntByRegionAndAtt,
                            payload: {
                                RegionCode:value,
                                Attention:this.state.attentionValue,
                                PollutantTypeCode:'1'
                            },
                        });
                        this.setState({
                            regionValue: value,
                            entValue:undefined,
                            pointValue:undefined
                        })
                    }}>
                    {this.children()}
                </Select>
                <label style={{fontSize:14}}>关注程度:</label><Select
                    allowClear
                    style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                    placeholder="关注度"
                    maxTagCount={2}
                    maxTagTextLength={5}
                    maxTagPlaceholder="..."
                    onChange={(value) => {
                        //获取企业列表
                        this.props.dispatch({
                            type: pageUrl.GetEntByRegionAndAtt,
                            payload: {
                                RegionCode:this.state.regionValue,
                                Attention:value,
                                PollutantTypeCode:'1'
                            },
                        });
                        this.setState({
                            attentionValue: value,
                            entValue:undefined,
                            pointValue:undefined
                        })
                    }}>
                    {this.attention()}
                </Select>
                <label style={{fontSize:14}}>企业列表:</label><Select
                    allowClear
                    showSearch
                    style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                    placeholder="企业列表"
                    maxTagCount={2}
                    maxTagTextLength={5}
                    maxTagPlaceholder="..."
                    value={this.state.entValue}
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        if (option && option.props && option.props.title) {
                            return option.props.title === input || option.props.title.indexOf(input) !== -1
                        } else {
                            return true
                        }
                    }}
                    onChange={(value) => {
                        //获取企业列表
                        this.props.dispatch({
                            type: pageUrl.GetPointByEntCode,
                            payload: {
                                EntCode:value,
                                PollutantTypeCode:'1'
                            },
                        });    
                        this.setState({
                            entValue: value,
                            pointValue:undefined
                        })
                    }}>
                    {this.entList()}
                </Select>
                <div style={{marginTop:10,fontSize:14}}>
                    <label>监测点:</label><Select
                        allowClear
                        style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                        value={this.state.pointValue}
                        placeholder="监测点列表"
                        maxTagCount={2}
                        maxTagTextLength={5}
                        maxTagPlaceholder="..."
                        onChange={(value) => {
                            this.setState({
                                pointValue: value,
                            })  
                        }}>
                        {this.pointList()}
                    </Select>
                    <label>监测时间:</label><DatePicker size='default' onChange={this.DatePickerHandle} defaultValue={time}  style={{ marginLeft: 10, marginRight: 10 }}/>

                    <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
                    <Button style={{ marginRight: 10 }} onClick={this.exportReport}><Icon type="export" />导出</Button>
                    <span style={{fontSize:14,color:'red'}}>排放量为小时均值*小时流量</span>
                </div>
            </>
        )
    }

    onChange = (PageIndex, PageSize) => {

    }

    pageContent = () => {
        const { AllTypeDataListWaterList ,loading} = this.props
        const fixed = false
        const columns = [
            {
                title: "监测时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'Time',
                key: 'Time',
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
                        dataIndex: '011',
                        key: '011',
                    },
                    {
                        title: "排放量(Kg)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: '011sum',
                        key: '011sum',
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
                        dataIndex: '060',
                        key: '060   ',
                    },
                    {
                        title: "排放量(Kg)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: '060sum',
                        key: '060sum',
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
                        dataIndex: '101',
                        key: '101',
                    },
                    {
                        title: "排放量(Kg)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: '101sum',
                        key: '101sum',
                    },
                ]
            },
            {
                title: "总氮",
                width: 100,
                align: 'center',
                fixed: fixed,
                children:[
                    {
                        title: "平均值(mg/L)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: '065',
                        key: '065',
                    },
                    {
                        title: "排放量(Kg)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: '065sum',
                        key: '065sum',
                    },
                ]
            },
            {
                title: "流量",
                width: 100,
                align: 'center',
                fixed: fixed,
                children:[
                    {
                        title: "平均值(L/s)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'b01',
                        key: 'b01',
                    },
                    {
                        title: "排放量(t)",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'b01sum',
                        key: 'b01sum',
                    },
                ]
            },
        ]

        return <>{
            loading?<PageLoading/>:
            <SdlTable columns={columns} dataSource={AllTypeDataListWaterList}
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
                <div id="siteParamsPage" className={style.cardTitle}>
                    <BreadcrumbWrapper title="小时平均值日报">
                        <Card
                            extra={
                                <>
                                    {this.cardTitle()}
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

