/**
 * 功  能：停运记录
 * 创建人：胡孟弟
 * 创建时间：2020.10.22
 */
import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Checkbox, Row, Col, Radio, Select, DatePicker, Empty, message, Tabs, Modal,Icon ,List} from 'antd'
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
import { downloadFile } from '@/utils/utils';
const { Option } = Select;
const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;

const pageUrl = {
    getRegions: 'autoForm/getRegions',
    GetEntByRegion:'exceedDataAlarmModel/GetEntByRegion',
    GetPointByEntCode:'StopRecordModel/GetPointByEntCode',
    GetStopList:'StopRecordModel/GetStopList',
    ExportStopList:'StopRecordModel/ExportStopList',
}
@connect(({ loading, autoForm, enterpriseMonitoringModel ,exceedDataAlarmModel,StopRecordModel}) => ({
    loading: loading.effects["StopRecordModel/GetStopList"],
    regionList: autoForm.regionList,
    attention: enterpriseMonitoringModel.attention,
    total: StopRecordModel.total,
    PageSize: StopRecordModel.PageSize,
    PageIndex: StopRecordModel.PageIndex,
    priseList: exceedDataAlarmModel.priseList,
    PointByEntList:StopRecordModel.PointByEntList,
    StopList:StopRecordModel.StopList,
}))
class index extends PureComponent {
    constructor(props) {
        super(props);
        this.newTabIndex = 0
        this.state = {
            Begintime: [moment().add(-1, "month"), moment()],
            Endtime: [moment().add(-1, "month"), moment()],
            regionValue: '',
            entValue:'',
            voucher:'',
            pointValue:'',
            visible:false,
            fileArr:[]
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
        const {Begintime,Endtime,voucher,pointValue,entValue,regionValue} = this.state

        this.props.dispatch({
            type:pageUrl.ExportStopList,
            payload:{
                BeginTime: moment(Begintime[0]).format('YYYY-MM-DD HH:mm:ss'),
                BeginTimeEnd: moment(Begintime[1]).format('YYYY-MM-DD HH:mm:ss'),
                EndTime: moment(Endtime[0]).format('YYYY-MM-DD HH:mm:ss'),
                EndTimeEnd: moment(Endtime[1]).format('YYYY-MM-DD HH:mm:ss'),
                RegionCode: regionValue == undefined ?'':regionValue,
                EntCode: entValue== undefined ?'':entValue,
                DGIMN: pointValue== undefined ?'':pointValue,
                Status: voucher== undefined ?'':voucher,
            }
        })
    }

    //查询数据
    getChartAndTableData =()=>{
        const {Begintime,Endtime,voucher,pointValue,entValue,regionValue} = this.state

        this.props.dispatch({
            type:pageUrl.GetStopList,
            payload:{
                BeginTime: moment(Begintime[0]).format('YYYY-MM-DD HH:mm:ss'),
                BeginTimeEnd: moment(Begintime[1]).format('YYYY-MM-DD HH:mm:ss'),
                EndTime: moment(Endtime[0]).format('YYYY-MM-DD HH:mm:ss'),
                EndTimeEnd: moment(Endtime[1]).format('YYYY-MM-DD HH:mm:ss'),
                RegionCode: regionValue == undefined ?'':regionValue,
                EntCode: entValue== undefined ?'':entValue,
                DGIMN: pointValue== undefined ?'':pointValue,
                Status: voucher== undefined ?'':voucher,
                PageSize:20,
                PageIndex:1
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
        const selectList = [];
        if (PointByEntList.length > 0) {
            PointByEntList.map(item => {
                selectList.push(
                    <Option key={item.DGIMN} value={item.DGIMN} title={item.PointName}>
                        {item.PointName}
                    </Option>,
                );
            });
            return selectList;
        }
    };
    onRef1 = (ref) => {
        this.childrenHand = ref;
      }
    cardTitle = () => {
        const { Begintime,Endtime} = this.state;
        
        return (
            <>
                <label style={{fontSize:14}}>停运开始时间:</label><RangePicker_ onRef={this.onRef1} isVerification={true} dateValue={Begintime} style={{ width: 400, minWidth: '200px', marginRight: 10,marginLeft: 10 }} callback={
                    (dates, dataType) => {
                        this.setState({
                            Begintime: dates
                        })
                    }
                } />
                <label style={{fontSize:14}}>停运结束时间:</label><RangePicker_ onRef={this.onRef1} isVerification={true} dateValue={Endtime} style={{ width: 400, minWidth: '200px', marginRight: 10,marginLeft: 10 }} callback={
                    (dates, dataType) => {
                        console.log(dates,dataType)
                        this.setState({
                            Endtime: dates
                        })
                    }
                } />
                
                <div style={{ marginTop: 10,fontSize:14 }}>
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

                            //获取监测点
                            this.props.dispatch({
                                type: pageUrl.GetPointByEntCode,
                                payload: {
                                    EntCode:value
                                },
                            });
                            this.setState({
                                entValue: value,
                                pointValue:''
                            })
                        }}>
                        {this.entList()}
                    </Select>
                    <label>监测点:</label><Select
                        allowClear
                        style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                        placeholder="监测点列表"
                        maxTagCount={2}
                        value={this.state.pointValue}
                        maxTagTextLength={5}
                        maxTagPlaceholder="..."
                        onChange={(value) => {
                            this.setState({
                                pointValue: value,
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
        const {Begintime,Endtime,voucher,pointValue,entValue,regionValue} = this.state

        this.props.dispatch({
            type:pageUrl.GetStopList,
            payload:{
                BeginTime: moment(Begintime[0]).format('YYYY-MM-DD HH:mm:ss'),
                BeginTimeEnd: moment(Begintime[1]).format('YYYY-MM-DD HH:mm:ss'),
                EndTime: moment(Endtime[0]).format('YYYY-MM-DD HH:mm:ss'),
                EndTimeEnd: moment(Endtime[1]).format('YYYY-MM-DD HH:mm:ss'),
                RegionCode: regionValue == undefined ?'':regionValue,
                EntCode: entValue== undefined ?'':entValue,
                DGIMN: pointValue== undefined ?'':pointValue,
                Status: voucher== undefined ?'':voucher,
                PageSize:PageSize,
                PageIndex:PageIndex
            }
        })
    }
    ShowSizeChange= (PageIndex, PageSize) => {
        const {Begintime,Endtime,voucher,pointValue,entValue,regionValue} = this.state

        this.props.dispatch({
            type:pageUrl.GetStopList,
            payload:{
                BeginTime: moment(Begintime[0]).format('YYYY-MM-DD HH:mm:ss'),
                BeginTimeEnd: moment(Begintime[1]).format('YYYY-MM-DD HH:mm:ss'),
                EndTime: moment(Endtime[0]).format('YYYY-MM-DD HH:mm:ss'),
                EndTimeEnd: moment(Endtime[1]).format('YYYY-MM-DD HH:mm:ss'),
                RegionCode: regionValue == undefined ?'':regionValue,
                EntCode: entValue== undefined ?'':entValue,
                DGIMN: pointValue== undefined ?'':pointValue,
                Status: voucher== undefined ?'':voucher,
                PageSize:PageSize,
                PageIndex:PageIndex
            }
        })
    }

    lookChange=(fileList)=>{
        console.log(fileList)
        let file;
        if(fileList == null)
        {
            file =[]
        }
        else{
            file = fileList
        }
        console.log(file)
        this.setState({
            visible:true,
            fileArr:file
        })

    }
    pageContent = () => {
        const { StopList ,loading} = this.props
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
                align: 'left',
                fixed: fixed,
                dataIndex: 'entName',
                key: 'entName',
            },
            {
                title: "监测点名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'pointName',
                key: 'pointName',
            },
            {
                title: "排口类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'pollutantTypeName',
                key: 'pollutantTypeName',
            },
            {
                title: "停运开始时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'beginTime',
                key: 'beginTime',
            },
            {
                title: "停运结束时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'endTime',
                key: 'endTime',
            },
            {
                title: "停运时长",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'stopHour',
                key: 'stopHour',
            },
            {
                title: "停运描述",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'remark',
                key: 'remark',
            },
            {
                title: "凭证",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'vouche',
                key: 'vouche',
                render:(text,record)=>{
                    return <a onClick={this.lookChange.bind(this,record.field)}>查看</a>
                }
            },
            {
                title: "创建人",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'person',
                key: 'person',
            },
            {
                title: "创建时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'createTime',
                key: 'createTime',
            },
        ]
        return <>{
            <SdlTable columns={columns} dataSource={StopList}
            loading={loading}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSize: this.props.PageSize,
                    current: this.props.PageIndex,
                    onChange: this.onChange,
                    onShowSizeChange: this.ShowSizeChange,
                    pageSizeOptions: ['20', '30', '40', '100'],
                    total: this.props.total,
                }} 
            />
        }
        </>
        //
    }
    onCancel =()=>{
        this.setState({
            visible:false
        })
    }
    onClick =(name)=>{
        downloadFile(name)
    }
    render() {
        const { loading,priseList } = this.props
        return (
            <>
                <div id="siteParamsPage" className={style.cardTitle}>
                    <BreadcrumbWrapper title="停运记录">
                        <Card
                            extra={
                                <>
                                <div style={{float:'left'}}>
                                    {this.cardTitle()}
                                </div>
                                </>
                            }
                            className={style.dataTable}
                        >

                             {this.pageContent()}
                        </Card>
                        <Modal
                        centered
                        visible={this.state.visible}
                        onCancel={this.onCancel}
                        footer={null}
                        title='文件'
                        >
                            {
                                
                                this.state.fileArr.length > 0 ?
                                    this.state.fileArr.map(arr =>
                                        <a onClick={this.onClick.bind(this, arr.FileName)}>{arr.FileName}</a>)
                                    : '无'

                            }
                        </Modal>
                    </BreadcrumbWrapper>
                </div>
            </>
        );
    }
}

export default index;

