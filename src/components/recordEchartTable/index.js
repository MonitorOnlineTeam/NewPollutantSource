import React, { Component } from 'react'
import { Form, Select, Input, Button, Drawer, Radio, Collapse, Table, Badge, Icon, Divider, Row, Tree, Empty, Col, Card } from 'antd';
import { connect } from 'dva';
import { EntIcon, GasIcon, WaterIcon, LegendIcon } from '@/utils/icon';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import styles from './index.less';
import RangePicker_ from '@/components/RangePicker'
import ButtonGroup_ from '@/components/ButtonGroup'
import moment from 'moment';




@connect(({ recordEchartTable, loading }) => ({
    exlist: recordEchartTable.exlist,
    excount: recordEchartTable.excount,
    exmodellist: recordEchartTable.exmodellist,
    exceptionData:recordEchartTable.exceptionData
}))
@Form.create()
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rangeDate: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
            format: 'YYYY-MM-DD HH:mm:ss',
            bar: [],
            column: [
                {
                    title: '监测时间',
                    dataIndex: 'ExceptionTime',
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
                    dataIndex: 'ExceptionType',
                },
            ]
        };
    }
    /** 初始化加载 */
    componentDidMount() {
        this.props.dispatch({
            type: "recordEchartTable/getexmodellist",
            payload: {
                "DGIMN": [
                    "62262431qlsp01"
                ],
                "dataType": "RealTimeData",
                "beginTime": "2019-05-08 23:29:00",
                "endTime": "2019-05-08 23:29:00"
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.excount != nextProps) {
            var barList = [];
            var item = { "type": 'bar', "barMaxWidth": '50' }
            var realItem = nextProps.excount > 4 ? { "type": 'bar' } : item
            for (var i = 0; i < nextProps.excount; i++) {
                barList.push(realItem);
            }
            this.setState({
                bar: barList
            })
        }
    }
    /** 数据类型切换 */
    _handleDateTypeChange = e => {
        let formats;
        let beginTime = moment(new Date()).add(-60, 'minutes');
        const endTime = moment(new Date());
        let { historyparams } = this.props;
        switch (e.target.value) {
            case 'realtime':
                beginTime = moment(new Date()).add(-60, 'minutes');
                formats = 'YYYY-MM-DD HH:mm:ss';
                break;
            case 'minute':
                beginTime = moment(new Date()).add(-1, 'day');
                formats = 'YYYY-MM-DD HH:mm';
                break;
            case 'hour':
                beginTime = moment(new Date()).add(-1, 'day');
                formats = 'YYYY-MM-DD HH';
                break;
            case 'day':
                beginTime = moment(new Date()).add(-1, 'month');
                formats = 'YYYY-MM-DD';
                break;
        }
        this.setState({
            rangeDate: [beginTime, endTime],
            format: formats,
        });
        historyparams = {
            ...historyparams,
            beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
            datatype: e.target.value,
        }
    }
    /** 切换时间 */
    _handleDateChange = (date, dateString) => {
        if (date) {
            let { historyparams } = this.props;
            // 判断
            switch (historyparams.dataType) {
                case 'realtime':
                    if (date[1].add(-7, 'day') > date[0]) {
                        message.info('实时数据时间间隔不能超过7天');
                        return;
                    }
                    break;
                case 'minute':
                    if (date[1].add(-1, 'month') > date[0]) {
                        message.info('分钟数据时间间隔不能超过1个月');
                        return;
                    }
                    break;
                case 'hour':
                    if (date[1].add(-6, 'month') > date[0]) {
                        message.info('小时数据时间间隔不能超过6个月');
                        return;
                    }
                    break;
                case 'day':
                    if (date[1].add(-12, 'month') > date[0]) {
                        message.info('日数据时间间隔不能超过1年个月');
                        return;
                    }
                    break;
            }
            this.setState({ rangeDate: date });
            historyparams = {
                ...historyparams,
                beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
                endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
            }
        }
    };
    onclick = {
        'click': this.clickEchartsPie.bind(this)
    }
    clickEchartsPie(e) {
        var name = e.name
        var seriesName = e.seriesName
        this.props.dispatch({
            type: "recordEchartTable/getexceptiondata",
            payload: {
                "DGIMN": [
                    "62262431qlsp01"
                ],
                "dataType": "RealTimeData",
                "beginTime": "2019-05-08 23:29:00",
                "endTime": "2019-05-08 23:29:00",
                "Pollutant": name,
                "ExceptionType": seriesName
            }
        })
        console.log(e)
    }
    render() {
        const { column } = this.state
        const data = [
            {
              key: '1',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '2',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号',
            },
          ];
          
          const columns = [
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '年龄',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: '住址',
              dataIndex: 'address',
              key: 'address',
            },
          ];
        const option = {
            legend: {},
            tooltip: {},
            dataset: {
                dimensions: this.props.exlist,
                // ['product', '2012', '2013', '2017', '2018'],
                source: this.props.exmodellist
                // [
                //     {'product': '大气', '2012': "43.3", '2013': 85.8, '2017': 93.7,'2018':111},
                //     {'product': 'Milk Tea', '2012': "83.1", '2013': 73.4, '2017': 55.1},
                //     {'product': 'Cheese Cocoa', '2012': "86.4", '2013': 65.2, '2017': 82.5},
                //     {'product': 'Walnut Brownie', '2012': "72.4", '2013': 53.9, '2017': 39.1}
                // ]
                //[{ "product": "实测烟尘", "连续值异常": "2" }, { "product": "流速", "连续值异常": "2" }, { "product": "流量", "连续值异常": "2" }, { "product": "烟气温度", "连续值异常": "2" }]
            },
            xAxis: { type: 'category', triggerEvent: true },
            yAxis: { triggerEvent: true },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: this.state.bar,
            // [{type:"bar"},{type:"bar"}]
        }
        return (
            <div className={styles.cardTitle}>
                <Card
                    extra={
                        <div>
                            <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} dateValue={this.state.rangeDate} format={this.state.formats} onChange={this._handleDateChange} />
                            <ButtonGroup_ style={{ marginRight: 20 }} checked="realtime" onChange={this._handleDateTypeChange} />
                        </div>
                    }
                    style={{ width: '100%', height: 'calc(100vh - 230px)' }}
                >
                    <ReactEcharts
                        theme="light"
                        option={option}
                        lazyUpdate
                        notMerge
                        id="rightLine"
                        onEvents={this.onclick}
                        style={{ width: '100%', height: 'calc(100vh - 700px)' }}
                    />
                    {console.log('exceptionData=',this.props.exceptionData)}
                    <Table
                        // style={{ maxHeight: "400px", height: "500px" }}
                        // style={{ width: "400px", height: "500px" }}
                        column={columns}
                         dataSource={data}
                    >
                    </Table>
                </Card>
            </div>
        );
    }
}

export default Index;