/**
 * 功  能：企业监测点查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.12
 */
import React, { PureComponent, Fragment } from 'react';
import { ExportOutlined, RollbackOutlined } from '@ant-design/icons';
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
} from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from "dva";
import ReactEcharts from 'echarts-for-react';
import moment from 'moment'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading'
import { red } from '@ant-design/colors';
import { routerRedux } from 'dva/router';
import style from '@/pages/dataSearch/tableClass.less'
const { Option } = Select;
const { TabPane } = Tabs;


const pageUrl = {
    GetPointSummary: 'enterpriseMonitoringModel/GetPointSummary',
    ExportPointSummary:'enterpriseMonitoringModel/ExportPointSummary',
}
@connect(({ loading, flowanalysisModel ,enterpriseMonitoringModel}) => ({
    loading:loading.effects["enterpriseMonitoringModel/GetPointSummary"],
    priseList: enterpriseMonitoringModel.priseList,
    pointSummaryList:enterpriseMonitoringModel.pointSummaryList,
    total:enterpriseMonitoringModel.total,
    PageSize:enterpriseMonitoringModel.PageSize,
    PageIndex:enterpriseMonitoringModel.PageIndex
}))
class index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            defalutPollutantType: props.match.params.type,
            enterpriseValue: '',            
        };
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        debugger
        this.props.dispatch({
            //获取企业列表
            type: 'enterpriseMonitoringModel/getEntByRegion',
            payload: { RegionCode:this.props.match.params.RegionCode == '0'?'':this.props.match.params.RegionCode},
        });

        this.props.dispatch({
            type: pageUrl.GetPointSummary,
            payload: { 
                RegionCode:this.props.match.params.RegionCode == '0'?'':this.props.match.params.RegionCode,
                EntCode:'',
                PageSize:20,
                PageIndex:1,
                EntType:1,
                operationpersonnel:"1"
             },
        });
    };


    // 导出
    exportReport = () => {
        this.props.dispatch({
            type: pageUrl.ExportPointSummary,
            payload: {
                EntCode: this.state.enterpriseValue ==undefined?'':this.state.enterpriseValue.toString(),
                RegionCode:this.props.match.params.RegionCode == '0'?'':this.props.match.params.RegionCode,
                EntType:1
            }
        })
    }

    // 获取图表及表格数据
    getChartAndTableData = () => {
        debugger
        this.props.dispatch({
            type: pageUrl.GetPointSummary,
            payload: {
                EntCode: this.state.enterpriseValue ==undefined?'':this.state.enterpriseValue.toString(),
                RegionCode:this.props.match.params.RegionCode == '0'?'':this.props.match.params.RegionCode,
                PageSize:20,
                PageIndex:1,
                EntType:1,
            }
        })

    }

    children = () => {
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
    cardTitle = () => {

        return <>
            <Select
                allowClear
                showSearch
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="企业列表"
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
                        enterpriseValue: value
                    })
                }}>
                {this.children()}
            </Select>
            <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
            <Button  style={{ marginRight: 10 }} onClick={this.exportReport}><ExportOutlined />导出</Button>
            <Button onClick={() => { this.props.history.go(-1); }} ><RollbackOutlined />返回</Button>
        </>;
    }
    onChange =(PageIndex, PageSize)=>{
        debugger
        this.props.dispatch({
            
            type: pageUrl.GetPointSummary,
            payload: {
                EntCode: this.state.enterpriseValue ==undefined?'':this.state.enterpriseValue.toString(),
                RegionCode:this.props.match.params.RegionCode == '0'?'':this.props.match.params.RegionCode,
                PageSize:PageSize,
                PageIndex:PageIndex,
                EntType:1
            }
        })
    }
    onChangeHandle=(PageIndex, PageSize)=>{
        debugger
        this.props.dispatch({
            
            type: pageUrl.GetPointSummary,
            payload: {
                EntCode: this.state.enterpriseValue ==undefined?'':this.state.enterpriseValue.toString(),
                RegionCode:this.props.match.params.RegionCode == '0'?'':this.props.match.params.RegionCode,
                PageSize:PageSize,
                PageIndex:PageIndex,
                EntType:1
            }
        })
    }

    pageContent = () => {
        const {pointSummaryList ,loading} = this.props
        console.log(loading)
        const fixed = false
        const columns = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'regionName',
                key: 'regionName'
            },
            {
                title: "企业名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'entName',
                key: 'entName'
            },
            {
                title: "监测点名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'pointName',
                key: 'pointName'
            },
            {
                title: "关注程度",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'attentionName',
                key: 'attentionName'
            },
            {
                title: "排口类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'pollutantTypeName',
                key: 'pollutantTypeName'
            },
            {
                title: "最新数据上传时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'latestTime',
                key: 'latestTime',
                render:(text)=>{
                    return text == '' ?'-':text
                }
            },
            {
                title: "污染物设置",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'pollutantNames',
                key: 'pollutantNames'
            },
            {
                title: "运维负责人",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'operationName',
                key: 'operationName',
                render:(text)=>{
                    return text == '' ?'-':text
                }
                
            },
        ]
        return <>{
            <SdlTable columns={columns} dataSource={pointSummaryList} 
            loading={loading}
            pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                pageSize: this.props.PageSize,
                current: this.props.PageIndex,
                onChange: this.onChange,
                onShowSizeChange: this.onChangeHandle,
                pageSizeOptions: ['20', '30', '40', '100'],
                total: this.props.total,
              }}
            />
        }
        </>
        
    }
    render() {
        return (
            <>
                <div id="siteParamsPage" className={style.cardTitle}>
                    <BreadcrumbWrapper title="企业监测点详细信息">
                        <Card
                            extra={
                                <>
                                    {this.cardTitle()}
                                </>
                            }
                        >
                            {this.pageContent()}
                        </Card>
                    </BreadcrumbWrapper>
                </div>
            </>
        );
    }
}

export default index;

