/*
 * @Author: lzp
 * @Date: 2019-07-30 15:56:47
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-17 15:32:28
 * @Description: 超标记录
 */
import React, { Component } from 'react'
import { Form, Select, Input, Button, Drawer, Radio, Collapse, Table, Badge, Icon, Divider, Row, Tree, Empty, Col, Card, Spin, message } from 'antd';
import { connect } from 'dva';
import { EntIcon, GasIcon, WaterIcon, LegendIcon } from '@/utils/icon';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import styles from './index.less';
import RangePicker_ from '@/components/RangePicker'
import ButtonGroup_ from '@/components/ButtonGroup'


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
            rangeDate: this.props.noticeState == 0 ? [this.props.firsttime, this.props.lasttime] : [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
            format: this.props.noticeState == 0 ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD HH:mm:ss',
            bar: [],
            dataType: this.props.noticeState == 0 ? 'HourData' : 'RealTimeData',
            DGIMN: [],
            beginTime: this.props.noticeState == 0 ? this.props.firsttime.format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: this.props.noticeState == 0 ? this.props.lasttime.format('YYYY-MM-DD HH:mm:ss') : '',
            Pollutant: '',
            ExceptionType: '',
            column: [
                {
                    title: '污染物',
                    dataIndex: 'PollutantCode',
                },
                {
                    title: '监测时间',
                    dataIndex: 'OverTime',
                },
                {
                    title: '监测数值',
                    dataIndex: 'MonitorValue',
                },
                {
                    title: '标准值',
                    dataIndex: 'StandValue',
                },
                {
                    title: '超标倍数',
                    dataIndex: 'OverShoot',
                },
                {
                    title: '超标类型',
                    dataIndex: 'AlarmType',
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
        debugger
        const beginTime = moment(new Date()).add(-60, 'minutes');
        const endTime = moment(new Date());
        if (this.props.noticeState == 0) {
            this.getLoadData(this.props)
        } else {
            this.setState({
                beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
                endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
            }, () => {
                this.props.initLoadData && this.getLoadData(this.props);
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        // if (this.props.overcount != nextProps.overcount) {
        //     var barList = [];
        //     var item = { "type": 'bar', "barMaxWidth": '50' }
        //     var realItem = nextProps.overcount > 4 ? { "type": 'bar' } : item
        //     for (var i = 0; i < nextProps.overcount; i++) {
        //         barList.push(realItem);
        //     }
        //     this.setState({
        //         bar: barList
        //     })
        // }
        if (nextProps.DGIMN &&this.props.DGIMN != nextProps.DGIMN) {
            this.getLoadData(nextProps);
        }
        // if (this.props.firsttime != nextProps.firsttime) {
        //     console.log('firsttime=',nextProps)
        //     this.setState({
        //         beginTime: nextProps.firsttime,
        //         endTime: nextProps.lasttime,
        //         rangeDate: [nextProps.firsttime, nextProps.lasttime],
        //     })
        // }
        // if (this.props.noticeState != nextProps.noticeState) {
        //     console.log('notice=',nextProps)
        //     if(nextProps.noticeState==0)
        //     {
        //         this.setState({
        //             formats: 'YYYY-MM-DD HH',
        //             dataType: "HourData",
        //         })
        //     }
        // }
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
                overData: [],
            },
        })
        this.props.dispatch({
            type: 'recordEchartTable/getovermodellist',
            payload: {
                beginTime: this.state.beginTime == '' ? beginTime.format('YYYY-MM-DD HH:mm:ss') : this.state.beginTime,
                endTime: this.state.endTime == '' ? endTime.format('YYYY-MM-DD HH:mm:ss') : this.state.endTime,
                dataType: this.state.dataType,
                DGIMN: [nextProps.DGIMN],
            },
        })
    }

    // }
    /** 数据类型切换 */
    _handleDateTypeChange = e => {
        let formats;
        let beginTime = moment(new Date()).add(-60, 'minutes');
        const endTime = moment(new Date());
        let { dataType } = this.state
        switch (e.target.value) {
            case 'realtime':
                beginTime = moment(new Date()).add(-60, 'minutes');
                formats = 'YYYY-MM-DD HH:mm:ss';
                dataType = 'RealTimeData'
                break;
            case 'minute':
                beginTime = moment(new Date()).add(-1, 'day');
                formats = 'YYYY-MM-DD HH:mm';
                dataType = 'MinuteData'
                break;
            case 'hour':
                beginTime = moment(new Date()).add(-1, 'day');
                formats = 'YYYY-MM-DD HH';
                dataType = 'HourData'
                break;
            case 'day':
                beginTime = moment(new Date()).add(-1, 'month');
                formats = 'YYYY-MM-DD';
                dataType = 'DayData'
                break;
        }
        //
        this.setState({
            rangeDate: [beginTime, endTime],
            format: formats,
            beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
            dataType,
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
                beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
                endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
                dataType,
                DGIMN: [this.props.DGIMN],
            },
        })
    }

    /** 切换时间 */
    _handleDateChange = (date, dateString) => {
        if (date) {
            // 判断
            console.log('dateString=', dateString)
            let hisData = [];
            hisData = hisData.concat(date);
            switch (this.state.dataType) {
                case 'RealTimeData':
                    if (hisData[1].add(-7, 'day') > hisData[0]) {
                        message.info('实时数据时间间隔不能超过7天');
                        return;
                    }
                    hisData[1].add(+7, 'day')
                    break;
                case 'MinuteData':
                    if (hisData[1].add(-1, 'month') > hisData[0]) {
                        message.info('分钟数据时间间隔不能超过1个月');
                        return;
                    }
                    hisData[1].add(+1, 'month')
                    break;
                case 'HourData':
                    if (hisData[1].add(-6, 'month') > hisData[0]) {
                        message.info('小时数据时间间隔不能超过6个月');
                        return;
                    }
                    hisData[1].add(+6, 'month')
                    break;
                case 'DayData':
                    if (hisData[1].add(-12, 'month') > hisData[0]) {
                        message.info('日数据时间间隔不能超过1年个月');
                        return;
                    }
                    hisData[1].add(+12, 'month')
                    break;
                default:
                    return;
            }
            console.log('hisData=', hisData)
            console.log('date=', date)
            this.setState({
                rangeDate: date,
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
                    dataType: this.state.dataType,
                    DGIMN: [this.props.DGIMN],
                },
            })
        }
    };

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
                Pollutant: e.name,
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

    render() {
        const { column } = this.state
        const option = {
            legend: {},
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
            yAxis: { triggerEvent: true },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: this.props.overcount,
            // [{type:"bar"},{type:"bar"}]
        }
        return (
            <div className={styles.cardTitle}>
                <Card
                    extra={
                        <div>
                            <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} dateValue={this.state.rangeDate} format={this.state.format} onChange={this._handleDateChange} showTime={this.state.format} />
                            {this.props.noticeState == 0 ? <Button key={3} value="hour">小时</Button> : <ButtonGroup_ style={{ marginRight: 20 }} checked="realtime" onChange={this._handleDateTypeChange} />}
                        </div>
                    }
                >
                    <Card.Grid style={{ width: '100%', height: 'calc(100vh - 230px)', overflow: 'auto', ...this.props.style }}>
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
                                            style={{ width: '100%', height: 'calc(100vh - 700px)', minHeight: '200px' }}
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
                                                scroll={{ y: this.props.maxHeight || 300 }}
                                                // style={{  minHeight: "200px" }}
                                                columns={column}
                                                dataSource={this.props.overfirstData}
                                                pagination={{
                                                    // showSizeChanger: true,
                                                    showQuickJumper: true,
                                                    pageSize: this.props.pageSize,
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

                    </Card.Grid>
                </Card>
            </div>
        );
    }
}

export default Index;
