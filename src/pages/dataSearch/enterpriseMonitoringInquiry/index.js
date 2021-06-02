/**
 * 功  能：企业监测点查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.12
 */
import React, { PureComponent, Fragment } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Checkbox,
    Row,
    Col,
    Radio,
    Select,
    DatePicker,
    Empty,
    message,
    Tabs,
    Modal,
} from 'antd';
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


const pageUrl = {
    GetAttentionDegreeList: 'enterpriseMonitoringModel/GetAttentionDegreeList',
    GetEntSummary: 'enterpriseMonitoringModel/GetEntSummary',
    getRegions: 'autoForm/getRegions',
    GetEntOrPointDetail: 'enterpriseMonitoringModel/GetEntOrPointDetail',
    ExportEntSummary:'enterpriseMonitoringModel/ExportEntSummary',
    ExportEntOrPointDetail:'enterpriseMonitoringModel/ExportEntOrPointDetail',
}
@connect(({ loading, autoForm, enterpriseMonitoringModel }) => ({
    loading: loading.effects["enterpriseMonitoringModel/GetEntSummary"],
    regionList: autoForm.regionList,
    attentionSummaryList: enterpriseMonitoringModel.attentionSummaryList,
    pointSummaryList: enterpriseMonitoringModel.pointSummaryList,
    attention: enterpriseMonitoringModel.attention,
    EntOrPointDetail: enterpriseMonitoringModel.EntOrPointDetail,
    total: enterpriseMonitoringModel.total,
    PageSize: enterpriseMonitoringModel.PageSize,
    PageIndex: enterpriseMonitoringModel.PageIndex
}))
class index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            defalutPollutantType: props.match.params.type,
            regionValue: '',
            attentionValue: '',
            outletValue: '',
            visible: false,
            visibleMoni: false,
            EntList: [],
            PointList: [],
            regionCode:'',
            hasCode:'',
            operationpersonnel:'',
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
            type: pageUrl.GetEntSummary,
            payload: {
                RegionCode: '',
                AttentionCode: '',
                PollutantType: '',
                //PageSize: 25,
                //PageIndex: 1
            }
        })
    };


    // 导出
    exportReport = () => {
        this.props.dispatch({
            type: pageUrl.ExportEntSummary,
            payload: {
                RegionCode: this.state.regionValue == undefined ? '' : this.state.regionValue,
                AttentionCode: this.state.attentionValue,
                PollutantType: this.state.outletValue,
                operationpersonnel:this.state.operationpersonnel,
            }
        })
    }
    // 导出
    EntexportReport = () => {
        debugger
        const {outletValue,regionValue} = this.state
        this.props.dispatch({
            type: pageUrl.ExportEntOrPointDetail,
            payload: {
                RegionCode:this.state.regionCode=='0'?regionValue==undefined?'':regionValue: this.state.regionCode,
                HasData: this.state.hasCode,
                EntCode: '',
                EntType: 1,
                PollutantType:outletValue == undefined ?'':outletValue,
                operationpersonnel:this.state.operationpersonnel,
            }
        })
    }
    // 导出
    PointexportReport = () => {
        debugger
        const {outletValue,regionValue} = this.state
        this.props.dispatch({
            type: pageUrl.ExportEntOrPointDetail,
            payload: {
                RegionCode:this.state.regionCode=='0'?regionValue==undefined?'':regionValue: this.state.regionCode,
                HasData: this.state.hasCode,
                EntCode: '1',
                EntType: 1,
                PollutantType:outletValue == undefined ?'':outletValue,
                operationpersonnel:this.state.operationpersonnel,
            }
        })
    }


    // 获取图表及表格数据
    getChartAndTableData = () => {
     debugger
        this.props.dispatch({
            type: pageUrl.GetEntSummary,
            payload: {
                RegionCode: this.state.regionValue == undefined ? '' : this.state.regionValue,
                AttentionCode: this.state.attentionValue,
                PollutantType: this.state.outletValue,
                operationpersonnel: this.state.operationpersonnel,
                //PageSize: 25,
                //PageIndex: 1
            }
        })
    }


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
    cardTitle = () => {
        //const { pollutantValue,} = this.state;

        return <>
            <Select
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

            <Select
                allowClear
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="关注度"
                maxTagCount={2}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
                onChange={(value) => {
                    this.setState({
                        attentionValue: value
                    })
                }}>
                {this.attention()}
            </Select>
            <Select
                allowClear
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="排口类型"
                maxTagCount={2}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
                onChange={(value) => {
                    this.setState({
                        outletValue: value
                    })
                }}>
                <Option value="">全部</Option>
                <Option value="1">废水</Option>
                <Option value="2">废气</Option>
            </Select>
            <Select
                allowClear
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="运维状态"
                maxTagCount={2}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
                onChange={(value) => {
                    this.setState({
                        operationpersonnel: value,
                    })
                }}>
                 <Option value="1">已设置运维人员</Option>
                <Option value="2">未设置运维人员</Option>
            </Select>
            <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
            <Button style={{ marginRight: 10 }} onClick={this.exportReport}><ExportOutlined />导出</Button>
        </>;
    }

    GetEntDetail = (regionCode, hasData) => {
        const {regionValue,attentionValue} = this.state
        this.props.dispatch({
            type: pageUrl.GetEntOrPointDetail,
            payload: {
                AttentionCode:attentionValue,
                RegionCode: regionCode == '0'? (regionValue==undefined?'':regionValue) :regionCode,
                HasData: hasData,
                EntCode: '',
                EntType: 1,
                PollutantType:this.state.outletValue,
                operationpersonnel: this.state.operationpersonnel,
            }
        }).then(() => {
            this.setState({
                EntList: this.props.EntOrPointDetail,
                visible: true,
                regionCode:regionCode,
                hasCode:hasData,
                operationpersonnel: this.state.operationpersonnel,
            })
        })
    }

    GetPointDetail = (regionCode, hasData) => {
        const {regionValue,attentionValue} = this.state
        this.props.dispatch({
            type: pageUrl.GetEntOrPointDetail,
            payload: {
                AttentionCode:attentionValue,
                RegionCode: regionCode == '0'?(regionValue==undefined?'':regionValue):regionCode,
                HasData: hasData,
                EntCode: '1',
                EntType: 1,
                PollutantType:this.state.outletValue,
                operationpersonnel: this.state.operationpersonnel,
            }
        }).then(() => {
            this.setState({
                PointList: this.props.EntOrPointDetail,
                visibleMoni: true,
                regionCode:regionCode,
                hasCode:hasData,
                operationpersonnel: this.state.operationpersonnel,
            })
        })
    }
    onChange = (PageIndex, PageSize) => {
        debugger
        this.props.dispatch({
            type: pageUrl.GetEntSummary,
            payload: {
                RegionCode: this.state.regionValue == undefined ? '' : this.state.regionValue,
                AttentionCode: this.state.attentionValue,
                PollutantType: this.state.outletValue,
                PageSize: PageSize,
                PageIndex: PageIndex,
                operationpersonnel: this.state.operationpersonnel,
            }
        })
    }

    pageContent = () => {
        const { attentionSummaryList } = this.props
        const {regionValue} = this.state
        const fixed = false
        const columns = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'reginName',
                key: 'reginName',
                render: (text, record) => {
                    return <a onClick={
                        () => this.props.dispatch(routerRedux.push(`/dataSearch/enterpriseInquiryDetail/${record.regionCode}`))
                    } > {text} </a>
                }
            },
            {
                title: "总数",
                align: 'center',
                fixed: fixed,
                children: [
                    {
                        title: "企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        key: 'entCount',
                        dataIndex: 'entCount',
                        render: (text, record) => {
                            return <a onClick={this.GetEntDetail.bind(this, record.regionCode, '')} > {text} </a>
                        }
                    },
                    {
                        title: "监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'pointCount',
                        key: 'pointCount',
                        render: (text, record) => {
                            return <a onClick={this.GetPointDetail.bind(this, record.regionCode, '')} > {text} </a>
                        }
                    },
                    {
                        title: "废气企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'entWasteGasCount',
                        key: 'entWasteGasCount',
                    },
                    {
                        title: "废气监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'wasteGasCount',
                        key: 'wasteGasCount',
                    },
                    {
                        title: "废水企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'entWasteWaterCount',
                        key: 'entWasteWaterCount',
                    },
                    {
                        title: "废水监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'wasteWaterCount',
                        key: 'wasteWaterCount',
                    },
                ]
            },
            {
                title: "有数据上传",
                align: 'center',
                fixed: fixed,
                children: [
                    {
                        title: "企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        key: 'dataEntCount',
                        dataIndex: 'dataEntCount',
                        render: (text, record) => {
                            return <a onClick={this.GetEntDetail.bind(this, record.regionCode, 1)} > {text} </a>
                        }
                    },
                    {
                        title: "监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'dataPointCount',
                        key: 'dataPointCount',
                        render: (text, record) => {
                            return <a onClick={this.GetPointDetail.bind(this, record.regionCode, 1)} > {text} </a>
                        }
                    },
                    {
                        title: "废气企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'dataEntWasteGasCount',
                        key: 'dataEntWasteGasCount',
                    },
                    {
                        title: "废气监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'dataWasteGasCount',
                        key: 'dataWasteGasCount',
                    },
                    {
                        title: "废水企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'dataEntWasteWaterCount',
                        key: 'dataEntWasteWaterCount',
                    },
                    {
                        title: "废水监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'dataWasteWaterCount',
                        key: 'dataWasteWaterCount',
                    },
                ]
            },
            {
                title: "无数据上传",
                align: 'center',
                fixed: fixed,
                children: [
                    {
                        title: "企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        key: 'nodataEntCount',
                        dataIndex: 'nodataEntCount',
                        render: (text, record) => {
                            return <a onClick={this.GetEntDetail.bind(this, record.regionCode, '0')} > {text} </a>
                        }
                    },
                    {
                        title: "监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'nodataPointCount',
                        key: 'nodataPointCount',
                        render: (text, record) => {
                            return <a onClick={this.GetPointDetail.bind(this, record.regionCode, 0)} > {text} </a>
                        }
                    },
                    {
                        title: "废气企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'nodataEntWasteGasCount',
                        key: 'nodataEntWasteGasCount',
                    },
                    {
                        title: "废气监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'nodataWasteGasCount',
                        key: 'nodataWasteGasCount',
                    },
                    {
                        title: "废水企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'nodataEntWasteWaterCount',
                        key: 'nodataEntWasteWaterCount',
                    },
                    {
                        title: "废水监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'nodataWasteWaterCount',
                        key: 'nodataWasteWaterCount',
                    },
                ]
            },
        ]

        return <>{

            <SdlTable columns={columns} dataSource={attentionSummaryList} 
            // pagination={{
            //     showSizeChanger: true,
            //     showQuickJumper: true,
            //     pageSize: this.props.pageSize,
            //     current: this.props.PageIndex,
            //     onChange: this.onChange,
            //     pageSizeOptions: ['20', '30', '40', '100'],
            //     total: this.props.total,
            // }} 
            pagination ={
                false
            }
            />
        }
        </>
        //
    }

    CancelHandel = () => {
        this.setState({
            visible: false,
            visibleMoni: false
        })
    }
    render() {
        const { loading } = this.props
        const fixed = false
        const columns2 = [
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
                align: 'left',
                fixed: fixed,
                dataIndex: 'entName',
                key: 'entName',
            },
            // {
            //     title: "企业简称",
            //     align: 'left',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "关注程度",
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "经度",
            //     width: 100,
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "纬度",
            //     width: 100,
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "法人编号",
            //     width: 100,
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "法人名称",
            //     width: 100,
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "所属行业",
            //     width: 100,
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "污染源规模",
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "注册类型",
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "环保负责人",
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "办公电话",
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "移动电话",
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "隶属关系",
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "重点类型",
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
            // {
            //     title: "双运维",
            //     align: 'center',
            //     fixed: fixed,
            //     dataIndex: 'x',
            //     key: 'x',
            // },
        ]

        const columns3 = [
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
                align: 'left',
                fixed: fixed,
                dataIndex: 'entName',
                key: 'entName',
            },
            {
                title: "监测点",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'pointName',
                key: 'pointName',
            },
        ]
        return <>
            <div id="siteParamsPage" className={style.cardTitle}>
                <BreadcrumbWrapper title="企业监测点查询">
                    <Card
                        extra={
                            <>
                                {this.cardTitle()}
                            </>
                        }
                        className="contentContainer"
                    >

                        {loading ? <PageLoading /> : this.pageContent()}
                    </Card>
                    <Modal
                        centered
                        title="企业列表"
                        visible={this.state.visible}
                        footer={null}
                        // width={'80%'}
                        width={800}
                        onCancel={this.CancelHandel}
                    >
                        <SdlTable columns={columns2} dataSource={this.state.EntList} pagination={false} scroll={{ y: 500 }}/>
                        <div style={{height:15,lineHeight:15,marginTop:'5px'}}>
                            <Button style={{ float: 'right' }} onClick={this.EntexportReport}><ExportOutlined /> 导出</Button>
                        </div>
                    </Modal>
                    <Modal
                        centered
                        title="企业监测列表"
                        visible={this.state.visibleMoni}
                        footer={null}
                        width={800}
                        onCancel={this.CancelHandel}
                    >
                        <div>
                            {/* <Select style={{width:100}} defaultValue="1">
                              <Option value="1">废水</Option>
                              <Option value="2">废气</Option>
                             </Select> */}
                            <Button  style={{marginBottom:'8px',marginLeft:'5px'}}  onClick={this.PointexportReport}><ExportOutlined />导出</Button>
                        </div>
                        <SdlTable columns={columns3} dataSource={this.state.PointList} pagination={false} scroll={{ y: 500 }}/>
                    </Modal>
                </BreadcrumbWrapper>
            </div>
        </>;
    }
}

export default index;

