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
            dataType: this.props.noticeState == 0 ? 'HourData' : 'RealTimeData',
            _dataType: this.props.noticeState == 0 ? 'hour' : 'realtime',
            DGIMN: [],
            beginTime: '',
            endTime: '',
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
        // let { historyparams } = this.props;
        // historyparams = {
        //     ...historyparams,
        //    DGIMN:this.props.DGIMNs
        // }
        // this.props.dispatch({
        //     type: 'recordEchartTable/updateState',
        //     payload: {
        //         historyparams,
        //     },
        // })
        const beginTime = moment(new Date()).add(-60, 'minutes');
        const endTime = moment(new Date());
        this.setState({
            beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        }, () => {
            this.props.initLoadData && this.getLoadData(this.props);
        })
    }

    componentWillReceiveProps(nextProps) {
        // if (this.props.excount != nextProps.excount) {
        //     var barList = [];
        //     var item = { "type": 'bar', "barMaxWidth": '50' }
        //     var realItem = nextProps.excount > 4 ? { "type": 'bar' } : item
        //     for (var i = 0; i < nextProps.excount; i++) {
        //         barList.push(realItem);
        //     }
        //     this.setState({
        //         bar: barList
        //     })
        // }

        if (this.props.DGIMN != nextProps.DGIMN) {
            this.getLoadData(nextProps);
        }
    }
    // /** 后台请求数据 */
    // reloaddatalist = () => {
    //     const {
    //         dispatch,
    //     } = this.props;
    //     console.log("dgmn=",this.props.DGIMN)

    getLoadData = nextProps => {
        const beginTime = moment(new Date()).add(-60, 'minutes');
        const endTime = moment(new Date());
        this.props.dispatch({
            type: 'recordEchartTable/updateState',
            payload: {
                exceptionData: [],
            },
        })
        if (this.props.startTimes && this.props.endTimes) {
            this.props.dispatch({
                type: 'recordEchartTable/getexmodellist',
                payload: {
                    beginTime: this.props.startTimes == '' ? beginTime.format('YYYY-MM-DD HH:mm:ss') : this.props.startTimes,
                    endTime: this.props.endTimes == '' ? endTime.format('YYYY-MM-DD HH:mm:ss') : this.props.endTimes,
                    dataType: this.state.dataType,
                    DGIMN: [nextProps.DGIMN],
                },
            })
        } else {
            this.props.dispatch({
                type: 'recordEchartTable/getexmodellist',
                payload: {
                    beginTime: this.state.beginTime == '' ? beginTime.format('YYYY-MM-DD HH:mm:ss') : this.state.beginTime,
                    endTime: this.state.endTime == '' ? endTime.format('YYYY-MM-DD HH:mm:ss') : this.state.endTime,
                    dataType: this.state.dataType,
                    DGIMN: [nextProps.DGIMN],
                },
            })
        }
    }

    // }
    /** 数据类型切换 */
    // _handleDateTypeChange = e => {
    //     let formats;
    //     let beginTime = moment(new Date()).add(-60, 'minutes');
    //     const endTime = moment(new Date());
    //     let { dataType } = this.state
    //     switch (e.target.value) {
    //         case 'realtime':
    //             beginTime = moment(new Date()).add(-60, 'minutes');
    //             formats = 'YYYY-MM-DD HH:mm:ss';
    //             dataType = 'RealTimeData'
    //             break;
    //         case 'minute':
    //             beginTime = moment(new Date()).add(-1, 'day');
    //             formats = 'YYYY-MM-DD HH:mm';
    //             dataType = 'MinuteData'
    //             break;
    //         case 'hour':
    //             beginTime = moment(new Date()).add(-1, 'day');
    //             formats = 'YYYY-MM-DD HH';
    //             dataType = 'HourData'
    //             break;
    //         case 'day':
    //             beginTime = moment(new Date()).add(-1, 'month');
    //             formats = 'YYYY-MM-DD';
    //             dataType = 'DayData'
    //             break;
    //     }
    //     //
    //     this.setState({
    //         rangeDate: [beginTime, endTime],
    //         format: formats,
    //         beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
    //         endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
    //         dataType,
    //     });
    //     this.props.dispatch({
    //         type: 'recordEchartTable/updateState',
    //         payload: {
    //             exceptionData: [],
    //             pageIndex: 1,
    //         },
    //     })
    //     this.props.dispatch({
    //         type: 'recordEchartTable/getexmodellist',
    //         payload: {
    //             beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
    //             endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
    //             dataType,
    //             DGIMN: [this.props.DGIMN],
    //         },
    //     })
    // }

    /** 切换时间 */
    // _handleDateChange = (date, dateString) => {
    //     alert()
    //     if (date) {
    //         // 判断

    //         switch (this.state.dataType) {
    //             case 'RealTimeData':
    //                 if (date[1].add(-7, 'day') > date[0]) {
    //                     message.info('实时数据时间间隔不能超过7天');
    //                     return;
    //                 }
    //                 date[1].add(+7, 'day')
    //                 break;
    //             case 'MinuteData':
    //                 if (date[1].add(-1, 'month') > date[0]) {
    //                     message.info('分钟数据时间间隔不能超过1个月');
    //                     return;
    //                 }
    //                 date[1].add(+1, 'month')
    //                 break;
    //             case 'HourData':
    //                 if (date[1].add(-6, 'month') > date[0]) {
    //                     message.info('小时数据时间间隔不能超过6个月');
    //                     return;
    //                 }
    //                 date[1].add(+6, 'month')
    //                 break;
    //             case 'DayData':
    //                 if (date[1].add(-12, 'month') > date[0]) {
    //                     message.info('日数据时间间隔不能超过1年');
    //                     return;
    //                 }
    //                 date[1].add(+12, 'month')
    //                 break;
    //             default:
    //                 return;
    //         }

    //         this.setState({
    //             rangeDate: date,
    //             beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
    //             endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),

    //         });
    //         this.props.dispatch({
    //             type: 'recordEchartTable/updateState',
    //             payload: {
    //                 exceptionData: [],
    //                 pageIndex: 1,
    //             },
    //         })

    //         this.props.dispatch({
    //             type: 'recordEchartTable/getexmodellist',
    //             payload: {
    //                 beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
    //                 endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    //                 dataType: this.state.dataType,
    //                 DGIMN: [this.props.DGIMN],
    //             },
    //         })
    //     }
    // };

    onclick = {
        click: this.clickEchartsPie.bind(this),
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
        console.log(e)
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
        this.setState({ dataType, _dataType: dataType });
        this.children.onDataTypeChange(dataType);
    }


    /**
   * 回调获取时间并重新请求数据
   */
    dateCallback = (dates, dataType) => {
        if (!this.props.DGIMN) { return; }
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
            },
        })
    }

    onRef1 = ref => {
        this.children = ref;
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
                            <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} dateValue={this.state.rangeDate}
                                dataType={this.state.dataType}
                                format={this.state.format}
                                onRef={this.onRef1}
                                isVerification
                                callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                                allowClear={false} showTime={this.state.format} />

                            <ButtonGroup_ hideButtons={this.props.hideButtons} style={{ marginRight: 20, marginTop: 5 }} checked={this.state._dataType} onChange={this._handleDateTypeChange} />
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
                                                scroll={{ y: this.props.tableHeight || undefined }}
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
