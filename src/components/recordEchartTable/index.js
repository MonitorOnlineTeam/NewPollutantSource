/*
 * @Author: lzp
 * @Date: 2019-07-25 16:46:20
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-17 15:32:18
 * @Description: 异常记录
 */
import React, { Component } from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Select,
    Input,
    Button,
    Drawer,
    Radio,
    Collapse,
    Table,
    Badge,
    Divider,
    Row,
    Tree,
    Empty,
    Col,
    Card,
    Spin,
    message,
} from 'antd';
import { connect } from 'dva';
import { EntIcon, GasIcon, WaterIcon, LegendIcon } from '@/utils/icon';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import styles from './index.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import ButtonGroup_ from '@/components/ButtonGroup'
import PollutantDownSelect from '@/components/PollutantDownSelect'

@connect(({ recordEchartTable, loading }) => ({
    exlist: recordEchartTable.exlist,
    excount: recordEchartTable.excount,
    exmodellist: recordEchartTable.exmodellist,
    exmodellistLoading: loading.effects['recordEchartTable/getexmodellist'],
    exceptionData: recordEchartTable.exceptionData,
    exceptionDataLoading: loading.effects['recordEchartTable/getexceptiondata'],
    exfirstData: recordEchartTable.exfirstData,
    ExceptionTotal: recordEchartTable.ExceptionTotal,
    pageSize: recordEchartTable.pageSize,
    pageIndex: recordEchartTable.pageIndex,
}))
@Form.create()
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rangeDate: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
            format: 'YYYY-MM-DD HH:mm:ss',
            bar: [],
            dataType: '',
            DGIMN: [],
            beginTime: '',
            endTime: '',
            Pollutant: '',
            ExceptionType: '',
            code:"",
            column: [
                {
                    title: '污染物',
                    dataIndex: 'PollutantCode',
                    align: 'center',
                },
                {
                    title: '监测时间',
                    dataIndex: 'ExceptionTime',
                    align: 'center',
                },
                {
                    title: '监测数值',
                    dataIndex: 'MonitorValue',
                    align: 'center',
                },
                {
                    title: '异常类型',
                    dataIndex: 'ExceptionType',
                    align: 'center',
                },
            ],

        };
    }

    /** 初始化加载 */
    componentDidMount() {

    this.initData();

    }
   initData=()=>{
    const { location,initLoadData,dispatch } = this.props;
    if(location.query&&location.query.type==="alarm"){ //报警信息
       const paraCodeList  = location.query.code;
       const startTime = location.query.startTime;
       const endTime = location.query.endTime;
    this.children.onDateChange([ moment( moment(new Date()).format('YYYY-MM-DD 00:00:00')), moment( moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))])//修改日期选择日期  .onDateChange([ moment(moment(new Date()).format('YYYY-MM-DD 00:00:00')), moment( moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))])//修改日期选择日期  
    
    const DATATYPE = {
         RealTimeData:"realtime",
         MinuteData:"minute",
         HourData:"hour",
         DayData : 'day',
         loadtype:''
    }
    this.setState({loadtype:location.query.loadtype?location.query.loadtype:''},()=>{
        this.setState({
            beginTime:  moment(new Date()).format('YYYY-MM-DD 00:00:00'),
            endTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            code:paraCodeList.split(),
            dataType:location.query.dataType? DATATYPE[location.query.dataType] : '',
            loadtype:location.query.loadtype?location.query.loadtype:''
        }, () => {
         
            initLoadData && this.getLoadData(this.props);
        })

    })

    }else{
        const beginTime = moment(new Date()).add(-60, 'minutes');
        const endTime = moment(new Date());
        this.setState({
            dataType:'realtime',
            beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        }, () => {
         initLoadData && this.getLoadData(this.props);
        })

    }
   }
    
    componentWillReceiveProps(nextProps) {
        
        const {  location } = this.props;

        if (this.props.DGIMN != nextProps.DGIMN) {
            this.getLoadData(nextProps);
        }
        if (location.query.startTime != nextProps.location.query.startTimeMN) {
            this.initData();
        }
    }
    getLoadData = nextProps => {

        const beginTime =  moment(new Date()).add(-60, 'minutes');
        const endTime = moment(new Date());
        const { location } = this.props;
            this.props.dispatch({
                type: 'recordEchartTable/getexmodellist',
                payload: {
                    beginTime: this.state.beginTime,
                    endTime:  this.state.endTime,
                    dataType: this.state.dataType,
                    DGIMN:[nextProps.DGIMN], 
                    PollutantList: this.state.code
                },
            })
    }
    onclick = {
        click: this.clickEchartsPie.bind(this),
    }

    pollChange=()=>{

    }
    getpollutantSelect = () => {
        const { DGIMN,location} = this.props;
         const {code } = this.state;
        // isdefaulltall={1} 
        if(location.query&&location.query.type==="alarm"){ //报警信息
            return   code ? <PollutantDownSelect style={{ width: 200, marginRight: 10 }} customcode={code}  onRef={this.childSelect} onChange={this.pollChange} dgimn={DGIMN}  />:null  ; 
        }else{
            return   <PollutantDownSelect style={{ width: 200, marginRight: 10 }}  isdefaulltall={1}   onRef={this.childSelect} onChange={this.pollChange} dgimn={DGIMN}  />  ; 
        }
      }
    clickEchartsPie(e) {
        this.props.dispatch({
            type: 'recordEchartTable/updateState',
            payload: {
                exfirstData: [],
                pageIndex: 1,
            },
        })
        const { name } = e
        const { seriesName } = e
        this.setState({
            Pollutant: name,
            ExceptionType: seriesName,
        })
        this.props.dispatch({
            type: 'recordEchartTable/getexceptiondata',
            payload: {
                beginTime: this.state.beginTime,
                endTime: this.state.endTime,
                dataType: this.state.dataType,
                DGIMN: [this.props.DGIMN],
                Pollutant: e.name,
                ExceptionType: e.seriesName,
            },
        })
    }

    // 分页
    onTableChange = (current, pageSize) => {
        this.props.dispatch({
            type: 'recordEchartTable/updateState',
            payload: {
                pageIndex: current,
                pageSize,
            },
        })
        setTimeout(() => {
            // 获取表格数据
            this.props.dispatch({
                type: 'recordEchartTable/getexceptiondata',
                payload: {
                    beginTime: this.state.beginTime,
                    endTime: this.state.endTime,
                    dataType: this.state.dataType,
                    DGIMN: [this.props.DGIMN],
                    Pollutant: this.state.Pollutant == '' ? this.props.exmodellist[0].product : this.state.Pollutant,
                    ExceptionType: this.state.ExceptionType == '' ? this.props.exlist[1] : this.state.ExceptionType,
                },
            })
        }, 0)
    }

    /** 数据类型切换 */
    _handleDateTypeChange = e => {
        const dataType = e.target.value;
        this.setState({ dataType });
        this.children.onDataTypeChange(dataType);
    }


    /**
   * 回调获取时间并重新请求数据
   */
    dateCallback = (dates, dataType) => {

        if (!this.props.DGIMN) { return; }
        if(this.state.loadtype){ return; }
        if(this.state.code&&this.state.dataType){
        this.setState({
            beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
        });
        this.props.dispatch({
            type: 'recordEchartTable/updateState',
            payload: {
                exceptionData: [],
                pageIndex: 1,
            },
        })
        this.props.dispatch({
            type: 'recordEchartTable/getexmodellist',
            payload: {
                beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
                endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
                dataType,
                DGIMN: [this.props.DGIMN],
                PollutantList: this.state.code
            },
        })
    }
    }

    onRef1 = ref => {
        this.children = ref;
    }


    render() {
        const { column } = this.state
        const GetpollutantSelect = this.getpollutantSelect;
        const option = {
            legend: {
                orient: 'vertical',
                x: 'right', // 可设定图例在左、右、居中
                y: 'top', // 可设定图例在上、下、居中
                padding: [15, 30, 0, 0], // 可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]

            },
            tooltip: {},
            grid: {
                x: 35,
                y: 10,
                x2: 1,
                y2: 35,
            },
            dataset: {
                dimensions: this.props.exlist,
                // ['product', '2012', '2013', '2017', '2018'],
                source: this.props.exmodellist,
                // [
                //     {'product': '大气', '2012': "43.3", '2013': 85.8, '2017': 93.7,'2018':111},
                //     {'product': 'Milk Tea', '2012': "83.1", '2013': 73.4, '2017': 55.1},
                //     {'product': 'Cheese Cocoa', '2012': "86.4", '2013': 65.2, '2017': 82.5},
                //     {'product': 'Walnut Brownie', '2012': "72.4", '2013': 53.9, '2017': 39.1}
                // ]
                // [{ "product": "实测烟尘", "连续值异常": "2" }, { "product": "流速", "连续值异常": "2" }, { "product": "流量", "连续值异常": "2" }, { "product": "烟气温度", "连续值异常": "2" }]
            },
            xAxis: {
                type: 'category',
                triggerEvent: true,
                // splitLine: {
                //     show: true,
                //     lineStyle: {
                //         type: 'dashed'
                //     }
                // },
            },
            yAxis: {
                triggerEvent: true,
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                    },
                },
            },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: this.props.excount,
            // this.state.bar,
            // [{type:"bar"},{type:"bar"}]
        }
        return (
            <div className={styles.cardTitle}>
                <Card
                    extra={
                        <div>
                            {/* <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} dateValue={this.state.rangeDate} allowClear={false} format={this.state.format} onChange={this._handleDateChange} showTime={this.state.format} /> */}
                            <GetpollutantSelect/>
                            <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} dateValue={this.state.rangeDate}
                                dataType={this.state.dataType}
                                format={this.state.format}
                                onRef={this.onRef1}
                                isVerification
                                callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                                allowClear={false} showTime={this.state.format} />

                            <ButtonGroup_ style={{ marginRight: 20, marginTop: 5 }} checked={this.state.dataType} onChange={this._handleDateTypeChange} />
                        </div>
                    }
                >
                    {/* <Card.Grid style={{ width: '100%', ...this.props.style }}> */}
                        {
                            this.props.exmodellistLoading ? <Spin
                                style={{
                                    width: '100%',
                                    height: 'calc(100vh/2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                size="large"
                            /> :
                                <div>
                                    {
                                        this.props.exmodellist.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <div>

                                            <ReactEcharts
                                                theme="light"
                                                option={option}
                                                lazyUpdate
                                                notMerge
                                                id="rightLine"
                                                onEvents={this.onclick}
                                                style={{
                                                    width: '100%',
                                                    height: 'calc(100vh - 520px)',
                                                    maxHeight: 280,
                                                    // height:130
                                                }}
                                            />
                                            {
                                                // this.props.exceptionDataLoading ? <Spin
                                                //     style={{
                                                //         width: '100%',
                                                //         height: 'calc(100vh/2)',
                                                //         display: 'flex',
                                                //         alignItems: 'center',
                                                //         justifyContent: 'center'
                                                //     }}
                                                //     size="large"
                                                // /> :
                                                //     <div style={{ width: '100%', height: '300px', overflow: "auto" }}>
                                                <SdlTable
                                                    loading={this.props.exceptionDataLoading}
                                                    // style={{ width: "400px", height: "500px" }}
                                                    style={{ paddingBottom: 0 }}
                                                    columns={column}
                                                    dataSource={this.props.exfirstData}
                                                    pagination={{
                                                        // showSizeChanger: true,
                                                        showQuickJumper: true,
                                                        pageSize: 20, // this.props.pageSize,
                                                        current: this.props.pageIndex,
                                                        onChange: this.onTableChange,
                                                        total: this.props.ExceptionTotal,
                                                    }}
                                                >
                                                </SdlTable>
                                                // </div>
                                            }
                                        </div>
                                    }</div>
                        }

                    {/* </Card.Grid> */}
                </Card>
            </div>
        );
    }
}

export default Index;
