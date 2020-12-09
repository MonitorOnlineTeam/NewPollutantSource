/*
 * @Author: lzp
 * @Date: 2019-07-30 15:56:47
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-17 15:32:28
 * @Description: 超标记录
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
    overlist: recordEchartTable.overlist,
    overcount: recordEchartTable.overcount,
    overmodellist: recordEchartTable.overmodellist,
    overmodellistLoading: loading.effects['recordEchartTable/getovermodellist'],
    overData: recordEchartTable.overData,
    overDataLoading: loading.effects['recordEchartTable/getoverdata'],
    overfirstData: recordEchartTable.overfirstData,
    OverTotal: recordEchartTable.OverTotal,
    pageSize: recordEchartTable.pageSize,
    pageIndex: recordEchartTable.pageIndex,
}))
@Form.create()
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code:[],
            rangeDate: this.props.noticeState == 0 ? [this.props.firsttime, this.props.lasttime] : [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
            format: this.props.noticeState == 0 ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD HH:mm:ss',
            bar: [],
            dataType:'',
            DGIMN: [],
            beginTime: this.props.noticeState == 0 ? this.props.firsttime.format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: this.props.noticeState == 0 ? this.props.lasttime.format('YYYY-MM-DD HH:mm:ss') : '',
            Pollutant: '',
            ExceptionType: '',
            column: [
                {
                    title: '污染物',
                    dataIndex: 'PollutantCode',
                    align: 'center',
                },
                {
                    title: '监测时间',
                    dataIndex: 'OverTime',
                    align: 'center',
                },
                {
                    title: '监测数值',
                    dataIndex: 'MonitorValue',
                    align: 'center',
                },
                {
                    title: '标准值',
                    dataIndex: 'StandValue',
                    align: 'center',
                },
                {
                    title: '超标倍数',
                    dataIndex: 'OverShoot',
                    align: 'center',
                },
                {
                    title: '超标类型',
                    dataIndex: 'AlarmType',
                    align: 'center',
                },
            ],
        };
    }

    /** 初始化加载 */
    componentDidMount() {
      this.initData()
    }
 initData=()=>{
    const { location,initLoadData,dispatch } = this.props;
    if(location.query&&location.query.type==="alarm"){ //报警信息
       const paraCodeList  = location.query.code;
       const startTime = location.query.startTime;
       const endTime = location.query.endTime;

       const DATATYPE = {
        RealTimeData:"realtime",
        MinuteData:"minute",
        HourData:"hour",
        DayData : 'day',
        loadtype:''
     }
       this.setState({loadtype:location.query.loadtype?location.query.loadtype:''},()=>{
        this.children.onDateChange([ moment(moment(new Date()).format('YYYY-MM-DD 00:00:00')), moment( moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))])//修改日期选择日期  .onDateChange([ moment(moment(new Date()).format('YYYY-MM-DD 00:00:00')), moment( moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))])//修改日期选择日期   
        this.setState({
           beginTime: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
           endTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
           code:paraCodeList.split(","),
           dataType:location.query.dataType? DATATYPE[location.query.dataType] :'',
          }, () => {
           initLoadData && this.getLoadData(this.props.DGIMN);
           this.setState({loadtype:''})
        })
       })



    }else{
        const beginTime = moment(new Date()).add(-60, 'minutes');
        const endTime = moment(new Date());
        if (this.props.noticeState == 0) {
            this.setState({dataType:"hour"})
            this.getLoadData(this.props.DGIMN)
        } else {
            this.setState({
                dataType:'realtime',
                beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
                endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
            }, () => {
                initLoadData && this.getLoadData(this.props.DGIMN);
            })
        }

    }
 }


    componentWillReceiveProps(nextProps) {
        const {location }  = this.props;
        // if (nextProps.DGIMN && this.props.DGIMN != nextProps.DGIMN) {
        //     this.getLoadData(nextProps.DGIMN);
        // }
        if (location.query.startTime != nextProps.location.query.startTime) {
            this.initData();

        }
    }


    getLoadData = DGIMN => {
        const  { location } = this.props;
        const { code } = this.state;
        const beginTime = moment(new Date()).add(-60, 'minutes');
        const endTime = moment(new Date());
        this.props.dispatch({
            type: 'recordEchartTable/updateState',
            payload: {
                overData: [],
            },
        })


        this.props.dispatch({
            type: 'recordEchartTable/getovermodellist',
            payload: {
                beginTime: this.state.beginTime,
                endTime: this.state.endTime,
                dataType: this.state.dataType,
                DGIMN: [DGIMN],
                PollutantList: code
            },
        })
    }


    onclick = {
        click: this.clickEchartsPie.bind(this),
    }

    clickEchartsPie(e) {
        const { name } = e
        // var seriesName = e.seriesName
        this.props.dispatch({
            type: 'recordEchartTable/updateState',
            payload: {
                overfirstData: [],
                pageIndex: 1,
            },
        })
        this.setState({
            Pollutant: name,
        })
        this.props.dispatch({
            type: 'recordEchartTable/getoverdata',
            payload: {
                beginTime: this.state.beginTime,
                endTime: this.state.endTime,
                dataType: this.state.dataType,
                DGIMN: [this.props.DGIMN],
                Pollutant: e.name?e.name:e.value,
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
                type: 'recordEchartTable/getoverdata',
                payload: {
                    beginTime: this.state.beginTime,
                    endTime: this.state.endTime,
                    dataType: this.state.dataType,
                    DGIMN: [this.props.DGIMN],
                    Pollutant: this.state.Pollutant == '' ? this.props.overmodellist[0].product : this.state.Pollutant,
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
    dateCallback = (date, dataType) => {
        if (!this.props.DGIMN) { return; }
        if(this.state.loadtype){ return; }
        if(this.state.code&&this.state.dataType){

            this.setState({
                beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
                endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
            });
            this.props.dispatch({
                type: 'recordEchartTable/updateState',
                payload: {
                    overData: [],
                    pageIndex: 1,
                },
            })
            this.props.dispatch({
            type: 'recordEchartTable/getovermodellist',
            payload: {
                beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
                endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
                dataType,
                PollutantList: this.state.code,
                DGIMN: [this.props.DGIMN],
            },
        })
    
     }
    }

    onRef1 = ref => {
        this.children = ref;
    }
    pollChange=(value)=>{
      this.setState({code:value})
    }
    getpollutantSelect = () => {
        const { DGIMN,location} = this.props;
         const {code } = this.state;
        if(location&&location.query&&location.query.type==="alarm"){ //报警信息
            return   code.length>0 ? <PollutantDownSelect style={{ width: 200, marginRight: 10 }} customcode={code}  onRef={this.childSelect} onChange={this.pollChange} dgimn={DGIMN}  />:null  ; 
        }else{
            return   <PollutantDownSelect style={{ width: 200, marginRight: 10 }}  isdefaulltall={1}   onRef={this.childSelect} onChange={this.pollChange} dgimn={DGIMN}  />  ; 
        }
        return null
      }

    render() {
        const { column } = this.state
        const option = {
            legend: {
                orient: 'vertical',
                x: 'right', // 可设定图例在左、右、居中
                y: 'top', // 可设定图例在上、下、居中
                padding: [15, 30, 0, 0], // 可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]

            },
            grid: {
                x: 50,
                y: 10,
                x2: 35,
                y2: 35,
            },
            tooltip: {},
            dataset: {
                dimensions: this.props.overlist,
                // ['product', '2012', '2013', '2017', '2018'],
                source: this.props.overmodellist,
                // [
                //     {'product': '大气', '2012': "43.3", '2013': 85.8, '2017': 93.7,'2018':111},
                //     {'product': 'Milk Tea', '2012': "83.1", '2013': 73.4, '2017': 55.1},
                //     {'product': 'Cheese Cocoa', '2012': "86.4", '2013': 65.2, '2017': 82.5},
                //     {'product': 'Walnut Brownie', '2012': "72.4", '2013': 53.9, '2017': 39.1}
                // ]
                // [{ "product": "实测烟尘", "连续值异常": "2" }, { "product": "流速", "连续值异常": "2" }, { "product": "流量", "连续值异常": "2" }, { "product": "烟气温度", "连续值异常": "2" }]
            },
            xAxis: { type: 'category', triggerEvent: true },
            yAxis: {
                triggerEvent: true,
splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                    },
                },
            },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: this.props.overcount,
            // [{type:"bar"},{type:"bar"}]
        }

        const GetpollutantSelect = this.getpollutantSelect;
        return (
            <div className={styles.cardTitle}>
                <Card
                    extra={
                        <div>
                     
                            <GetpollutantSelect/>
                            <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} dateValue={this.state.rangeDate}
                                dataType={this.state.dataType}
                                // format={this.state.format}
                                onRef={this.onRef1}
                                isVerification
                                callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                                allowClear={false} showTime={this.state.format} />

                            {this.props.noticeState == 0 ? <Button key={3} value="hour">小时</Button> : <ButtonGroup_ style={{ marginRight: 20, marginTop: 5 }} checked={this.state.dataType} onChange={this._handleDateTypeChange} />}
                        </div>
                    }
                >
                    {/* <Card.Grid style={{ width: '100%', height: 'calc(100vh - 260px)', overflow: 'auto', ...this.props.style }}> */}
                    {
                        this.props.overmodellistLoading ? <Spin
                            style={{
                                width: '100%',
                                height: 'calc(100vh/2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            size="large"
                        /> :
                            <div> {
                                this.props.overmodellist.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <div>

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
                                        }}
                                    />

                                    {
                                        // this.props.overDataLoading ? <Spin
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
                                            loading={this.props.overDataLoading}
                                            scroll={{ y: 'calc(100vh - 620px)'}}
                                            style={{ paddingBottom: 0 }}
                                            columns={column}
                                            dataSource={this.props.overfirstData}
                                            pagination={{
                                                // showSizeChanger: true,
                                                showQuickJumper: true,
                                                pageSize: 20, // this.props.pageSize,
                                                current: this.props.pageIndex,
                                                onChange: this.onTableChange,
                                                total: this.props.OverTotal,
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
